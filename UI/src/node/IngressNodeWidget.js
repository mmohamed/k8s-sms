import * as React from 'react';
import { PortModelAlignment, PortWidget } from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';


export const Port = styled.div`
    width: 16px;
    height: 16px;
    z-index: 10;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    cursor: pointer;
    &:hover {
        background: rgba(0, 0, 0, 1);
    }
`;

export const Label = styled.text`
    ont-family: sans-serif;
    color: white;
    font-size: 11px;
`;

export class IngressNodeWidget extends React.Component {
	render() {
		return (
			<div
				className={'ingress-node'}
				style={{
					position: 'relative',
					width: this.props.size,
					height: this.props.size
				}}>
				<svg
					width={this.props.size}
					height={this.props.size}
					dangerouslySetInnerHTML={{
						__html:
							`
                            <g id="Layer_1">
                            </g>
                            <g id="Layer_2">
                                <polygon fill="mediumpurple" stroke="${
                                                this.props.node.isSelected() ? 'white' : '#000000'
                                            }" stroke-width="3" stroke-miterlimit="10" points="10,` +
                                                this.props.size / 2 +
                                                ` ` +
                                                this.props.size / 2 +
                                                `,10 ` +
                                                (this.props.size - 10) +
                                                `,` +
                                                this.props.size / 2 +
                                                ` ` +
                                                this.props.size / 2 +
                                                `,` +
                                                (this.props.size - 10) +
                                                ` "/>
                            </g>
                            <text x="22" y="43" style="font-size:11px; font-family:sans-serif" fill="white">Ingress</text>
                            `
                    }}
				/>
				<PortWidget
					style={{
						left: this.props.size - 8,
						top: this.props.size / 2 - 8,
						position: 'absolute'
					}}
					port={this.props.node.getPort(PortModelAlignment.RIGHT)}
					engine={this.props.engine}>
					<Port />
				</PortWidget>
			</div>
		);
	}
}