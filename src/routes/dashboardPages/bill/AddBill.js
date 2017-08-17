import React, { Component } from 'react';
import { Button, Modal, FormControl, Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';
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
      newcustomer: {
        phone: '',
        name: '',
        facebook: '',
      },
      addedCustomer: null,
    };
  }
  searchCustomer() {
    const { customer } = this.props;
    axios.get(`/auth/customer?phone=${customer.phone}`)
     .then(
       (res) => {
         if (res.data.length) {
           this.setState({ addedCustomer: res.data[0] });
         } else {
           alert('Khách hàng không tồn tại, hãy tạo khách hàng mới');
         }
       },
       (err) => {
         alert('Co loi xay ra');
       },
     )
  }
  onChangeNewCustomer(field, e) {
    const value = e.target.value;
    if (value.length > 199) return;
    const newcustomer = _.cloneDeep(this.state.newcustomer);
    newcustomer[field] = value;
    this.setState({ newcustomer });
  }
  addCustomer() {
    const { newcustomer } = this.state;
    if (!newcustomer.phone.length) alert('Số điện thoại rỗng');
    axios.post('/auth/customer', {
      phone: newcustomer.phone,
      name: newcustomer.name,
      facebook: newcustomer.facebook,
    }).then(
      (res) => {
        this.setState({ addedCustomer: res.data });
      },
      (err) => {
        alert('Khách hàng đã tồn tại');
      },
    )
  }
  removeCustomer() {
    if (confirm('Bạn có chắc muốn xóa ?')) {
      this.setState({ addedCustomer: null });
    }
  }
  render() {
    const { newcustomer, addedCustomer } = this.state;
    const { showForm, close, type, onChange, parent, customer } = this.props;
    return (
          <Modal show={showForm} onHide={close} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>{type === 'add' ? 'Tạo đơn hàng' : 'Sửa đơn hàng'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Panel header={<span>Khách hàng </span>} >
              {
                addedCustomer ?
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Tên </th>
                        <th>Facebook</th>
                        <th>Điện thoại</th>
                        <th>Số  đơn hàng</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{addedCustomer.name} </td>
                        <td>{addedCustomer.facebook} </td>
                        <td>{addedCustomer.phone} </td>
                        <td>3 </td>
                        <td>
                          <Button bsStyle="danger" bsSize="xs" active onClick={this.removeCustomer.bind(this)}>
                            Xóa
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                :
                <div>
                    <FormGroup>
                      <Col sm={8}>
                        <FormControl
                        type="text"
                        placeholder="Số điện thoại"
                        value={customer.phone}
                        onChange={onChange.bind(parent, 'customer', 'phone')}
                        />
                        <p></p>
                      </Col>
                      <Col sm={4}>
                        <Button bsStyle="success" onClick={this.searchCustomer.bind(this)}>
                          Thêm
                        </Button>
                      </Col>
                    </FormGroup>
                    <p className="clear-fix"></p>
                    <Form inline>
                    <FormGroup controlId="formInlineName">
                      <ControlLabel>Tên</ControlLabel>
                      {' '}
                      <FormControl type="text" onChange={this.onChangeNewCustomer.bind(this, 'name')} value={newcustomer.name}/>
                      <p></p>
                    </FormGroup>
                    &nbsp; &nbsp;
                    <FormGroup controlId="formInlineEmail">
                      <ControlLabel>Sdt</ControlLabel>
                      {' '}
                      <FormControl type="text" onChange={this.onChangeNewCustomer.bind(this, 'phone')} value={newcustomer.phone}/>
                      <p></p>
                    </FormGroup>
                    &nbsp; &nbsp;
                    <FormGroup controlId="formInlineEmail">
                      <ControlLabel>Facebook</ControlLabel>
                      {' '}
                      <FormControl type="text" onChange={this.onChangeNewCustomer.bind(this, 'facebook')} value={newcustomer.facebook}/>
                    </FormGroup>
                    &nbsp; &nbsp;
                    <Button bsStyle="success" onClick={this.addCustomer.bind(this)}>
                      Thêm khách hàng mới
                    </Button>
                  </Form>
                </div>
              }
            </Panel>
            {
              addedCustomer ?
              <div>
                <Panel header={<span>Thông tin đơn hàng</span>} >
                  <Form horizontal>
                   <FormGroup>
                     <Col componentClass={ControlLabel} sm={2}>
                       Phí ship
                     </Col>
                     <Col sm={10}>
                       <FormControl
                       type="number"
                       />
                     </Col>
                   </FormGroup>

                   <FormGroup >
                     <Col componentClass={ControlLabel} sm={2}>
                       Địa chỉ nhận
                     </Col>
                     <Col sm={10}>
                       <FormControl
                       type="text"
                       />
                     </Col>
                   </FormGroup>
                   <FormGroup >
                     <Col componentClass={ControlLabel} sm={2}>
                       Tổng thu
                     </Col>
                     <Col sm={10}>
                       <FormControl
                       type="number"
                       />
                     </Col>
                   </FormGroup>
                   <FormGroup >
                     <Col componentClass={ControlLabel} sm={2}>
                       Ghi chú
                     </Col>
                     <Col sm={10}>
                       <FormControl
                       componentClass="textarea"
                       type="text"
                       />
                     </Col>
                   </FormGroup>
                  </Form>
                </Panel>
                <Panel header={<span>Sản phẩm</span>} >
                </Panel>
              </div>
              : null
            }
          </Modal.Body>
        </Modal>
  );
  }
}

export default withStyles(s)(connect()(AddBill));
