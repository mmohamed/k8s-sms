import * as React from 'react';
import styled from '@emotion/styled';
import { DefaultPortLabel } from '@projectstorm/react-diagrams';
import { AppPortLabel } from '../port/AppPortLabel';

export const Node = styled.div`
    background-color: ${p => p.background};
    border-radius: 5px;
    font-family: sans-serif;
    color: white;
    border: solid 2px black;
    overflow: visible;
    font-size: 11px;
    border: solid 2px ${p => (p.selected ? 'rgb(0,192,255)' : 'black')};
`;

export const Title = styled.div`
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    white-space: nowrap;
    justify-items: center;
`;

export const TitleName = styled.div`
    flex-grow: 1;
    padding: 5px 5px;
    text-align: center;
`;

export const Ports = styled.div`
    display: flex;
    background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
`;

export const PortsContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    &:first-of-type {
        margin-right: 10px;
    }

    &:only-child {
        margin-right: 0px;
    }
`;


export class AppNodeWidget extends React.Component {
	render() {
		return (
			<Node
				data-default-node-name={this.props.node.getOptions().name}
				selected={this.props.node.isSelected()}
				background={this.props.node.getOptions().color}>
				<Title>
					<TitleName>{this.props.node.getOptions().name}</TitleName>
				</Title>
				<Ports>
                    <PortsContainer>{ this.props.node.getInPorts().map(port => (
                        <AppPortLabel engine={this.props.engine} port={port} key={port.getID()} />
                    ))}</PortsContainer>
                    <PortsContainer>{ this.props.node.getOutPorts().map(port => (
                        <AppPortLabel engine={this.props.engine} port={port} key={port.getID()} />
                    ))}</PortsContainer>
				</Ports>
			</Node>
		);
	}
}