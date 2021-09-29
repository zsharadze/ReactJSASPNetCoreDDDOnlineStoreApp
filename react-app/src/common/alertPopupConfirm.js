import React from "react";
import { Button, Modal } from 'react-bootstrap';

export class AlertPopupConfirm extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Modal show={this.props.alertShow}>
                    <Modal.Header closeButton onClick={() => this.props.alertCloseClick()}>
                        <Modal.Title>{this.props.headerText}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.props.text}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => this.props.alertOkClick()}>
                            Ok
                        </Button>
                        <Button variant="danger" onClick={() => this.props.alertCancelClick()}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        )
    }
}