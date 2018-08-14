import React from 'react';
import { Popover, Tooltip, Modal, OverlayTrigger, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class NodeData extends React.Component {
    constructor(props) {
        super(props);

        this.handleDismiss = this.handleDismiss.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            nodeData: this.props.nodeData,
            show: this.props.shouldShow,
            nodeId: this.props.nodeId,
            node: {'fields':[]},
            field: '',
            value: '',
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.shouldShow !== this.props.shouldShow) {
            this.setState({ show: this.props.shouldShow, node: this.props.nodeData[this.props.nodeId], nodeData: this.props.nodeData });
        }
    }

    handleDismiss() {
        this.props.callback(this.state.nodeData);
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit() {
        var fields = this.state.node['fields'];
        var values = this.state.node['values'];
        var node = this.state.node;

        fields.push(this.state.field)
        values.push(this.state.value)

        node['fields'] = fields;
        node['values'] = values;

        this.setState({ node: node, value: '', field: '' });
    }

    render() {
        if (!this.state.show) {
            return (
                <Modal show={this.state.show} onHide={this.handleDismiss}>
                </Modal>
            )
        } else {
            return (
                <Modal show={this.state.show} onHide={this.handleDismiss}>
                <Modal.Header closeButton>
                    <Modal.Title>Node Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <b>ID: </b>{this.state.node['id']}
                        <br />

                        <b>Value: </b>{this.state.node['value']}
                        <br />

                        <b>Type: </b>{this.state.node['type']}
                        <br />

                            {
                                this.state.node['fields'].map((field, i) => {
                                    return (
                                        <div key={field + i}>
                                            <b>{field}: </b> {this.state.node['values'][i]}
                                            <br />
                                        </div>
                                    )
                                })
                            }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <form>
                        <FormGroup
                            controlId="addField"
                        >
                            <FormControl type="text" placeholder="Field" name='field' value={this.state.field} onChange={this.handleChange} ></FormControl>
                            <FormControl type="text" placeholder="Value" name='value' value={this.state.value} onChange={this.handleChange} ></FormControl>
                        </FormGroup>
                    </form>

                    <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Add</button>
                </Modal.Footer>
                </Modal>
            );
        }
    }
}

export default NodeData;