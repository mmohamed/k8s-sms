import { DefaultPortModel, DefaultLinkFactory, DefaultLinkModel, DefaultLinkWidget } from '@projectstorm/react-diagrams';
import { LinkWidget } from '@projectstorm/react-diagrams-core';
import * as React from 'react';

export class ArrowsLinkModel extends DefaultLinkModel {
	constructor() {
		super({
			type: 'arrows',
			width: 4
		});
	}
}

export class ArrowsPortModel extends DefaultPortModel {
	createLinkModel(){
		return new ArrowsLinkModel();
	}
}

const CustomLinkArrowWidget = props => {
	const { point, previousPoint } = props;

	const angle =
		90 +
		(Math.atan2(
			point.getPosition().y - previousPoint.getPosition().y,
			point.getPosition().x - previousPoint.getPosition().x
		) *
			180) /
			Math.PI;

	//translate(50, -10),
	return (
		<g className="arrow" transform={'translate(' + point.getPosition().x + ', ' + point.getPosition().y + ')'}>
			<g style={{ transform: 'rotate(' + angle + 'deg)' }}>
				<g transform={'translate(0, -3)'}>
					<polygon
						points="0,10 8,30 -8,30"
						fill={props.color}
						onMouseLeave={() => {
							this.setState({ selected: false });
						}}
						onMouseEnter={() => {
							this.setState({ selected: true });
						}}
						data-id={point.getID()}
						data-linkid={point.getLink().getID()}></polygon>
				</g>
			</g>
		</g>
	);
};

export class ArrowsLinkWidget extends DefaultLinkWidget {
	generateArrow(point, previousPoint) {
		return (
			<CustomLinkArrowWidget
				key={point.getID()}
				point={point}
				previousPoint={previousPoint}
				colorSelected={this.props.link.getOptions().selectedColor}
				color={this.props.link.getOptions().color}
			/>
		);
	}

	render() {
		//ensure id is present for all points on the path
		var points = this.props.link.getPoints();
		var paths = [];
		this.refPaths = [];

		//draw the multiple anchors and complex line instead
		for (let j = 0; j < points.length - 1; j++) {
			paths.push(
				this.generateLink(
					LinkWidget.generateLinePath(points[j], points[j + 1]),
					{
						'data-linkid': this.props.link.getID(),
						'data-point': j,
						onMouseDown: (event) => {
							this.addPointToLink(event, j + 1);
						}
					},
					j
				)
			);
		}

		//render the circles
		for (let i = 1; i < points.length - 1; i++) {
			paths.push(this.generatePoint(points[i]));
		}

		if (this.props.link.getTargetPort() !== null) {
			paths.push(this.generateArrow(points[points.length - 1], points[points.length - 2]));
		} else {
			paths.push(this.generatePoint(points[points.length - 1]));
		}

		return <g data-default-link-test={this.props.link.getOptions().testName}>{paths}</g>;
	}
}

export class ArrowsLinkFactory extends DefaultLinkFactory {
	constructor() {
		super('arrows');
	}

	generateModel() {
		return new ArrowsLinkModel();
	}

	generateReactWidget(event) {
		return <ArrowsLinkWidget link={event.model} diagramEngine={this.engine} />;
	}
}