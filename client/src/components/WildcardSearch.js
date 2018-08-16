import React from 'react';
import { Popover, Tooltip, Modal, Table, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { createApolloFetch } from 'apollo-fetch';
import gql from 'graphql-tag';
import { RSA_NO_PADDING } from 'constants';

const fetch = new createApolloFetch({
  uri: 'http://localhost:4000/graphql',
});

class WildcardSearch extends React.Component {
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
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        // this.props.callback();
        // this.setState({ show: false });

        // this.props.saveData(this.state.value);

        const query = gql`
        query entityQuery($id: String, $value: String, $type: String) {
            wildcard(id: $id, value: $value, type: $type) {
	            id
                value
                type
                fields
                values
            }
        }
        `;

        var variables = {};

        if (this.state.id !== '') {
            variables['id'] = this.state.id;
        }

        if (this.state.value !== '') {
            variables['value'] = this.state.value;
        }

        if (this.state.type !== '') {
            variables['type'] = this.state.type;
        }

        fetch({ query, variables }). then( res => {
			var data = res.data['wildcard'];

            if (data !== null) {
                this.setState({ showForm: false, data: data, value: '', type: '', id: '' })
            }
        });
	}
	
	addEntityToGraph(i) {
		this.setState({ showForm: true });
		this.props.saveData(this.state.data[i]);
	}

    render() {
        const popover = (
            <Popover id="modal-popover" title="popover">
              very popover. such engagement
            </Popover>
          );

          const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;

          var data = this.state.data;
      
          return (
            <div>
              <Modal show={this.state.show} onHide={this.handleDismiss}>
                <Modal.Header closeButton>
                  <Modal.Title>Wildcard Search</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form hidden={!this.state.showForm} id='formSearch'>
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

                    <Table hidden={this.state.showForm}>
            	        <thead>
            	        	<tr>
            	        		<th>ID #</th>
            	        		<th>Entity</th>
            	        		<th>Type</th>
            	        	</tr>
            	        </thead>

            	        <tbody>
            	        	{ data.map((row, i) => {
            	        		return (
            	        			<tr key={row.id + row.id} index={i} data={row.id} onClick={this.rowclick} >
            	        				<td key={row.id}>{row.id}</td>
            	        				<td key={row.value}>{row.value}</td>
            	        				<td key={row.type}>{row.type}</td>
                                        <td>
                                            <Button type="submit" bsStyle="primary" onClick={() => { this.addEntityToGraph(i) }} >Add</Button>
                                        </td>
            	        			</tr>
            	        		)
            	        	}) }
            	        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" className={this.state.showForm ? 'visible' : 'invisible'} onClick={this.handleSubmit} form='formSearch' >Search</Button>
                </Modal.Footer>
              </Modal>
            </div>
          );
        }
}

export default WildcardSearch;