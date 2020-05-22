import { PortModelAlignment, NodeModel } from '@projectstorm/react-diagrams';
import { IngressPortModel } from './IngressPortModel';

export class IngressNodeModel extends NodeModel {
	constructor() {
		super({
            type: 'ingress',
		});
		this.addPort(new IngressPortModel(PortModelAlignment.RIGHT));
	}
}