import createEngine, { DagreEngine, PathFindingLinkFactory, DefaultNodeModel, DiagramModel} from '@projectstorm/react-diagrams';
import React from 'react';
import { CanvasWidget} from '@projectstorm/react-canvas-core';
import BaseWidget from './BaseWidget'
import {AdvancedLinkFactory, AdvancedPortModel, AdvancedLinkModel} from './link/AdvancedLink'
import {ArrowsLinkFactory, ArrowsPortModel} from './link/ArrowsLink'
import { AppNodeFactory } from './node/AppNodeFactory';
import { AppNodeModel } from './node/AppNodeModel';

function App() {

  const engine = createEngine();

  engine.getLinkFactories().registerFactory(new AdvancedLinkFactory());
  engine.getLinkFactories().registerFactory(new ArrowsLinkFactory());
  engine.getNodeFactories().registerFactory(new AppNodeFactory());



  // Product
  let product = new AppNodeModel({
    name: 'Product View',
    color: 'rgb(192,255,0)',
  });
  //product.setPosition(100, 300);
  let outProductPortV1 = product.addPort(new AdvancedPortModel(false, 'V1', 'Master*'));
  // details
  let detail = new AppNodeModel({
    name: 'Details Bloc',
    color: 'rgb(192,255,0)',
  });
  //detail.setPosition(400, 150);
  let inDetailPort = detail.addPort(new AdvancedPortModel(true, 'IN'));
  let outDetailPortV1 = detail.addPort(new AdvancedPortModel(false, 'V1', 'V1'));
  // Review
  let review = new AppNodeModel({
    'name': 'Review bloc',
    color: 'rgb(0,192,255)',
  });
  //review.setPosition(400, 350);
  let inReviewPort = review.addPort(new AdvancedPortModel(true, 'Sidecare'));
  let outReviewPortV1 = review.addPort(new AdvancedPortModel(false, 'V1', 'V1'));
  let outReviewPortV2 = review.addPort(new AdvancedPortModel(false, 'V2', 'V2'));
  let outReviewPortV3 = review.addPort(new AdvancedPortModel(false, 'V3', 'V3'));
  // Rating
  let rating = new AppNodeModel({
    'name': 'Rating bloc',
    color: 'rgb(0,192,255)',
  });
  //rating.setPosition(700, 350);
  let inRatingPort = rating.addPort(new AdvancedPortModel(true, 'Sidecare'));
  let outRatingPortV1 = rating.addPort(new AdvancedPortModel(false, 'V1', 'V1'));
  let outRatingPortV2 = rating.addPort(new AdvancedPortModel(false, 'V2', 'V2'));
  let outRatingPortV2Mysql = rating.addPort(new AdvancedPortModel(false, 'V2MYSQL', 'V2-Mysql'));


  let detailLink = outProductPortV1.link(inDetailPort);
  let reviewLink = outProductPortV1.link(inReviewPort);
  let ratingLinkV2 = outReviewPortV2.link(inRatingPort);
  let ratingLinkV3 = outReviewPortV3.link(inRatingPort);
  
  const model = new DiagramModel();
  model.addAll(product, detail, review, rating);
  model.addAll(detailLink, reviewLink, ratingLinkV2, ratingLinkV3);

  engine.setModel(model);

  setTimeout(function(){ // @see https://github.com/dagrejs/dagre/wiki
    const dagre = new DagreEngine({
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
  }, 100);

  return (
    <BaseWidget>
      <CanvasWidget engine={engine} />
    </BaseWidget>
  );
}

export default App;
