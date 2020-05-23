import React from 'react';
import { CanvasWidget} from '@projectstorm/react-canvas-core';
import BaseWidget from './BaseWidget'
import { ViewEngine } from './sms/ViewEngine';
import data from './data.json';

function App() {

  let viewEngine = new ViewEngine();
  viewEngine.load(data);

  return (
    <BaseWidget>
      <CanvasWidget engine={viewEngine.get()} />
    </BaseWidget>
  );
}

export default App;
