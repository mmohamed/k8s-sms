import createEngine, { DagreEngine, PathFindingLinkFactory, DefaultNodeModel, DiagramModel} from '@projectstorm/react-diagrams';
import React from 'react';
import { CanvasWidget} from '@projectstorm/react-canvas-core';
import BaseWidget from './BaseWidget'
import {AdvancedLinkFactory, AdvancedPortModel, AdvancedLinkModel} from './AdvancedLink'
import {ArrowsLinkFactory, ArrowsPortModel} from './ArrowsLink'
import { AppNodeFactory } from './node/AppNodeFactory';
import { AppNodeModel } from './node/AppNodeModel';

function App() {

  const engine = createEngine();

  engine.getLinkFactories().registerFactory(new AdvancedLinkFactory());
  engine.getLinkFactories().registerFactory(new ArrowsLinkFactory());
  engine.getNodeFactories().registerFactory(new AppNodeFactory());

  // node 1
  const node1 = new DefaultNodeModel({
    name: 'Node 1',
    color: 'rgb(0,192,255)',
  });
  node1.setPosition(100, 100);
  let port1 = node1.addPort(new AdvancedPortModel(false, 'Out'));
  // node 2
  const node2 = new DefaultNodeModel({
    name: 'Node 2',
    color: 'rgb(192,255,0)',
  });
  node2.setPosition(400, 100);
  let port2 = node2.addPort(new AdvancedPortModel(true, 'In'));
  // link them and add a label to the link
  const link = port1.link(port2);
  //link.addLabel('Hello World!');
  

  // node 3
  const node3 = new DefaultNodeModel({
    name: 'Node 3',
    color: 'rgb(0,192,255)',
  });
  node3.setPosition(100, 300);
  let port3 = node3.addPort(new ArrowsPortModel(false, 'Out'));

  // node 4
  const node4 = new DefaultNodeModel({
    name: 'Node 4',
    color: 'rgb(192,255,0)',
  });
  node4.setPosition(400, 300);
  let port4 = node4.addPort(new ArrowsPortModel(true, 'In'));
  let port5 = node4.addPort(new AdvancedPortModel(false, 'Ingress'));

  // link them and add a label to the link
  const arrowsLink = port3.link(port4);

  const app = new AppNodeModel({
    'name': 'Application',
    color: 'rgb(0,192,255)',
  });
  app.setPosition(700, 350);
  let inAppPort = app.addPort(new AdvancedPortModel(true, 'Sidecare'));
  let outAppPortV1 = app.addPort(new AdvancedPortModel(false, 'V1', 'V1'));
  let outAppPortV2 = app.addPort(new AdvancedPortModel(false, 'V2', 'V2'));
  let outAppPortV3 = app.addPort(new AdvancedPortModel(false, 'V3', 'V3'));
  let outAppPortV4 = app.addPort(new AdvancedPortModel(false, 'V4', 'V4'));
  let outAppPortV5 = app.addPort(new AdvancedPortModel(false, 'V5', 'V5'));
  let ingressLink = port5.link(inAppPort);

  const model = new DiagramModel();
  model.addAll(node1, node2, link);
  model.addAll(node3, node4, arrowsLink);

  model.addAll(app, inAppPort, outAppPortV1, outAppPortV2, outAppPortV3, outAppPortV4, outAppPortV5, ingressLink);

  engine.setModel(model);

  /*setTimeout(function(){
    const dagre = new DagreEngine({
      graph: {
        rankdir: 'LR',
        ranker: 'longest-path',
        marginx: 100,
        marginy: 100
      },
      includeLinks: true
    });
    dagre.redistribute(model);
    engine.getLinkFactories().getFactory(PathFindingLinkFactory.NAME).calculateRoutingMatrix();
    engine.repaintCanvas();
  }, 5000);*/

  return (
    <BaseWidget>
      <CanvasWidget engine={engine} />
    </BaseWidget>
  );
}

export default App;
