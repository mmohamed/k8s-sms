import { DefaultNodeModel } from "@projectstorm/react-diagrams";

export class AppNodeModel extends DefaultNodeModel {
	
	constructor(options, color) {
		if (typeof options === 'string') {
			options = {
				name: options,
				color: color
			};
		}
		super({
			type: 'app',
			name: 'Untitled',
			color: 'rgb(0,192,255)',
			...options
		});
	}
}