import { AdvancedLinkFactory, AdvancedPortModel, DisabledAdvancedPortModel } from '../link/AdvancedLink';
import { AppNodeFactory } from '../node/AppNodeFactory';
import { IngressPortFactory } from '../node/IngressPortFactory';
import { IngressPortModel } from '../node/IngressPortModel';
import createEngine, { PortModelAlignment, DiagramModel, PathFindingLinkFactory, DagreEngine } from '@projectstorm/react-diagrams';
import { IngressNodeFactory } from '../node/IngressNodeFactory';
import { AppNodeModel } from '../node/AppNodeModel';
import { IngressNodeModel } from '../node/IngressNodeModel';

export const EVENT_NODE_SELECTION = 'app.event.node.selection';
export const EVENT_ENGINE_RELOAD = 'app.event.engine.reload';
export const EVENT_ENGINE_FILTER = 'app.event.engine.filter';
export const EVENT_ENGINE_LOADED = 'app.event.engine.loaded';

export class ViewEngine {
    
    engine;
    ingress;
    model;
    dagre;
    isLoaded;
    nodes = [];
    links = [];

    constructor(){
        this.engine = createEngine();
        this.isLoaded = false;
        //this.engine.getLinkFactories().registerFactory(new ArrowsLinkFactory());
        this.engine.getLinkFactories().registerFactory(new AdvancedLinkFactory());
        this.engine.getNodeFactories().registerFactory(new AppNodeFactory());
        this.engine.getPortFactories().registerFactory(new IngressPortFactory('ingress',
            config => new IngressPortModel(PortModelAlignment.RIGHT)));
        this.engine.getNodeFactories().registerFactory(new IngressNodeFactory());
        // create model
        this.model = new DiagramModel();
        // set model
        this.engine.setModel(this.model);
        this.dagre = new DagreEngine({
            graph: {
                rankdir: 'LR',
                ranker: 'network-simplex', // 'tight-tree, longest-path',
                marginx: 100,
                marginy: 100,
                ranksep: 100, // horizontal sep
            },
            includeLinks: true
        });
    }

    load(json, callback){
        // ingress
        if(json.ingress){
            this.__createIngress();
        }
        // nodes
        if(json.nodes){
            json.nodes.forEach(node => {
                let isFront = this.__isFrontNode(node, json.links, json.ingress);
                this.nodes.push(this.__createNode(node, isFront));
            });
        }
        // links
        if(json.links){
            json.links.forEach(link => {
                let linkModel = this.__createLink(link);
                if(linkModel != null){
                    this.links.push(linkModel);
                }
                
            });
        }
        // distrube
        this.isLoaded = true;
        this.distrube(callback);
        // events
        document.dispatchEvent( new CustomEvent(EVENT_ENGINE_LOADED, {
            detail: { 
                time: new Date().getTime(),
                ingress: json.ingress ? true : false, 
                nodes: json.nodes ? json.nodes : [], 
                links: json.links ? json.links : [],
                from: json.from,
                to: json.to,
                namespace: json.namespace 
            }
        }));
    }

    refresh(json, callback){
        let selectedNode = this.model.getSelectedEntities();
        this.model.clearSelection();
        this.nodes.forEach((node) => {
            this.model.removeNode(node.node);
        }); 
        if(this.ingress){
            this.model.removeNode(this.ingress);
        }
        this.links.forEach((link) => {
            this.model.removeLink(link);
        }); 
        this.ingress = null;
        this.nodes = [];
        this.links = [];
        let thatModel = this.model;
        let newCallback = function(){
            if('function' === typeof callback){
                callback()
            }
            // re-select node
            if(selectedNode.length > 0){
                if(selectedNode[0] instanceof IngressNodeModel){
                    thatModel.getNodes().forEach((node) => {
                        if(node instanceof IngressNodeModel){
                            node.setSelected(true)
                        }
                    });
                }else{
                    thatModel.getNodes().forEach((node) => {
                        if(node instanceof AppNodeModel && node.options.name === selectedNode[0].options.name){
                            node.setSelected(true)
                        }
                    });
                }
            }
        }
        this.load(json, newCallback);
    }

