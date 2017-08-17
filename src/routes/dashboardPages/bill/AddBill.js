import React, { Component } from 'react';
import { Button, Modal, FormControl, Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import Panel from 'react-bootstrap/lib/Panel';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AddBill.css';

class AddBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: {
        phone: '',
      },
    };
  }
  onChange(type, field, e) {
    const value = e.target.value;
    if (type === 'customer' && field === 'phone' && value.length > 44) return;
    const target = _.cloneDeep(this.state[type]);
    target[field] = value;
    this.setState({ [type]: target });
  }
  render() {
    const { customer } = this.state;
    const { showForm, close, type } = this.props;
    return (
          <Modal show={showForm} onHide={close} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>{type === 'add' ? 'Tạo đơn hàng' : 'Sửa đơn hàng'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Panel header={<span>Khách hàng </span>} >
              <FormGroup>
                <Col componentClass={ControlLabel} sm={4}>
                  Nhập số điện thoại
                </Col>
                <Col sm={4}>
                  <FormControl
                  type="text"
                  value={customer.phone}
                  onChange={this.onChange.bind(this, 'customer', 'phone')}
                  />
                  <p></p>
                </Col>
                <Col sm={4}>
                  <Button bsStyle="success" >
                    Thêm
                  </Button>
                </Col>
              </FormGroup>
            </Panel>
          </Modal.Body>
        </Modal>
  );
  }
}

export default withStyles(s)(connect()(AddBill));
