import { AbstractModelFactory } from '@projectstorm/react-canvas-core';

export class IngressPortFactory extends AbstractModelFactory {
	cb;

	constructor(type, cb) {
		super(type);
		this.cb = cb;
	}

	generateModel(event) {
		return this.cb(event.initialConfig);
	}
}