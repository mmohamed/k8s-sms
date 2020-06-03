import * as React from 'react';
import styled from '@emotion/styled';
import { PortWidget } from '@projectstorm/react-diagrams';
import { ArcherElement } from 'react-archer';

export const PortLabel = styled.div`
    display: flex;
    align-items: center;
    margin: 5px;
`;

export const PortLabelIn = styled.div`
    display: flex;
    align-items: center;
    margin: auto;
`;


export const Label = styled.div`
    padding: 0 5px;
    flex-grow: 1;
`;

export const LabelIn = styled.div`
    flex-grow: 1;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 17px solid rgb(192,255,0);
`;

export const LabelOut = styled.div`
    padding: 0 5px;
    flex-grow: 1;
    background: red;
    border-radius: 5px;
    padding: 5px;
    border: 1px solid white;
`;

export const Port = styled.div`
    width: 15px;
    height: 15px;
    background: rgba(white, 0.1);
    &:hover {
        background: rgb(192, 255, 0);
    }
`;

export class AppPortLabel extends React.Component {
	render() {
		const port = (
			<PortWidget engine={this.props.engine} port={this.props.port}>
               	<Port />
            </PortWidget>
		);
        
        let label, out;
        if(! this.props.port.getOptions().in){
            label = <LabelOut>{this.props.port.getOptions().label}</LabelOut>;
            out = (<PortLabel>
				{this.props.port.getOptions().in ? port : label}
				{this.props.port.getOptions().in ? label : port}
			</PortLabel>)
        }else{
            label = <LabelIn>{this.props.port.getOptions().label}</LabelIn>;
            out = (<PortLabelIn>
				{this.props.port.getOptions().in ? port : label}
				{this.props.port.getOptions().in ? label : port}
			</PortLabelIn>)
        }

		return (<ArcherElement id={this.props.port.getID()} relations={this.props.relations}>{out}</ArcherElement>);
	}
}