    get(){
        return this.engine;
    }

    __isFrontNode(node, links, ingress){
        if(ingress !== true){
            return false;
        }
        let isFront = false;
        links.forEach(link => {
            if(link.from === "ingress" && String(link.to) === String(node.id)){
                isFront = true;
            }
        });
        return isFront;
    }

    __createIngress(){
        this.ingress = new IngressNodeModel();
        this.model.addAll(this.ingress);
    }

    __createNode(data, isFrontNode){
        // node element
        let node = new AppNodeModel({
            name: data.name,
            color: true === data.disabled ? 'rgb(192,255,255)' : (isFrontNode ? 'rgb(192,255,0)' : 'rgb(0,192,255)')
        });
        // port
        let input = node.addPort(true === data.disabled ? new DisabledAdvancedPortModel(true, 'IN') : new AdvancedPortModel(true, 'IN'));
        let output = [];
        let out = []
        data.services.forEach(service => {
            let port = node.addPort(new AdvancedPortModel(false, service.id, service.name));
            output.push(port);
            out.push({id: service.id, port: port});
        });
        // add to model
        this.model.addAll(node);
        this.model.addAll(input);
        this.model.addAll(output);
        // listener
        let that = this;
        node.registerListener({
            eventDidFire: function(event){
                if(event.function === 'selectionChanged'){
                    let target = that.__getNodeByModel(event.entity);
                    if(null !== target){
                        let appEvent = new CustomEvent(EVENT_NODE_SELECTION, {
                            detail: { isSelected: event.isSelected, data: target }
                        });
                        document.dispatchEvent(appEvent);
                    }
                }
            }
        });
        // return
        return {node: node, id: data.id, in: input, out: out, raw: data};
    }

    __createLink(data){
        if("ingress" === data.from && this.ingress != null){
            let node = this.__getNodeById(data.to);
            if(!node){
                return null;
            }
            let link = this.ingress.getPort(PortModelAlignment.RIGHT).link(node.in);
            this.model.addLink(link);
            return link;
        }
        let fromPort = this.__getPortById(data.from);
        let toNode = this.__getNodeById(data.to);
        if(fromPort && toNode && toNode.in){
            let link = fromPort.link(toNode.in);
            this.model.addLink(link);
            return link;
        }
        return null;
    }

    __getPortById(id){
        let ids = id.split("#");
        let target = null;
        this.nodes.forEach(node => {
            if(String(ids[0]) === String(node.id)){
                if(ids.length === 1 && node.out.length === 1){
                    target = node.out[0].port;
                }else if(ids.length === 2){
                    node.out.forEach(port => {
                        if(String(port.id) === String(ids[1]))
                            target= port.port; 
                    });
                }
            }
        });
        return target;
    }

    __getNodeById(id){
        let target = null;
        this.nodes.forEach(node => {
            if(String(node.id) === String(id))
                target = node;
        });
        return target;
    }

    __getNodeByModel(nodeModel){
        let target = null;
        this.nodes.forEach(node => {
            if(node.node === nodeModel)
                target = node;
        });
        return target;
    }

    distrube(callback){
        if(!this.isLoaded){
            return;
        }
        // prevent distrub error next time pf empty model
        if(!this.nodes.length){
            if('function' === typeof callback){
                callback()
            }
            return;
        }
        let model = this.model;
        let engine = this.engine;
        let dagre = this.dagre;
        setTimeout(function(){ // @see https://github.com/dagrejs/dagre/wiki
            dagre.redistribute(model);
            engine.getLinkFactories().getFactory(PathFindingLinkFactory.NAME).calculateRoutingMatrix();
            engine.repaintCanvas();
            // for http delai, need redistribute.
            setTimeout(function(){
                dagre.redistribute(model);
                engine.repaintCanvas();
                engine.zoomToFit(); // or engine.zoomToFitNodes(100)
                model.setLocked(true);
                if('function' === typeof callback){
                    callback()
                }
              }, 100);
          }, 100);
    }
}