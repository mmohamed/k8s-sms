import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { AppNodeModel } from './AppNodeModel';
import { AppNodeWidget } from './AppNodeWidget';

export class AppNodeFactory extends AbstractReactFactory {
	constructor() {
		super('app');
	}

	generateReactWidget(event) {
		return <AppNodeWidget engine={this.engine} node={event.model} />;
	}

	generateModel(event) {
		return new AppNodeModel();
	}
}