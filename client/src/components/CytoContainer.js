import React, { Component } from 'react';
import { ReactCytoscape } from 'react-cytoscape';

class CytoContainer extends Component {
    constructor(props) {
        super(props);

        this.state = { elements: this.props.elements, cytoRef: this.props.cytoRef, layout: this.props.layout, style: this.props.style };
    }

    componentDidUpdate(prevProps) {
        if (this.props.layout.name !== prevProps.layout.name || this.props.elements !== prevProps.elements) {
            this.setState({ elements: this.props.elements, cytoRef: this.props.cytoRef, layout: this.props.layout, style: this.props.style });
            this.forceUpdate();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.shouldChangeGraph === false) {
            return false;
        }

        return true;
    }

    render() {
        return (
            <ReactCytoscape containerID="cy"
                elements={this.state.elements}
                cyRef={ this.state.cytoRef }
                cytoscapeOptions={{ wheelSensitivity: 0.5 }}
                layout={this.state.layout}
                style={this.state.style}
            />
        )
    }
}

export default CytoContainer;