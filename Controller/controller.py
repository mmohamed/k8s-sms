from kubernetes import client, config, watch
from kubernetes.client.rest import ApiException

import logging
import sys
import json
import base64

import annotations

log = logging.getLogger(__name__)

out_hdlr = logging.StreamHandler(sys.stdout)
out_hdlr.setFormatter(logging.Formatter('%(asctime)s %(message)s'))
out_hdlr.setLevel(logging.INFO)

log.addHandler(out_hdlr)
log.setLevel(logging.INFO)

# config.load_incluster_config()
config.load_kube_config()

api_instance = client.AppsV1Api(client.ApiClient())
w = watch.Watch()

api_core = client.CoreV1Api()

smsGroups = {}

def loop():
  log.info("Controller started...")
  try:
    for event in w.stream(api_instance.list_deployment_for_all_namespaces, _request_timeout=0):
      process(event['type'], event['object'])
  except KeyboardInterrupt as e:
    log.info("Controller shutdown.")



def process(event, deployment):
  if deployment.metadata.annotations:
    
    anno = deployment.metadata.annotations

    if annotations.GROUP in anno:
      
      group = anno[annotations.GROUP]
      port = anno[annotations.PORT] if annotations.PORT in anno else 80
      service = anno[annotations.SERVICE] if annotations.SERVICE in anno else False
      revision = anno[annotations.REVISION] if annotations.REVISION in anno else 0
      meta = anno[annotations.METADATA] if annotations.METADATA in anno else ""
      
      if group not in smsGroups:
        smsGroups[group] = []

      deploymentKey = deployment.metadata.namespace + '-' + deployment.metadata.name

      if event != "REMOVED":        
        addToGroup(group=group, deploymentKey=deploymentKey, service=service)

        if meta == metadata(group=group, port=port, service=service, revision=int(revision)):
          log.info("Deployment {} already processed".format(deploymentKey))
        else:  
          injectSidecar(deployment=deployment, group=group, port=port, service=service, revision=revision)
          log.info("Creating process for deployment : {} finished".format(deploymentKey))

      if event != "REMOVED" and service != False:
        upService(service=service, namespace=deployment.metadata.namespace, port=port, deployment=deployment.metadata.name)

      if event == "REMOVED":
        removeFromGroup(group,deploymentKey)
      
      if event == "REMOVED" and service != False:
        reverseService(service=service, namespace=deployment.metadata.namespace, port=port, deployment=deployment.metadata.name)
      
          
""" 
Add deployment to service group
"""
def addToGroup(group, deploymentKey, service):
  founded = False
  for deployment in smsGroups[group]:
    if deployment['key'] == deploymentKey:
      founded = True
      break
  if not founded:
    smsGroups[group].append({"key": deploymentKey, "service": service})

""" 
Remove deployment to service group
"""
def removeFromGroup(group, deploymentKey):
  for deployment in smsGroups[group]:
    if deployment['key'] == deploymentKey:
      smsGroups[group].remove(deployment)
      break

