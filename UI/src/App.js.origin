import createEngine, { DagreEngine, PathFindingLinkFactory, DiagramModel, PortModelAlignment} from '@projectstorm/react-diagrams';
import React from 'react';
import { CanvasWidget} from '@projectstorm/react-canvas-core';
import BaseWidget from './BaseWidget'
import {AdvancedLinkFactory, AdvancedPortModel, DisabledAdvancedPortModel} from './link/AdvancedLink'
import { AppNodeFactory } from './node/AppNodeFactory';
import { AppNodeModel } from './node/AppNodeModel';
import { IngressNodeModel } from './node/IngressNodeModel';
import { IngressPortFactory } from './node/IngressPortFactory';
import { IngressNodeFactory } from './node/IngressNodeFactory';
import { IngressPortModel } from './node/IngressPortModel';

function App() {

  const engine = createEngine();

  //engine.getLinkFactories().registerFactory(new ArrowsLinkFactory());
  engine.getLinkFactories().registerFactory(new AdvancedLinkFactory());
  engine.getNodeFactories().registerFactory(new AppNodeFactory());
  engine.getPortFactories().registerFactory(new IngressPortFactory('ingress',
     config => new IngressPortModel(PortModelAlignment.RIGHT)));
	engine.getNodeFactories().registerFactory(new IngressNodeFactory());


  // Ingress
  let ingress = new IngressNodeModel();
  // Product
  let product = new AppNodeModel({
    name: 'Product View',
    color: 'rgb(192,255,0)',
  });
  //product.setPosition(100, 300);
  let outProductPortV1 = product.addPort(new AdvancedPortModel(false, 'V1', 'Master*'));
  let inProductPort = product.addPort(new AdvancedPortModel(true, 'IN'));
  // details
  let detail = new AppNodeModel({
    name: 'Details Bloc',
    color: 'rgb(192,255,255)',
  });
  //detail.setPosition(400, 150);
  let inDetailPort = detail.addPort(new DisabledAdvancedPortModel(true, 'IN'));
  let outDetailPortV1 = detail.addPort(new AdvancedPortModel(false, 'V1', 'v1'));
  // Review
  let review = new AppNodeModel({
    'name': 'Review bloc',
    color: 'rgb(0,192,255)',
  });
  //review.setPosition(400, 350);
  let inReviewPort = review.addPort(new AdvancedPortModel(true, 'Sidecare'));
  let outReviewPortV1 = review.addPort(new AdvancedPortModel(false, 'V1', 'v1'));
  let outReviewPortV2 = review.addPort(new AdvancedPortModel(false, 'V2', 'v2'));
  let outReviewPortV3 = review.addPort(new AdvancedPortModel(false, 'V3', 'v3'));
  // Rating
  let rating = new AppNodeModel({
    'name': 'Rating bloc',
    color: 'rgb(0,192,255)',
  });
  //rating.setPosition(700, 350);
  let inRatingPort = rating.addPort(new AdvancedPortModel(true, 'Sidecare'));
  let outRatingPortV1 = rating.addPort(new AdvancedPortModel(false, 'V1', 'v1'));
  let outRatingPortV2 = rating.addPort(new AdvancedPortModel(false, 'V2', 'v2'));
  let outRatingPortV2Mysql = rating.addPort(new AdvancedPortModel(false, 'V2MYSQL', 'v2-mysql'));

  let ingressLink = ingress.getPort(PortModelAlignment.RIGHT).link(inProductPort);
  let detailLink = outProductPortV1.link(inDetailPort);
  let reviewLink = outProductPortV1.link(inReviewPort);
  let ratingLinkV2 = outReviewPortV2.link(inRatingPort);
  let ratingLinkV3 = outReviewPortV3.link(inRatingPort);
  
  const model = new DiagramModel();
  model.addAll(ingress, product, detail, review, rating);
  model.addAll(outProductPortV1, inProductPort, inDetailPort, outDetailPortV1, inReviewPort, outReviewPortV1, outReviewPortV2, outReviewPortV3, inRatingPort, 
    outRatingPortV1, outRatingPortV2, outRatingPortV2Mysql, detailLink, reviewLink, ratingLinkV2, ratingLinkV3);
  model.addAll(ingressLink, detailLink, reviewLink, ratingLinkV2, ratingLinkV3);

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
