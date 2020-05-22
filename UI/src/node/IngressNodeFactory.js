import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { IngressNodeWidget } from './IngressNodeWidget';
import { IngressNodeModel } from './IngressNodeModel';

export class IngressNodeFactory extends AbstractReactFactory {
	constructor() {
		super('ingress');
	}

	generateReactWidget(event) {
		return <IngressNodeWidget engine={this.engine} size={80} node={event.model} />;
	}

	generateModel(event) {
		return new IngressNodeModel();
	}
}