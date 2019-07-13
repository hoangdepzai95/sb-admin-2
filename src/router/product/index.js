import React, { Component } from 'react';
import axios from 'axios';
import Panel from 'react-bootstrap/lib/Panel';
import NumberFormat from 'react-number-format';
import { Button, Modal, FormControl, Form, FormGroup, Col, ControlLabel, FieldGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import Select from 'react-select';
import className from 'classnames';
import Switch from 'rc-switch';

import './style.css';
import { receiveProduct, receiveCategory } from '../../actions/fetchData';
import { HOST, PER_PAGE } from '../../config';
import Product from './Product';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      name: '',
      code: '',
      quantity: '',
      type: '',
      id: '',
      instock: 1,
      file: null,
      price: '',
      real_price: '',
      real_price_2: '',
      id_category: null,
      filterByRealPrice: false,
      care_time: null
    };
  }
  componentDidMount() {
    const { loaded, category } = this.props;
    this.getProducts();
    if (!category.length) {
      this.getCategory();
    }
  }
  getProducts() {
    const { filterByRealPrice } = this.state;
    axios.get(`/auth/product?filter_real_price=${filterByRealPrice ? 1 : 0}`, ).then(
      (res) => {
        this.props.dispatch(receiveProduct(res.data));
      }
    )
  }
  getCategory() {
    axios.get('auth/bill/category')
      .then(
        (res) => {
          this.props.dispatch(receiveCategory(res.data));
        },
        (error) => {
        },
      )
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
        id: product.id,
        instock: product.instock,
        price: product.price,
        real_price: product.real_price,
        real_price_2: product.real_price_2,
        id_category: product.id_category,
        care_time: product.care_time
      });
    } else {
      this.setState({
        name: '',
        code: '',
        quantity: 0,
        id: '',
        instock: 1,
        price: '',
        real_price: '',
        real_price_2: '',
        id_category: null,
        care_time: null
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
  onChangeFile(type, e) {
    const file = e.target.files[0];
    if (file && file.size > 21959 * 10) {
      window.alert('Kich thuoc toi da la 200Kb');
      return;
    }
    this.setState({ file });
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
    const { name, code, quantity, type, id, instock, file, price, id_category, real_price, real_price_2, care_time } = this.state;
    if (name.length < 1 || !price) {
      window.alert('Tên và giá sản phẩm không được bỏ trống');
      return;
    };
    if (!id_category) {
      window.alert('Chưa chọn nhóm hàng');
      return;
    }
    const product = {
      name,
      code,
      quantity: quantity || 0,
      instock,
      price,
      real_price: real_price || 0,
      real_price_2: real_price_2 || 0,
      id_category,
      care_time
    };
    if (type === 'edit') product.id = id;
    const formData = new FormData();
    formData.append('product', JSON.stringify(product));
    if (file) formData.append('file', file);

    if (type === 'edit') {
      axios.put('/auth/product', formData)
        .then(
          (res) => {
            this.close();
            this.props.dispatch(receiveProduct(this.replaceProduct(this.props.products, res.data)));
          },
          (err) => {
            alert('Có lỗi xảy ra hoặn tên sản phẩm được sử dụng');
          }
        )
    } else {
      axios.post('/auth/product', formData)
        .then(
          (res) => {
            this.close();
            this.props.dispatch(receiveProduct([...this.props.products, res.data]));
          },
          (err) => {
            alert('Có lỗi xảy ra hoặn tên sản phẩm được sử dụng');
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
  onChangeCategory(v) {
    this.setState({ id_category: v.value });
  }
  getCategoryOptions() {
    return this.props.category.map((item) => {
      item.value = item.id;
      item.label = item.category;
      return item
    });
  }
  onChangeFilter = (v) => {
    this.setState({ filterByRealPrice: v }, this.getProducts);
  }
  render() {
    const { products, user, noProduct } = this.props;
    const { showForm, name, username, password, role, type, code, quantity, instock, price, id_category, real_price, real_price_2, filterByRealPrice, care_time } = this.state;
    var options = [
  { value: 1 , label: 'Còn hàng' },
  { value: 0, label: 'Hết hàng' }
];
    return (
      <div className=" ng-scope">
        <div className="">
        <p></p>
        <div className="text-right">
          <Button bsStyle="success" active onClick={this.open.bind(this, 'add')}>
            Thêm sản phẩm
          </Button>
        </div>
        <p></p>
          {
            noProduct ?
             null
             :
             <Panel header={<span>Danh sách sản phẩm </span>} >
                {
                  user.role == 1 ?
                  <div>
                    <span>Lọc sản phẩm chưa có giá nhập&nbsp;</span>
                    <Switch checked={filterByRealPrice} onChange={this.onChangeFilter} />
                    <p></p>
                  </div>
                  : null
                }
               <div className="table-responsive">
                 <table className="table table-striped table-bordered table-hover">
                   <thead>
                     <tr>
                       <th># </th>
                       <th>Tên </th>
                       <th>Mã</th>
                       <th>Số lượng </th>
                       <th>Giá </th>
                       {
                         user.role == 1 ?
                         <th>Giá nhập </th>
                         : null
                       }
                       <th>Giá sỉ</th>
                       <th>Nhóm </th>
                       <th>Trạng thái</th>
                       {
                         user.role < 3 ?
                         <th>Thao tác</th>
                         : null
                       }
                     </tr>
                   </thead>
                   <Product
                    user={user}
                    products={products}
                    parent={this}
                    removeProduct={this.removeProduct}
                    open={this.open}
                   />
                 </table>
               </div>
             </Panel>
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
               Nhóm sản phẩm
             </Col>
             <Col sm={10}>
               <Select
               name="form-field-name"
               value={id_category}
               placeholder="Nhóm"
               options={this.getCategoryOptions()}
               onChange={this.onChangeCategory.bind(this)}
               clearable={false}
               searchable= {false}
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
               Giá
             </Col>
             <Col sm={10}>
               <FormControl
               type="number"
               onChange={this.onChange.bind(this, 'price')}
               value={price}
               />
             </Col>
           </FormGroup>
           {
             user.role == 1 ?
             <FormGroup >
               <Col componentClass={ControlLabel} sm={2}>
                 Giá nhập
               </Col>
               <Col sm={10}>
                 <FormControl
                 type="number"
                 onChange={this.onChange.bind(this, 'real_price')}
                 value={real_price}
                 />
               </Col>
             </FormGroup>
             : null
           }
           <FormGroup >
             <Col componentClass={ControlLabel} sm={2}>
               Giá sỉ
             </Col>
             <Col sm={10}>
               <FormControl
               type="number"
               onChange={this.onChange.bind(this, 'real_price_2')}
               value={real_price_2}
               />
             </Col>
           </FormGroup>
            <FormGroup >
              <Col componentClass={ControlLabel} sm={2}>
                Thời gian chăm sóc (ngày)
              </Col>
              <Col sm={10}>
                <FormControl
                  type="number"
                  onChange={this.onChange.bind(this, 'care_time')}
                  value={care_time}
                />
              </Col>
            </FormGroup>
           <FormGroup >
             <Col componentClass={ControlLabel} sm={2}>
               Ảnh
             </Col>
             <Col sm={10}>
               <FormControl
                 type="file"
                 accept="image/*"
                 onChange={this.onChangeFile.bind(this, 'file')}
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
               searchable= {false}
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
    category: state.data.category,
  };
})(Home);
