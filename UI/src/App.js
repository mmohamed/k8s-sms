import createEngine, { DagreEngine, PathFindingLinkFactory, DefaultNodeModel, DiagramModel} from '@projectstorm/react-diagrams';
import React from 'react';
import { CanvasWidget} from '@projectstorm/react-canvas-core';
import BaseWidget from './BaseWidget'
import {AdvancedLinkFactory, AdvancedPortModel} from './AdvancedLink'
import {ArrowsLinkFactory, ArrowsPortModel} from './ArrowsLink'

function App() {

  const engine = createEngine();

  engine.getLinkFactories().registerFactory(new AdvancedLinkFactory());
  engine.getLinkFactories().registerFactory(new ArrowsLinkFactory());

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

  // link them and add a label to the link
  const arrowsLink = port3.link(port4);

  const model = new DiagramModel();
  model.addAll(node1, node2, link);
  model.addAll(node3, node4, arrowsLink);
  engine.setModel(model);

  setTimeout(function(){
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
  }, 5000);

  return (
    <BaseWidget>
      <CanvasWidget engine={engine} />
    </BaseWidget>
  );
}

export default App;
