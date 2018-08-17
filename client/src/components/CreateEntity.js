import React from 'react';
import { Popover, Tooltip, Modal, Table, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { createApolloFetch } from 'apollo-fetch';
import gql from 'graphql-tag';
import { RSA_NO_PADDING } from 'constants';
import './entity.css';

const fetch = new createApolloFetch({
  uri: 'http://localhost:4000/graphql',
});

class CreateEntity extends React.Component {
    constructor(props) {
        super(props);

        this.handleDismiss = this.handleDismiss.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.addEntityToGraph = this.addEntityToGraph.bind(this);

        this.state = {
            show: this.props.shouldShow,
            data: [],
            showForm: true,
            id: '',
            value: '',
            type: '',
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.shouldShow !== this.props.shouldShow) {
            this.setState({ show: this.props.shouldShow });
        }
    }

    handleDismiss() {
        this.props.callback();
        this.setState({ show: false, showForm: true });
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        var data = {};

        data[this.state.id] = {
            'id': this.state.id,
            'value': this.state.value,
            'type': this.state.type,
            'fields': [],
            'values': [],
        }

        if (data !== null) {
            this.addEntityToGraph(data[this.state.id]);
            this.setState({ value: '', type: '', id: '' })
        }
	}
	
	addEntityToGraph(data) {
		this.setState({ showForm: true });
		this.props.saveData(data);
	}

    render() {
          return (
            <div id="entityDiv">
              <Modal show={this.state.show} onHide={this.handleDismiss} id="modal">
                <Modal.Header closeButton>
                  <Modal.Title>Create Entity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='createEntity'>
                        <FormGroup
                            controlId="id"
                        >
                            <ControlLabel>ID</ControlLabel>
                            <FormControl type="text" placeholder="Entity ID" name='id' value={this.state.id} onChange={this.handleChange} ></FormControl>
                        </FormGroup>
                            
                        <FormGroup
                            controlId="value"
                        >
                            <ControlLabel>Value</ControlLabel>
                            <FormControl type="text" placeholder="Entity value" name='value' value={this.state.value} onChange={this.handleChange} ></FormControl>
                        </FormGroup>

                        <FormGroup
                            controlId="type"
                        >
                            <ControlLabel>Type</ControlLabel>
                            <FormControl type="text" placeholder="Entity type" name='type' value={this.state.type} onChange={this.handleChange} ></FormControl>
                        </FormGroup>
                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" className={'btn btn-info'} onClick={this.handleSubmit} form='createEntity' >Create</Button>
                </Modal.Footer>
              </Modal>
            </div>
          );
        }
}

export default CreateEntity;