""" 
Inject sidecar container base on nginx proxy configuration 
"""
def injectSidecar(deployment, group, port, service, revision = 0):
  log.info("Injecting sidecar process for deployment : {}-{}, group : {}, port : {}, service : {}".format(deployment.metadata.namespace, deployment.metadata.name, group, port, service))
  # Create/Patch config map
  proxyConfigFilename = "proxy-" + deployment.metadata.name
  
  configMapStatus = setProxyConfigMap(name=deployment.metadata.name, namespace=deployment.metadata.namespace, filename=proxyConfigFilename, port=port)
  
  if configMapStatus ==  False:
    log.error("Unable to make Proxy Config Map")

  container = client.V1Container(
        name="sidecar",
        image="medinvention/nginx:1.17.10",
        ports=[client.V1ContainerPort(container_port=80)],
        env=[
          client.V1EnvVar(name="POD_NAME", value_from=client.V1EnvVarSource(field_ref=client.V1ObjectFieldSelector(field_path="metadata.name"))),
          client.V1EnvVar(name="POD_NAMESPACE", value_from=client.V1EnvVarSource(field_ref=client.V1ObjectFieldSelector(field_path="metadata.namespace"))),
          client.V1EnvVar(name="POD_IP", value_from=client.V1EnvVarSource(field_ref=client.V1ObjectFieldSelector(field_path="status.podIP"))),
          client.V1EnvVar(name="NODE_GROUP", value=group),
          client.V1EnvVar(name="NODE_SERVICE", value=service if service != False else deployment.metadata.name),
          client.V1EnvVar(name="NODE_SERVICE_PORT", value=port)
        ],
        lifecycle=client.V1Lifecycle(
          post_start=client.V1Handler(_exec=client.V1ExecAction(command=["/bin/sh","/var/register"])), 
          pre_stop=client.V1Handler(_exec=client.V1ExecAction(command=["/bin/sh","/var/unregister"]))),
        volume_mounts=[
          client.V1VolumeMount(name="sms-volume", sub_path=proxyConfigFilename, mount_path="/etc/nginx/conf.d/default.conf"),
          client.V1VolumeMount(name="sms-volume", sub_path="register", mount_path="/var/register"),
          client.V1VolumeMount(name="sms-volume", sub_path="unregister", mount_path="/var/unregister")])
  
  template = client.V1PodTemplateSpec(
        spec=client.V1PodSpec(
          containers=[container], 
          volumes=[client.V1Volume(name="sms-volume", config_map=client.V1ConfigMapVolumeSource(name="sms-files"))]
          )
        ) 
  
  spec = client.V1DeploymentSpec(template=template, selector=deployment.spec.selector)
  
  patch = client.V1Deployment(metadata=client.V1ObjectMeta(annotations={
    annotations.METADATA : metadata(group=group, port=port, service=service, revision=int(revision)+1), 
    annotations.REVISION : str(int(revision)+1)}),spec=spec
  )
  try:
    response = api_instance.patch_namespaced_deployment(deployment.metadata.name, deployment.metadata.namespace, patch)
    log.info("Patch deployment to add Sidecar for {}".format(deployment.metadata.name))
    return True
  except ApiException as e:
    log.error("Exception when patching deployment: {}".format(e))
    return False

"""
Update service to change target port 
"""
def upService(service, namespace, port, deployment):
  serviceList = []
  try:
    serviceList = api_core.list_namespaced_service(namespace, field_selector="metadata.name="+service).items
  except ApiException as e:
    log.error("Exception when getting list of Service: {}".format(e))

  if len(serviceList) !=  1:
    log.error("Target service {} not found in namespace {}".format(service, namespace))
    return False
  
  serviceData = serviceList[0]
  up = False
  for portDef in serviceData.spec.ports:
    if str(portDef.target_port) == str(port):
      portDef.target_port = 80
      up = True

  if not up:
    return False

  serviceData.metadata.annotations[annotations.DEPLOYMENT] = deployment
  serviceData.metadata.annotations[annotations.PORT] = str(port)

  try:
    api_core.patch_namespaced_service(name=service, body=serviceData, namespace=namespace)
    log.info("Patch Service {}".format(service))
  except ApiException as e:
    log.error("Exception when Patching service: {}".format(e))
    return False
  return True

