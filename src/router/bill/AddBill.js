import React, { Component } from 'react';
import { Button, Modal, FormControl, Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';
import Panel from 'react-bootstrap/lib/Panel';
import Select from 'react-select';
import './AddBill.css';
import AddProduct from '../product';
import { HOST } from '../../config';

class AddBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newcustomer: {
        phone: '',
        name: '',
        facebook: '',
      },
      addedCustomer: null,
      searchProducts: [],
      loadingProduct: false,
    };
    this.searchProduct = _.debounce(this.searchProduct, 1000);
  }
  searchCustomer() {
    const { customer } = this.props;
    axios.get(`/auth/customer?phone=${customer.phone}`)
     .then(
       (res) => {
         if (res.data.length) {
           this.setState({ addedCustomer: res.data[0] });
         } else {
           window.alert('Khách hàng không tồn tại, hãy tạo khách hàng mới');
         }
       },
       (err) => {
         window.alert('Co loi xay ra');
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
    if (!newcustomer.phone.length) {
      window.alert('Số điện thoại rỗng');
      return;
    }
    axios.post('/auth/customer', {
      phone: newcustomer.phone,
      name: newcustomer.name,
      facebook: newcustomer.facebook,
    }).then(
      (res) => {
        this.setState({ addedCustomer: res.data });
      },
      (err) => {
        window.alert('Khách hàng đã tồn tại');
      },
    )
  }
  removeCustomer() {
    if (window.confirm('Bạn có chắc muốn xóa ?')) {
      this.setState({ addedCustomer: null });
    }
  }
  getProductOptions(products) {
    return products.map((product) => {
      return {
        value: product.id,
        label: `${product.name}, size: ${product.size} code: ${product.code}`,
        product,
      };
    });
  }
  searchProduct(keyword) {
    if (keyword.length < 2) return;
    this.setState({ loadingProduct: true });
    axios.get(`/auth/product/search?q=${keyword}`)
    .then(
      (res) => {
        this.setState({ searchProducts: this.getProductOptions(res.data), loadingProduct: false })
      },
      (error) => {
        this.setState({ loadingProduct: false });
      },
    )
  }
  onSearchProduct(e) {
    this.searchProduct(e);
  }
  onSelectProduct(e) {
    const { changeProduct, products } = this.props;
    const qty = prompt('Nhập số lượng', 1);
    if (qty) {
      const product = _.cloneDeep(e.product);
      product.quantity = qty;
      product.id2 = products.length + 1;
      changeProduct([...products, product]);
    }
  }
  removeProduct(id2) {
    const { changeProduct, products } = this.props;
    if (window.confirm('Bạn có chắc chắn muốn xóa')) {
      changeProduct(products.filter(o => o.id2 !== id2));
    }
  }
  createBill() {
    const { products, user } = this.props;
    const { addedCustomer } = this.state;
    if (!products.length) {
      window.alert('Không có sản phẩm');
      return;
    }
    const billInfo = _.cloneDeep(this.props.billInfo);
    billInfo.user_id = user.userId;
    billInfo.customer_id = addedCustomer.id;
    axios.post('/auth/bill', {
      bill_info: billInfo,
      products: products.map((product) => {
        return { product_id: product.id, quantity: product.quantity };
      }),
    })
      .then(
        (res) => {

        },
        (error) => {

        },
      );
  }
  render() {
    const { newcustomer, addedCustomer, searchProducts, loadingProduct } = this.state;
    const { showForm, close, type, onChange, parent, customer, billInfo, products, changeProduct } = this.props;
    return (
          <Modal show={showForm} onHide={close} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>{type === 'add' ? 'Tạo đơn hàng' : 'Sửa đơn hàng'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Panel header={<span>Khách hàng </span>}  >
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
                  <Form horizontal>
                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}>
                        Số  điện thoại
                      </Col>
                      <Col sm={10}>
                        <FormControl
                        type="text"
                        value={customer.phone}
                        onChange={onChange.bind(parent, 'customer', 'phone')}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}>
                      </Col>
                      <Col sm={10}>
                        <Button bsStyle="success" onClick={this.searchCustomer.bind(this)}>
                          Thêm khách đã lưu
                        </Button>
                      </Col>
                    </FormGroup>
                   <FormGroup>
                     <Col componentClass={ControlLabel} sm={2}>
                       Tên
                     </Col>
                     <Col sm={10}>
                       <FormControl type="text" onChange={this.onChangeNewCustomer.bind(this, 'name')} value={newcustomer.name}/>
                     </Col>
                   </FormGroup>

                   <FormGroup >
                     <Col componentClass={ControlLabel} sm={2}>
                       Số  điện thoại
                     </Col>
                     <Col sm={10}>
                       <FormControl type="text" onChange={this.onChangeNewCustomer.bind(this, 'phone')} value={newcustomer.phone}/>
                     </Col>
                   </FormGroup>
                   <FormGroup >
                     <Col componentClass={ControlLabel} sm={2}>
                       Facebook
                     </Col>
                     <Col sm={10}>
                         <FormControl type="text" onChange={this.onChangeNewCustomer.bind(this, 'facebook')} value={newcustomer.facebook}/>
                     </Col>
                   </FormGroup>
                   <FormGroup >
                    <Col componentClass={ControlLabel} sm={2} />
                    <Col sm={10}>
                     <Button bsStyle="success" onClick={this.addCustomer.bind(this)}>
                       Thêm khách hàng mới
                     </Button>
                     </Col>
                   </FormGroup>
                  </Form>
                </div>
              }
            </Panel>
            {
              addedCustomer ?
              <div>
              <Panel header={<span>Sản phẩm</span>} >
              <div>
                <Select
                  name="form-field-name"
                  options={searchProducts}
                  placeholder="Tìm sản phẩm"
                  noResultsText="Không tìm thấy sản phẩm"
                  isLoading={loadingProduct}
                  onInputChange={this.onSearchProduct.bind(this)}
                  onChange={this.onSelectProduct.bind(this)}
                />
                <p></p>
                <AddProduct noProduct />
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>Tên </th>
                      <th>Mã</th>
                      <th>Size</th>
                      <th>Số lượng</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      products.map((product) => {
                        return (
                          <tr key={product.id2}>
                            <td>
                            {
                              product.image ?
                              <img src={`${HOST}/static/images/${product.image}`} className="product-image" />
                              : null
                            }
                            {product.name}
                            </td>
                            <td>{product.code}</td>
                            <td>{product.size}</td>
                            <td>{product.quantity}</td>
                            <td>
                              <Button bsStyle="danger" bsSize="xs" active onClick={this.removeProduct.bind(this, product.id2)}>
                                Xóa
                              </Button>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
              </Panel>
                <Panel header={<span>Thông tin đơn hàng</span>} >
                  <Form horizontal>
                   <FormGroup>
                     <Col componentClass={ControlLabel} sm={2}>
                       Phí ship
                     </Col>
                     <Col sm={10}>
                       <FormControl
                       type="number"
                       onChange={onChange.bind(parent, 'billInfo', 'shipping')}
                       value={billInfo.shipping}
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
                       onChange={onChange.bind(parent, 'billInfo', 'address')}
                       value={billInfo.address}
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
                       onChange={onChange.bind(parent, 'billInfo', 'pay')}
                       value={billInfo.pay}
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
                       onChange={onChange.bind(parent, 'billInfo', 'note')}
                       value={billInfo.note}
                       />
                     </Col>
                   </FormGroup>
                  </Form>
                </Panel>
                <div className="text-right">
                {
                  type === 'add' ?
                  <Button bsStyle="success" active onClick={this.createBill.bind(this)} >
                    Tạo đơn hàng
                  </Button>
                  :
                  <Button bsStyle="success" active >
                    Sửa đơn hàng
                  </Button>
                }
                </div>
              </div>
              : null
            }
          </Modal.Body>
        </Modal>
  );
  }
}

export default connect((state) => {
  return {
    user: state.data.user,
  };
})(AddBill);
