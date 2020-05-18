import React from 'react';
import './App.css';
import BaseWidget from './BaseWidget'

import createEngine, { 
  DefaultLinkModel, 
  DefaultNodeModel,
  DiagramModel 
} from '@projectstorm/react-diagrams';

import {
  CanvasWidget
} from '@projectstorm/react-canvas-core';

function App() {

  const engine = createEngine();

  // node 1
  const node1 = new DefaultNodeModel({
    name: 'Node 1',
    color: 'rgb(0,192,255)',
  });
  node1.setPosition(100, 100);
  let port1 = node1.addOutPort('Out');

  // node 2
  const node2 = new DefaultNodeModel({
    name: 'Node 2',
    color: 'rgb(192,255,0)',
  });
  node2.setPosition(400, 100);
  let port2 = node2.addInPort('In');

  // link them and add a label to the link
  const link = port1.link(port2);
  link.addLabel('Hello World!');

  const model = new DiagramModel();
  model.addAll(node1, node2, link);
  engine.setModel(model);

  return (
    <BaseWidget>
      <CanvasWidget engine={engine} />
    </BaseWidget>
  );
}

export default App;
