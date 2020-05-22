import { DefaultPortModel } from '@projectstorm/react-diagrams';
import { AdvancedLinkModel } from '../link/AdvancedLink';

export class IngressPortModel extends DefaultPortModel {
	constructor(alignment) {
		super({
			type: 'ingress',
			name: alignment,
            alignment: alignment
		});
	}

	createLinkModel() {
		return new AdvancedLinkModel();
	}
}