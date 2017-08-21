import React, { Component } from 'react';
import axios from 'axios';
import Panel from 'react-bootstrap/lib/Panel';
import formatCurrency from 'format-currency';
import { Button, Modal, FormControl, Form, FormGroup, Col, ControlLabel, FieldGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import Select from 'react-select';
import className from 'classnames';

import './style.css';
import { receiveProduct, receiveCategory } from '../../actions/fetchData';
import { HOST, PER_PAGE } from '../../config';

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
      file: null,
      price: '',
      id_category: null,
    };
  }
  componentDidMount() {
    const { loaded, category } = this.props;
    if (!loaded) {
      axios.get('/auth/product', ).then(
        (res) => {
          this.props.dispatch(receiveProduct(res.data));
        }
      )
    }
    if (!category.length) {
      this.getCategory();
    }
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
        size: product.size,
        id: product.id,
        instock: product.instock,
        price: product.price,
        id_category: product.id_category,
      });
    } else {
      this.setState({
        name: '',
        code: '',
        quantity: 0,
        size: '',
        id: '',
        instock: 1,
        price: '',
        id_category: null,
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
    const { name, size, code, quantity, type, id, instock, file, price, id_category } = this.state;
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
      size,
      code,
      quantity: quantity || 0,
      instock,
      price,
      id_category,
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
  render() {
    const { products, user, noProduct } = this.props;
    const { showForm, name, username, password, role, type, size, code, quantity, instock, price, id_category } = this.state;
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
               <div className="table-responsive">
                 <table className="table table-striped table-bordered table-hover">
                   <thead>
                     <tr>
                       <th># </th>
                       <th>Tên </th>
                       <th>Mã</th>
                       <th>Size</th>
                       <th>Số lượng </th>
                       <th>Giá </th>
                       <th>Nhóm </th>
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
                             <td>{index + 1} </td>
                             <td>
                              {
                                product.image ?
                                <img src={`${HOST}/images/${product.image}`} className="product-image" />
                                : null
                              }
                              {product.name}
                             </td>
                             <td>{product.code} </td>
                             <td>{product.size} </td>
                             <td>{product.quantity} </td>
                             <td>{formatCurrency(product.price)}</td>
                             <td>{product.category}</td>
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