"""
Reverse service to restore target port 
"""
def reverseService(service, namespace, port, deployment):
  serviceList = []
  try:
    serviceList = api_core.list_namespaced_service(namespace, field_selector="metadata.name="+service).items
  except ApiException as e:
    log.error("Exception when getting list of Service: {}".format(e))

  if len(serviceList) !=  1:
    log.error("Target service {} not found in namespace {}".format(service, namespace))
    return False
  
  serviceData = serviceList[0]
  up = False

  if not annotations.DEPLOYMENT in serviceData.metadata.annotations or not annotations.PORT in serviceData.metadata.annotations:
    return False

  for portDef in serviceData.spec.ports:
    if str(portDef.target_port) == "80":
      portDef.target_port = str(port)
      up = True

  if not up:
    return False

  del serviceData.metadata.annotations[annotations.DEPLOYMENT]
  del serviceData.metadata.annotations[annotations.PORT]

  try:
    api_core.patch_namespaced_service(name=service, body=serviceData, namespace=namespace)
    log.info("Patch Service {}".format(service))
  except ApiException as e:
    log.error("Exception when Patching service: {}".format(e))
    return False
  return True

""" 
Generate metadata for deployment 
"""
def metadata(group, port, service, revision):
  metadata = json.dumps({"group": group, "port": port, "service": service, "revision": revision})
  return str(base64.b64encode(metadata.encode("utf-8")))

""" 
Create or get a config map defining proxy config file 
"""
def setProxyConfigMap(name, namespace, filename, port):
  proxyConfigMapName = "sms-files"
  configMaps = []
  try:
    configMaps = api_core.list_namespaced_config_map(namespace, field_selector="metadata.name="+proxyConfigMapName).items
  except ApiException as e:
    log.error("Exception when getting list of Config Map: {}".format(e))

  configMap = {
        "apiVersion": "v1",
        "kind": "ConfigMap",
        "metadata": {
            "name": proxyConfigMapName,
            "namespace": namespace
        },
        "data": {
            filename: """
              log_format info '$remote_addr - $remote_user [$time_local] '
                          '"$request" $status $body_bytes_sent '
                          '"$http_referer" "$http_user_agent" - '
                          'rt=$request_time uct=$upstream_connect_time uht=$upstream_header_time urt=$upstream_response_time';
              server {
                listen 80;
                location / {
                    proxy_set_header HOST $host;
                    proxy_set_header X-Forwarded-Proto $scheme;
                    proxy_set_header X-Real-IP $remote_addr;
                    proxy_pass http://localhost:"""+str(port)+""";
                }
                error_log  syslog:server=fluentd-service.kube-sms.svc.cluster.local:5140,facility=local6,tag=system,severity=debug info;
                access_log syslog:server=fluentd-service.kube-sms.svc.cluster.local:5140,facility=local7,tag=system,severity=info info;
              }
            """,
            "register": """
              data="{'group': '$NODE_GROUP', 'service': '$NODE_SERVICE', 'port': '$NODE_SERVICE_PORT', 'host': '$HOSTNAME', 'name': '$POD_NAME', 'namespace': '$POD_NAMESPACE', 'ip': '$POD_IP'}"
              data=$(echo $data | sed "s/'/\\"/g")
              curl -S -X POST http://master-service.kube-sms.svc.cluster.local/register -H "Content-Type: application/json" -d "$data"
            """, 
            "unregister": """
              data="{'group': '$NODE_GROUP', 'service': '$NODE_SERVICE', 'port': '$NODE_SERVICE_PORT', 'host': '$HOSTNAME', 'name': '$POD_NAME', 'namespace': '$POD_NAMESPACE', 'ip': '$POD_IP'}"
              data=$(echo $data | sed "s/'/\\"/g")
              curl -S -X POST http://master-service.kube-sms.svc.cluster.local/unregister -H "Content-Type: application/json" -d "$data"
            """
            }
    }
  try:
    if len(configMaps) ==  1:
      api_core.patch_namespaced_config_map(name=proxyConfigMapName, body=configMap, namespace=namespace)
      log.info("Patch Proxy Config Map {}".format(proxyConfigMapName))
    else:
      api_core.create_namespaced_config_map(body=configMap, namespace=namespace)
      log.info("Create Proxy Config Map {}".format(proxyConfigMapName))
  except ApiException as e:
    log.error("Exception when making Proxy Config Map: {}".format(e))
    return False
  return True

# main
loop()

