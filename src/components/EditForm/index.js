import React, {Component} from 'react';
import {FormGroup, FormControl, ControlLabel, Button, ButtonToolbar} from 'react-bootstrap'
import PropTypes from 'prop-types';

class EditForm extends Component {
    state = {
        value: !!this.props.title ? this.props.title : ''
    }
    getValidationState() {
        const length = this.state.value.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    handleChange = (e) => {
        const {value} = e.target
        this.setState({ value: !!value ? value : '' });
    }

    render() {
        return (
            <form>
                <FormGroup
                    controlId="editForm"
                    validationState={this.getValidationState()}
                >
                    <ControlLabel>Edit network description</ControlLabel>
                    <FormControl
                        componentClass="textarea"
                        placeholder="textarea"
                        value={this.state.value}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <ButtonToolbar>
                    <Button type="submit" bsSize="xsmall">Save</Button>
                </ButtonToolbar>
            </form>
        );
    }
}
EditForm.propTypes = {};
EditForm.defaultProps = {}

export default EditForm;
