import React, { Component } from 'react';
import { Button, Modal, FormControl, Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import shortid from 'shortid';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import axios from 'axios';
import Panel from 'react-bootstrap/lib/Panel';
import Select from 'react-select';
import './AddBill.css';
import AddProduct from '../product';
import { receiveTotalBill, receiveBill } from '../../actions/fetchData';
import { HOST, PER_PAGE } from '../../config';

class AddBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newcustomer: {
        phone: '',
        name: '',
        facebook: '',
      },
      phone: '',
      addedCustomer: null,
      searchProducts: [],
      searchProvince: [],
      searchDistrict: [],
      loadingProduct: false,
      loadedBillDetail: false,
    };
    this.searchProduct = _.debounce(this.searchProduct, 1000);
    this.debouncedSearchCustomer = _.debounce(this.searchCustomer, 1000);
    this.onSearchProvince = _.debounce(this.onSearchProvince, 500);
  }
  componentWillUpdate(nextProps) {
    if(nextProps.showForm && !this.props.showForm) {
      this.setState({
        addedCustomer: null,
        loadedBillDetail: false,
      });
    }
  }
  async componentDidUpdate(prevProps) {
    const { type, billInfo, showForm, changeProduct } = this.props;
    if (showForm && !prevProps.showForm && type === 'edit' ) {
      await this.searchCustomer(billInfo.phone);
      axios.get(`auth/bill/product/${billInfo.id}`)
      .then(
        (res) => {
          changeProduct(res.data.map((product) => {
            product.id2 = shortid.generate();
            return product;
          }));
          this.setState({ loadedBillDetail: true });
        }
      );
    }
  }
  searchCustomer(phone) {
    return axios.get(`/auth/customer?phone=${phone}`)
     .then(
       (res) => {
         if (res.data.length) {
           this.setState({ addedCustomer: res.data[0] });
         } else {
           this.setState({ addedCustomer: null });
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
  addCustomer(phone, cb) {
    if (phone.length < 4) {
      window.alert('Số điện thoại không hợp lệ');
      return;
    }
    axios.post('/auth/customer', {
      phone: phone,
    }).then(
      (res) => {
        this.setState({ addedCustomer: res.data }, cb);
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
        label: product.name,
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
      if (product.instock == 0) {
        alert('Hết hàng');
        return;
      }
      product.quantity = qty;
      product.id2 = shortid.generate();
      changeProduct([...products, product]);
    }
  }
  removeProduct(id2) {
    const { changeProduct, products } = this.props;
    if (window.confirm('Bạn có chắc chắn muốn xóa')) {
      changeProduct(products.filter(o => o.id2 !== id2));
    }
  }
  beforeCreateBill() {
    const { addedCustomer } = this.state;
    if (!addedCustomer) {
      this.addCustomer(this.props.customer.phone, this.createBill)
    } else {
      this.createBill();
    }
  }
  createBill() {
    const { products, user, type, close, page, originBill, status } = this.props;
    const { addedCustomer } = this.state;
    const billInfo = _.cloneDeep(this.props.billInfo);
    if (!billInfo.status_id) {
      window.alert('Chưa chọn trạng thái');
      return;
    }
    if (!addedCustomer) {
      window.alert('Chưa có khách hàng');
      return;
    }
    if (type === 'edit') {
      const originStatus = status.find(o => o.id == originBill.status_id);
      axios.put('/auth/bill', {
        bill_info: {
          shipping: billInfo.shipping || 0,
          address: billInfo.address,
          pay: this.getTotalProductCost(),
          note: billInfo.note,
          province: billInfo.province,
          district: billInfo.district,
          customer_id: addedCustomer.id,
          code: billInfo.code,
          decrease: billInfo.decrease || 0,
          id: billInfo.id,
          status_id: billInfo.status_id,
          facebook: billInfo.facebook,
          customer_name: billInfo.customer_name,
        },
        products: products.map((product) => {
          return { product_id: product.id, quantity: product.quantity, name: product.name };
        }),
        user_id: user.userId,
        origin_bill: originBill,
        user_full_name: user.full_name,
        origin_status_id: originBill.status_id,
        write_log: originStatus.show_notify && user.role != 1 ? 1 : 0,
      })
        .then(
          (res) => {
            this.props.reloadBilld(page);
            close();
          },
          (error) => {
            window.alert('Có lỗi xảy ra');
          },
        );
    } else {
      billInfo.user_id = user.userId;
      billInfo.customer_id = addedCustomer.id;
      billInfo.pay = this.getTotalProductCost();
      billInfo.decrease = billInfo.decrease || 0;
      billInfo.shipping = billInfo.shipping || 0;
      axios.post('/auth/bill', {
        bill_info: billInfo,
        products: products.map((product) => {
          return { product_id: product.id, quantity: product.quantity };
        }),
      })
        .then(
          (res) => {
            this.props.reloadBilld(1);
            close();
          },
          (error) => {
            window.alert('Có lỗi xảy ra');
          },
        );
    }
  }
  getTotalProductCost() {
    const { products, billInfo } = this.props;
    return products.reduce((sum, product) => {
      return sum + product.price * product.quantity;
    }, 0) - (+billInfo.decrease || 0) + (+billInfo.shipping || 0) ;
  }
  getStatusOptions() {
    return this.props.status.map((status) => {
      status.value = status.id;
      status.label = status.name;
      return status
    });
  }
  onSelectStatus(item) {
    this.props.onChange.call(this.props.parent, 'billInfo', 'status_id', { target: { value: item.value } });
  }
  onChangePhone(e) {
    e.preventDefault();
    const phone = e.target.value;

    this.props.onChange.call(this.props.parent, 'customer', 'phone', e);
    if (phone.length > 3) {
      this.debouncedSearchCustomer(phone);
    }
  }
  getProvinceOption(data) {
      return data.map(o => {
          o.value = o.provinceid;
          o.label = o.name;
          return o;
      })
  }
  getDistrictOption(data) {
      return data.map(o => {
          o.value = o.name;
          o.label = o.name;
          return o;
      })
  }
  onSearchProvince(keyword) {
      if (keyword.length >= 1) {
          axios.get(`/auth/bill/search/province?q=${keyword}`)
            .then(
                (res) => {
                    this.setState({ searchProvince: this.getProvinceOption(res.data) });
                },
                (error) => {

                }
            )
      }
  }
  onSelectProvince(e) {
      const { onChange, parent } = this.props;
      onChange.call(parent, 'billInfo', 'province', { target: { value: e.name}});
      this.getDistrict(e.name);
  }
  getDistrict(province) {
      axios.get(`/auth/bill/district?q=${province}`)
        .then(
            (res) => {
                console.log(res)
                this.setState({ searchDistrict: this.getDistrictOption(res.data) })
            },
            (error) => {

            }
        )
  }
  onSelectDistrict(e) {
      const { onChange, parent } = this.props;
      onChange.call(parent, 'billInfo', 'district', { target: { value: e.name}});
  }
  render() {
    const { newcustomer, addedCustomer, searchProducts, loadingProduct, loadedBillDetail, phone, searchProvince, searchDistrict } = this.state;
    const { showForm, close, type, onChange, parent, customer, billInfo, products, changeProduct } = this.props;
    return (
          <Modal show={showForm} onHide={close} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>{type === 'add' ? 'Tạo đơn hàng' : 'Sửa đơn hàng'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Panel header={<span>Khách hàng </span>}  >
                <Form horizontal>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>
                      Số  điện thoại
                    </Col>
                    <Col sm={10}>
                      <FormControl
                      type="text"
                      value={customer.phone}
                      onChange={this.onChangePhone.bind(this)}
                      onKeyDown={(e) => { if(e.keyCode == 13) e.preventDefault() }}
                      />
                    </Col>
                  </FormGroup>
                 </Form>
                 {
                   addedCustomer ?
                   <div className="table-responsive">
                     <table className="table table-striped table-bordered table-hover">
                       <thead>
                         <tr>
                           <th>Điện thoại</th>
                           <th>Số  đơn hàng</th>
                           <th>Thao tác</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr>
                           <td>{addedCustomer.phone} </td>
                           <td>
                           <a target="_blank" href={`${window.location.origin}/home/bill?phone=${addedCustomer.phone}`}>
                           <Button bsStyle="info" bsSize="xs" active>
                             Xem {addedCustomer.bills || 0} đơn
                           </Button>
                           </a>
                           </td>
                           <td>
                             <Button bsStyle="danger" bsSize="xs" active onClick={this.removeCustomer.bind(this)}>
                               Xóa
                             </Button>
                           </td>
                         </tr>
                       </tbody>
                     </table>
                   </div>
                   : null
                 }
            </Panel>
            {
               !(type === 'edit' && !loadedBillDetail) ?
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
                      <th>Số lượng</th>
                      <th>Gía</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      products.map((product) => {
                        return (
                          <tr key={shortid.generate()}>
                            <td>
                            {
                              product.image ?
                              <img src={`${HOST}/images/${product.image}`} className="product-image" />
                              : null
                            }
                            {product.name}
                            </td>
                            <td>{product.code}</td>
                            <td>{product.quantity}</td>
                            <td><NumberFormat value={product.price} displayType={'text'} thousandSeparator={true}/></td>
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
                    Trạng thái
                    </Col>
                    <Col sm={10}>
                    <Select
                    name="form-field-name"
                    options={this.getStatusOptions()}
                    placeholder="Trạng thái"
                    searchable= {false}
                    clearable={false}
                    onChange={this.onSelectStatus.bind(this)}
                    value={billInfo.status_id}
                    />
                    </Col>
                    </FormGroup>
                    <FormGroup >
                      <Col componentClass={ControlLabel} sm={2}>
                        Facebook
                      </Col>
                      <Col sm={10}>
                        <FormControl
                        type="text"
                        onChange={onChange.bind(parent, 'billInfo', 'facebook')}
                        value={billInfo.facebook}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup >
                      <Col componentClass={ControlLabel} sm={2}>
                        <span className="shadow-text">Tên khách</span>
                      </Col>
                      <Col sm={10}>
                        <FormControl
                        type="text"
                        onChange={onChange.bind(parent, 'billInfo', 'customer_name')}
                        value={billInfo.customer_name}
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
                        Tỉnh/Thành phố
                      </Col>
                      <Col sm={6}>
                          <Select
                            name="form-field-name"
                            options={searchProvince}
                            placeholder="Tìm tỉnh/thành phố"
                            noResultsText="Không tìm thấy"
                            onInputChange={this.onSearchProvince.bind(this)}
                            onChange={this.onSelectProvince.bind(this)}
                          />
                      </Col>
                      <Col sm={4}>
                        <p className="text-center">{billInfo.province}</p>
                      </Col>
                    </FormGroup>
                    <FormGroup >
                      <Col componentClass={ControlLabel} sm={2}>
                        Quận/Huyện
                      </Col>
                      <Col sm={6}>
                          <Select
                            name="form-field-name"
                            options={searchDistrict}
                            placeholder="Tìm quận/huyện"
                            noResultsText="Không tìm thấy"
                            searchable= {true}
                            onChange={this.onSelectDistrict.bind(this)}
                          />
                      </Col>
                      <Col sm={4}>
                        <p className="text-center">{billInfo.district}</p>
                      </Col>
                    </FormGroup>
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
                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}>
                        <span className="shadow-text">Giảm giá</span>
                      </Col>
                      <Col sm={10}>
                        <FormControl
                        type="number"
                        onChange={onChange.bind(parent, 'billInfo', 'decrease')}
                        value={billInfo.decrease}
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
                        value={billInfo.note || ''}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}>
                        <span className="shadow-text">Mã đơn</span>
                      </Col>
                      <Col sm={10}>
                        <FormControl
                        type="text"
                        onChange={onChange.bind(parent, 'billInfo', 'code')}
                        value={billInfo.code}
                        />
                      </Col>
                    </FormGroup>
                   <FormGroup >
                     <Col componentClass={ControlLabel} sm={2}>
                       Tổng thu
                     </Col>
                     <Col sm={10}>
                       <FormControl
                       type="text"
                       value={this.getTotalProductCost()}
                       disabled
                       />
                     </Col>
                   </FormGroup>
                  </Form>
                </Panel>
                <div className="text-right">
                {
                  type === 'add' ?
                  <Button bsStyle="success" active onClick={this.beforeCreateBill.bind(this)} >
                    Tạo đơn hàng
                  </Button>
                  :
                  <Button bsStyle="success" active onClick={this.beforeCreateBill.bind(this)}>
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
    status: state.data.status,
  };
})(AddBill);
