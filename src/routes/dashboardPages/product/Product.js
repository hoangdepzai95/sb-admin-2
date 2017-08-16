import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import _ from 'lodash';
import Panel from 'react-bootstrap/lib/Panel';
import { Button, Modal, FormControl, Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import Select from 'react-select';

import Pagination from 'react-bootstrap/lib/Pagination';
import { receiveProduct } from '../../../actions/fetchData';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      name: '',
      size: '',
      code: '',
      quantity: '',
      type: '',
      id: '',
      instock: 1,
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
        name: '',
        code: '',
        quantity: 0,
        size: '',
        id: '',
        instock: 1,
      });
    }
  }
  close() {
    this.setState({
      showForm: false,
    });
  }
  onChange(type, e) {
    const value = e.target.value;
    if (value.length > 180) return;
    this.setState({
      [type]: value,
    });
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
    if (confirm('Bạn có chắc chắn ?')) {
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
  render() {
    const { products, user } = this.props;
    const { showForm, name, username, password, role, type, size, code, quantity, instock } = this.state;
    var options = [
  { value: 1 , label: 'Còn hàng' },
  { value: 0, label: 'Hết hàng' }
];
    return (
      <div className="row ng-scope">
        <div className="">
          <Panel header={<span>Danh sách sản phẩm </span>} >
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
          {
            user.role < 3 ?
            <Button bsStyle="success" bsSize="large" active onClick={this.open.bind(this, 'add')}>
              Thêm sản phẩm
            </Button>
            : null
          }
          <Modal show={showForm} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>{type === 'add' ? 'Thêm sản phẩm' : 'Chỉnh sửa'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form horizontal>
           <FormGroup>
             <Col componentClass={ControlLabel} sm={2}>
               Tên
             </Col>
             <Col sm={10}>
               <FormControl
               type="text"
               onChange={this.onChange.bind(this, 'name')}
               value={name}
               />
             </Col>
           </FormGroup>

           <FormGroup >
             <Col componentClass={ControlLabel} sm={2}>
               Mã sản phẩm
             </Col>
             <Col sm={10}>
               <FormControl
               type="text"
               onChange={this.onChange.bind(this, 'code')}
               value={code}
               />
             </Col>
           </FormGroup>
           <FormGroup >
             <Col componentClass={ControlLabel} sm={2}>
               Size
             </Col>
             <Col sm={10}>
               <FormControl
               type="text"
               onChange={this.onChange.bind(this, 'size')}
               value={size}
               />
             </Col>
           </FormGroup>
           <FormGroup >
             <Col componentClass={ControlLabel} sm={2}>
               Số lượng
             </Col>
             <Col sm={10}>
               <FormControl
               type="number"
               onChange={this.onChange.bind(this, 'quantity')}
               value={quantity}
               />
             </Col>
           </FormGroup>
           <FormGroup >
             <Col componentClass={ControlLabel} sm={2}>
              Trạng thái
             </Col>
             <Col sm={10}>
               <Select
               name="form-field-name"
               value={instock}
               placeholder="Trạng thái"
               options={options}
               onChange={this.logChange.bind(this)}
               clearable={false}
               />
             </Col>
           </FormGroup>
           <FormGroup>
             <Col smOffset={2} sm={10}>
               <Button onClick={this.addProduct.bind(this)} bsStyle="success" bsSize="large">
                 {type === 'add' ? 'Thêm sản phẩm' : 'Chỉnh sửa'}
               </Button>
             </Col>
           </FormGroup>
          </Form>
          </Modal.Body>
        </Modal>
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
