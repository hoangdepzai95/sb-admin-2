import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import Panel from 'react-bootstrap/lib/Panel';
import { Button, Modal, FormControl, Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import Select from 'react-select';
import AddBill from './AddBill';

import { receiveProduct } from '../../actions/fetchData';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      customer: {
        phone: '',
        facebook: '',
        name: '',
      },
      billInfo: {
        shipping: 0,
        address: '',
        pay: 0,
        note: '',
      },
      products: [],
      type: '',
    };
  }
  componentDidMount() {
    const { loaded } = this.props;
    if (!loaded) {
      axios.get('/auth/product', ).then(
        (res) => {
          this.props.dispatch(receiveProduct(res.data));
        }
      )
    }
  }
  open(type, id) {
    this.setState({
      showForm: true,
      type,
    });
    if ( type === 'edit') {
      const product = this.props.products.find(product => product.id === id);
      this.setState({
        name: product.name,
        code: product.code,
        quantity: product.quantity,
        size: product.size,
        id: product.id,
        instock: product.instock,
      });
    } else {
      this.setState({
        customerInfo: {},
        billInfo: {},
        products: [],
      });
    }
  }
  close() {
    this.setState({
      showForm: false,
    });
  }
  onChange(type, field, e) {
    const value = e.target.value;
    if (type === 'customer' && field === 'phone' && value.length > 44) return;
    const target = _.cloneDeep(this.state[type]);
    target[field] = value;
    this.setState({ [type]: target });
  }
  replaceProduct(products, target) {
    let clone = [...products];
    clone = clone.map((product) => {
      if (product.id === target.id) {
        return target;
      }
      return product;
    });
    return clone;
  }
  addProduct(e) {
    e.preventDefault();
    const { name, size, code, quantity, type, id, instock } = this.state;
    if (name.length < 1) return;
    if (type === 'edit') {
      axios.put('/auth/product', {
        name,
        size,
        code,
        quantity: quantity || 0,
        id,
        instock,
      })
        .then(
          (res) => {
            this.close();
            this.props.dispatch(receiveProduct(this.replaceProduct(this.props.products, res.data)));
          },
          (err) => {
            alert('Có lỗi xảy ra hoặc tài khoản đã được sử dụng');
          }
        )
    } else {
      axios.post('/auth/product', {
        name,
        size,
        code,
        quantity: quantity || 0,
        instock,
      })
        .then(
          (res) => {
            this.close();
            this.props.dispatch(receiveProduct([...this.props.products, res.data]));
          },
          (err) => {
            alert('Có lỗi xảy ra hoặc tài khoản đã được sử dụng');
          }
        )
    }
  }
  removeProduct(id) {
    if (window.confirm('Bạn có chắc chắn ?')) {
      axios.delete(`/auth/product/${id}`)
      .then(
        (res) => {
           this.props.dispatch(receiveProduct(this.props.products.filter(product => product.id != id)));
        },
        (err) => {
          alert('Co loi xay ra');
        }
      )
    }
  }
  logChange(v) {
    this.setState({ instock: v.value });
  }
  changeProduct(products) {
    this.setState({ products });
  }
  render() {
    const { user } = this.props;
    const { showForm, type, customer, billInfo, products } = this.state;
    var options = [
  { value: 1 , label: 'Còn hàng' },
  { value: 0, label: 'Hết hàng' }
];
    return (
      <div className="row ng-scope">
        <div className="">
        <p></p>
        <div className="text-right">
        <Button onClick={this.open.bind(this, 'add')} bsStyle="success">
          Tạo đơn hàng
        </Button>
        <AddBill
          showForm={showForm}
          close={this.close.bind(this)}
          type={type}
          parent={this}
          onChange={this.onChange}
          customer={customer}
          billInfo={billInfo}
          products={products}
          changeProduct={this.changeProduct.bind(this)}
        />
        </div>
        <p></p>
          <Panel header={<span>Danh sách đơn hàng </span>} >
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th># </th>
                    <th>Tên </th>
                    <th>Mã</th>
                    <th>Size</th>
                    <th>Số lượng </th>
                    <th>Trạng thái</th>
                    {
                      user.role < 3 ?
                      <th>Thao tác</th>
                      : null
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    products.map((product, index) => {
                      return (
                        <tr key={product.id}>
                          <td>{index} </td>
                          <td>{product.name} </td>
                          <td>{product.code} </td>
                          <td>{product.size} </td>
                          <td>{product.quantity} </td>
                          <td>
                            {
                              product.instock == 1 ?
                                <Button bsStyle="success" bsSize="xs"> Còn hàng</Button>
                                :
                                <Button bsStyle="danger" bsSize="xs"> Hết hàng</Button>
                            }
                          </td>
                          {
                            user.role < 3 ?
                            <td>
                              <Button bsStyle="danger" bsSize="xs" active onClick={this.removeProduct.bind(this, product.id)}>
                                Xóa
                              </Button>
                              &nbsp;
                              <Button bsStyle="info" bsSize="xs" active onClick={this.open.bind(this, 'edit', product.id)}>
                                Chỉnh sửa
                              </Button>
                            </td>
                            : null
                          }
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>
    );
  }
}
export default connect((state) => {
  return {
    loaded: state.data.product.loaded,
    products: state.data.product.data,
    user: state.data.user,
  };
})(Home);
