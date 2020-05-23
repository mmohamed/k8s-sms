import { AdvancedLinkFactory, AdvancedPortModel, DisabledAdvancedPortModel } from '../link/AdvancedLink';
import { AppNodeFactory } from '../node/AppNodeFactory';
import { IngressPortFactory } from '../node/IngressPortFactory';
import { IngressPortModel } from '../node/IngressPortModel';
import createEngine, { PortModelAlignment, DiagramModel, PathFindingLinkFactory, DagreEngine } from '@projectstorm/react-diagrams';
import { IngressNodeFactory } from '../node/IngressNodeFactory';
import { AppNodeModel } from '../node/AppNodeModel';
import { IngressNodeModel } from '../node/IngressNodeModel';

export class ViewEngine {
    
    engine;
    ingress;
    model;
    nodes = [];
    links = [];

    constructor(){
        this.engine = createEngine();

        //this.engine.getLinkFactories().registerFactory(new ArrowsLinkFactory());
        this.engine.getLinkFactories().registerFactory(new AdvancedLinkFactory());
        this.engine.getNodeFactories().registerFactory(new AppNodeFactory());
        this.engine.getPortFactories().registerFactory(new IngressPortFactory('ingress',
            config => new IngressPortModel(PortModelAlignment.RIGHT)));
        this.engine.getNodeFactories().registerFactory(new IngressNodeFactory());

        this.model = new DiagramModel();
    }


    load(json){
        // ingress
        if(json.ingress){
            this.__createIngress();
        }
        // nodes
        if(json.nodes){
            json.nodes.forEach(node => {
                this.nodes.push(this.__createNode(node));
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
        // set model
        this.engine.setModel(this.model);
        // distrube
        this.__distrube();
    }

    get(){
        return this.engine;
    }

    __createIngress(){
        this.ingress = new IngressNodeModel();
        this.model.addAll(this.ingress);
    }

    __createNode(data){
        // node element
        let node = new AppNodeModel({
            name: data.name,
            color: true === data.front ? 'rgb(192,255,0)' : (false === data.active ? 'rgb(192,255,255)' : 'rgb(0,192,255)')
        });
        // port
        let input = node.addPort(false === data.active ? new DisabledAdvancedPortModel(true, 'IN') : new AdvancedPortModel(true, 'IN'));
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
        // return
        return {node: node, id: data.id, in: input, out: out};
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
            if(ids[0] === node.id){
                if(ids.length === 1 && node.out.length === 1){
                    target = node.out[0].port;
                }else if(ids.length === 2){
                    node.out.forEach(port => {
                        if(port.id === ids[1])
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
            if(node.id === id)
                target= node;
        });
        return target;
    }

    __distrube(){
        let model = this.model;
        let engine = this.engine;
        setTimeout(function(){ // @see https://github.com/dagrejs/dagre/wiki
            let dagre = new DagreEngine({
              graph: {
                rankdir: 'LR',
                ranker: 'network-simplex', // 'tight-tree, longest-path',
                marginx: 100,
                marginy: 100,
                ranksep: 100, // horizontal sep
              },
              includeLinks: true
            });
            dagre.redistribute(model);
            engine.getLinkFactories().getFactory(PathFindingLinkFactory.NAME).calculateRoutingMatrix();
            engine.repaintCanvas();
          }, 1000);
    }
}