import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import fileExtension from 'file-extension';
import Panel from 'react-bootstrap/lib/Panel';
import formatCurrency from 'format-currency';
import { Button, Modal, FormControl, Form, FormGroup, Col, ControlLabel, Pagination, InputGroup, Checkbox } from 'react-bootstrap';
import { connect } from 'react-redux';
import Select from 'react-select';
import AddBill from './AddBill';
import FileSaver from 'file-saver';

import { receiveTotalBill, receiveBill, receiveStatus } from '../../actions/fetchData';
import { HOST, PER_PAGE } from '../../config';

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
        decrease: 0,
        code: '',
        status_id: null,
      },
      products: [],
      type: '',
      page: 1,
      mode: 'normal',
      keyword: '',
      idFilterStatus: null,
      selectedBills: [],
    };
    this.onSearchBill = _.debounce(this.onSearchBill, 1000);
  }
  componentDidMount() {
    const { loaded, currentPage,status } = this.props;
    if (!loaded) {
      this.getTotal();
      this.getBills(1);
    }
    if (!status.length) {
      this.getStatus();
    }
  }
  getBills(page, idFilterStatus) {
    const { mode } = this.state;
    return axios.get(`auth/bill?per_page=${PER_PAGE}&page=${page}&mode=${mode}&idStatus=${idFilterStatus}`)
      .then(
        (res) => {
          this.props.dispatch(receiveBill(res.data, page));
        },
        (error) => {

        },
      )
  }
  getTotal(idFilterStatus) {
    const { mode } = this.state;
    return axios.get(`/auth/bill/total?mode=${mode}&idStatus=${idFilterStatus}`, ).then(
      (res) => {
        this.props.dispatch(receiveTotalBill(res.data.quantity));
      }
    )
  }
  open(type, id) {
    const bills = this.props.bills[this.state.page] || [];
    this.setState({
      showForm: true,
      type,
    });
    if (type === 'edit') {
      const bill = bills.find(o => o.id === id);
      this.setState({
        billInfo: bill,
        customer: {
          phone: bill.phone,
        },
        products: [],
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
  logChange(v) {
    this.setState({ instock: v.value });
  }
  changeProduct(products) {
    this.setState({ products });
  }
  handleSelectPage(page) {
    const { bills } = this.props;
    this.setState({ page: page });
    if (!bills[page]) {
      this.getBills(page);
    }
  }
  getStatus() {
    axios.get('auth/bill/status')
      .then(
        (res) => {
          this.props.dispatch(receiveStatus(res.data));
        },
        (error) => {
        },
      )
  }
  getStatusOptions() {
    return this.props.status.map((status) => {
      status.value = status.id;
      status.label = status.name;
      return status
    });
  }
  async onSelectStatus(item) {
    const { mode } = this.state;
    this.setState({
      mode: 'filterByStatus',
      idFilterStatus: item.value,
      page: 1,
    }, () => {
      this.getTotal(item.value);
      this.getBills(1, item.value);
    });
  }
  clearAll() {
    this.setState({
      mode: 'normal',
      page: 1,
      idFilterStatus: null,
    }, () => {
      this.getTotal();
      this.getBills(1);
    });
  }
  onChangeSearchBill(e) {
    const keyword = e.target.value;
    if (keyword.length < 3) return ;
    this.onSearchBill(keyword);
  }
  onSearchBill(keyword) {
    this.setState({
      mode: 'search',
      page: 1,
      idFilterStatus: null,
      keyword,
    });
    axios.get(`/auth/bill/search?q=${keyword}`)
      .then(
        (res) => {
          this.props.dispatch(receiveBill(res.data, 1));
        },
        (error) => {

        },
      )
  }
  reloadBilld(page) {
    const { keyword, mode } = this.state;
    if (mode === 'search') {
      this.onSearchBill(keyword);
    } else {
      axios.get(`auth/bill?per_page=${PER_PAGE}&page=${page}&mode=${mode}`)
        .then(
          (res) => {
            this.props.dispatch(receiveBill(res.data, page));
          },
          (error) => {

          },
        )
    }
  }
  selectBill(bill) {
    const { selectedBills } = this.state;
    if (selectedBills.find(o => o.id === bill.id)) {
      this.setState({ selectedBills: selectedBills.filter(o => o.id !== bill.id) });
    } else {
      this.setState({ selectedBills: [...this.state.selectedBills, bill] });
    }
  }
  unSelectAllBills() {
    this.setState({ selectedBills: [] });
  }
  selectAllBills() {
    const bills = this.props.bills[this.state.page] || [];
    this.setState({ selectedBills: _.uniqBy([...this.state.selectedBills, ...bills], 'id') });
  }
  exportToEXcel() {
    const { selectedBills } = this.state;
    if (!selectedBills.length) {
      window.alert('Không có hóa đơn được chọn');
      return;
    }
    const header = ['ID', 'Mã', 'Nhân viên', 'Trạng thái', 'Facebook', 'Tên khách hàng', 'Số điện thoại', 'Sản phẩm', 'Danh mục', 'Số lượng', 'Địa chỉ', 'Tổng thu', 'Ghi chú' ];
    const bills = selectedBills.map((bill) => {
      const categories = _.uniq(bill.products.map(product => product.category)).join('+');
      const quantity = bill.products.reduce((sum, product) => {
                                        return sum + product.quantity;
                                      }, 0);
      return [bill.id, bill.code, bill.user_name, bill.status, bill.facebook, bill.customer_name, bill.phone, bill.products_info, categories, quantity,  bill.address, bill.pay || 0, bill.note];
    });
    if (window.confirm('Quá trình này có thể  lâu, vui lòng đợi ?')) {
      axios.post('/auth/bill/excel', {
        bills: [header, ...bills],
      }, { responseType: 'blob' }).then(
        (res) => {
          FileSaver.saveAs(res.data, "Don-Hang.xlsx");
        },
        (error) => {
          alert('Lỗi mịa nó rùi :(');
        }
      )
    }
  }
  onFileChange(e) {
    e.persist();
    const file = e.target.files[0];
    if (file) {
      if (fileExtension(file.name) === 'xlsx') {
        if (!window.confirm('Tác vụ tốn thời gian, đủ kiên nhẫn đợi không ?')) return;
        const formData = new FormData();
        formData.append('file', file);
        axios.post('/auth/bill/excel/upload', formData)
        .then(
          (res) => {
            window.alert(res.data.message);
            e.target.value = null;
          },
          (res) => {
            window.alert('Có lỗi xảy ra');
            e.target.value = null;
          },
        )
      } else {
        window.alert('Không phải file excel');
      }
    }
  }
  updateByExcel() {
    const el = document.getElementById('excel-up');
    if (el) el.click();
  }
  render() {
    const { user, total } = this.props;
    const { showForm, type, customer, billInfo, products, page, mode, idFilterStatus, selectedBills } = this.state;
    const bills = this.props.bills[page] || [];
    var options = [
  { value: 1 , label: 'Còn hàng' },
  { value: 0, label: 'Hết hàng' }
];
    return (
      <div className="row ng-scope">
        <div className="">
        <p></p>
        <div>
          <Col md={3}>
          <Select
            name="form-field-name"
            options={this.getStatusOptions()}
            placeholder="Lọc theo trạng thái"
            searchable= {false}
            clearable={false}
            onChange={this.onSelectStatus.bind(this)}
            value={idFilterStatus}
          />
          <p></p>
          </Col>
          <Col md={3}>
            <FormControl
            type="text"
            placeholder="Tìm kiếm"
            onChange={this.onChangeSearchBill.bind(this)}
            />
            <p></p>
          </Col>
          <Col md={3}>
            <Button bsStyle="warning" onClick={this.clearAll.bind(this)}>
              Bỏ lọc và tìm kiếm
            </Button>
          </Col>
          <Col md={3}>
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
                page={page}
                mode={mode}
                reloadBilld={this.reloadBilld.bind(this)}
              />
            </div>
          </Col>
          <p className="clear-fix"></p>
        </div>
        <p className="clear-fix"></p>
        <p></p>
          <Panel header={<span>Danh sách đơn hàng </span>} >
            <div className="table-responsive bill-table">
            <div>
              <Button onClick={this.selectAllBills.bind(this)} bsStyle="success">
                Chọn tất cả ({selectedBills.length})
              </Button>
              &nbsp;
              <Button onClick={this.unSelectAllBills.bind(this)} bsStyle="danger">
                Bỏ chọn tất cả
              </Button>
              &nbsp;
              <Button onClick={this.exportToEXcel.bind(this)} bsStyle="primary">
                Xuất ra file excel
              </Button>
              &nbsp;
              <Button  bsStyle="primary" onClick={this.updateByExcel.bind(this)}>
                Cập nhật bằng file excel
              </Button>
              <input type="file" className="hide" id="excel-up" onChange={this.onFileChange.bind(this)} />
              <p></p>
            </div>
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Chọn</th>
                    <th>Mã</th>
                    <th>Nhân viên</th>
                    <th>Trạng thái</th>
                    <th>Facebook</th>
                    <th>Tên khách hàng</th>
                    <th>Số điện thoại</th>
                    <th>Sản phẩm</th>
                    <th>Địa chỉ</th>
                    <th>Tổng thu</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    bills.map((bill, index) => {
                      return (
                        <tr key={bill.id}>
                          <td className="pointer" onClick={this.selectBill.bind(this, bill)}>
                            <Checkbox checked={selectedBills.find(o => o.id === bill.id)} >
                              <span>#{bill.id}</span>
                            </Checkbox>
                            {
                              bill.status_id !== 2 ?
                              <Button bsStyle="info" bsSize="xs" active onClick={this.open.bind(this, 'edit', bill.id)}>
                                Chỉnh sửa
                              </Button>
                              : null
                            }
                          </td>
                          <td>{bill.code} </td>
                          <td>{bill.user_name} </td>
                          <td>{bill.status} </td>
                          <td>{bill.facebook} </td>
                          <td>{bill.customer_name} </td>
                          <td>{bill.phone} </td>
                          <td>
                            {bill.products_info}
                          </td>
                          <td>{bill.address}</td>
                          <td>{formatCurrency(bill.pay)}</td>
                          <td>{bill.note}</td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
              <div className="text-center">
               {
                 mode === 'search' ?
                 null
                 :
                 <Pagination
                    prev
                    next
                    first
                    last
                    ellipsis
                    boundaryLinks
                    items={Math.ceil(total / PER_PAGE)}
                    maxButtons={5}
                    activePage={page}
                    onSelect={this.handleSelectPage.bind(this)}
                  />
               }
              </div>
            </div>
          </Panel>
        </div>
      </div>
    );
  }
}
export default connect((state) => {
  return {
    currentPage: state.data.bill.currentPage,
    bills: state.data.bill.data,
    total: state.data.bill.total,
    user: state.data.user,
    status: state.data.status,
  };
})(Home);
