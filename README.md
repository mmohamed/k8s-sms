# Simple Mesh Service for Kubernetes

This is a very simplified mesh service injector and monitoring for Rest deployment inside a K8S cluster.

In this README:

- [Install](#install)
- [Sample](#use-sample)
- [How it's work](#how-its-work)
- [Contribute](#contribute)

##### [@See for full description](https://blog.medinvention.dev/simple-mesh-service)

----

<img src="https://raw.githubusercontent.com/mmohamed/k8s-sms/master/UI/public/images/demo.gif" width="900">

---- 

## Install
- Start by adding Helm repository :
```
helm repo add medinvention-dev https://mmohamed.github.io/kubernetes-charts
```
- Create values file (custom configuration), you can refe to full values parameters file [available here](https://github.com/mmohamed/k8s-sms-helm/blob/master/values.yaml)
```
...
api:
  release: v0.1.0 # v0.1.0-amd64
  ingress:
    host: your ingress host for api...
...
```
- Got to your ui host with your browser using your custom credentials (default credentials: admin@sms.dev/admin) if you have activated ingress option for UI & API.

## Use sample
- Deploy a sample [available here](Sample) to verify install :
```
kubectl apply -f ./Sample
```
- Run some request (inside a cluster) to view services communication:
```
curl http://product-service.sample-sms.svc.cluster.local:5000
```
## How it's work
Generally, you need only to add three annotations to your services deployment and the controller of SMS will update your deployment (and in same case kube service) to work correctly.

For example, if you have 2 version of calculator service named *calculator-v1* & *calculator-v2*. To activate SMS on these services, you must define your services groups by adding these annotations to your deployment of first version (v1):
```
- medinvention.dev/sms.group: calculator
- medinvention.dev/sms.port: "8080"
- medinvention.dev/sms.service: calculator-service-v1
- medinvention.dev/sms.servicenamespace: calculator-namespace
```
And for example, add these annotations to your deployment of second version (v2):
```
- medinvention.dev/sms.group: calculator
- medinvention.dev/sms.port: "8081"
- medinvention.dev/sms.service: calculator-service-v2
```

And it will work automatically.

Enjoy :)

## Contribute
This is an open project; all contribution is welcome. Pull Request & Issues are opened for all.

---- 

[*Contact & More information*](https://blog.medinvention.dev)