import React from 'react';
import { Popover, Tooltip, Modal, OverlayTrigger, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class SaveAlert extends React.Component {
    constructor(props) {
        super(props);

        this.handleDismiss = this.handleDismiss.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            show: this.props.shouldShow,
            value: '',
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
        this.setState({ value: e.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.props.callback();
        this.setState({ show: false });

        this.props.saveData(this.state.value);
    }

    render() {
          const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;
      
          return (
            <div>
              <Modal show={this.state.show} onHide={this.handleDismiss}>
                <Modal.Header closeButton>
                  <Modal.Title>Save Graph</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup
                            controlId="saveGraph"
                        >
                            <ControlLabel>Name</ControlLabel>
                            <FormControl type="text" placeholder="Graph name" value={this.state.value} onChange={this.handleChange} ></FormControl>
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Submit</Button>
                </Modal.Footer>
              </Modal>
            </div>
          );
        }
}

export default SaveAlert;