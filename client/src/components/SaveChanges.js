import React from 'react';
import { Popover, Tooltip, Modal, OverlayTrigger, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class SaveChanges extends React.Component {
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

    handleSubmit(e) {
        var value = e.target.getAttribute('value');
        this.props.callback();
        this.setState({ show: false });

        this.props.saveData(value);
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
                    <h3>Do you wish to save your data?</h3>
                    <br />
                    <Button type="submit" className="btn btn-primary" value={1} onClick={this.handleSubmit}>Yes</Button>
                    <Button type="submit" className="btn btn-danger" value={0} onClick={this.handleSubmit}>No</Button>
                </Modal.Body>
              </Modal>
            </div>
          );
        }
}

export default SaveChanges;