import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import fileExtension from 'file-extension';
import Panel from 'react-bootstrap/lib/Panel';
import NumberFormat from 'react-number-format';
import { Button, Modal, FormControl, Form, FormGroup, Col, ControlLabel, Pagination, InputGroup, Checkbox } from 'react-bootstrap';
import { connect } from 'react-redux';
import Select from 'react-select';
import AddBill from './AddBill';
import FileSaver from 'file-saver';
import moment from 'moment';
import className from 'classnames';

import { receiveTotalBill, receiveBill, receiveStatus } from '../../actions/fetchData';
import { HOST, PER_PAGE } from '../../config';
import DatePicker from './datepicker';

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
        _province: '',
        _district: '',
        _ward: '',
        province_id: '',
        district_id: '',
        ward_id: '',
        decrease: 0,
        code: '',
        status_id: null,
        facebook: '',
        customer_name: '',
      },
      products: [],
      type: '',
      page: 1,
      mode: 'normal',
      keyword: '',
      searchType: '',
      idFilterStatus: [],
      searchOptionsValue: '',
      selectedBills: [],
      singleBill: null,
      showChangeStatus: false,
      originBill: null,
      startDate: moment(),
      endDate: moment().add(1, 'days'),
      enableFilterDate: false,
      showProducts: false,
      products_info: ''
    };
    this.onSearchBill = _.debounce(this.onSearchBill, 500);

  }
  componentWillMount() {
    const phone = this.getQueryStringValue('phone');
    const id = this.getQueryStringValue('id');
    if (phone) {
      this.onSearchBill(phone, 'phone');
    } else if (id) {
      this.onSearchBill(id, 'id');
    }

    window.billComponent = this;
  }

  componentWillUnmount() {
    window.billComponent = null;
  }

  componentDidMount() {
    const { loaded, currentPage,status } = this.props;
    const phone = this.getQueryStringValue('phone');
    const id = this.getQueryStringValue('id');
    if (phone || id) return;
    this.getTotal();
    this.getBills();
    if (!status.length) {
      this.getStatus();
    }
  }
  getQueryStringValue (key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  }
  getBills(pageToLoad) {
    const { idFilterStatus, subMode, startDate, endDate, keyword, searchType, enableFilterDate } = this.state;
    const { mode } = this.state;
    const start_date = startDate.startOf('day').format('x');
    const end_date = endDate.startOf('day').format('x');
    const page = pageToLoad || this.state.page;
    if (mode === 'search') {
      this.searchBill(keyword, searchType, page);
      return;
    }
    return axios.get(`auth/bill?per_page=${PER_PAGE}&page=${page}&mode=${mode}&idStatus=${idFilterStatus.join(',')}&filter_date=${enableFilterDate ? 1 : 0}&start_date=${start_date}&end_date=${end_date}`)
      .then(
        (res) => {
          this.props.dispatch(receiveBill(res.data, page));
        },
        (error) => {

        },
      )
  }
  getTotal() {
    const { mode, idFilterStatus, startDate, endDate, enableFilterDate } = this.state;
    const start_date = startDate.startOf('day').format('x');
    const end_date = endDate.startOf('day').format('x');

    return axios.get(`/auth/bill/total?mode=${mode}&idStatus=${idFilterStatus.join(',')}&filter_date=${enableFilterDate ? 1 : 0}&start_date=${start_date}&end_date=${end_date}`, ).then(
      (res) => {
        this.props.dispatch(receiveTotalBill(res.data.quantity));
      }
    )
  }
  open(type, id, e) {
    const bills = this.props.bills[this.state.page] || [];
    this.setState({
      showForm: true,
      type,
    });
    if (type === 'edit') {
      e.stopPropagation();
      const bill = bills.find(o => o.id === id);
      this.setState({
        billInfo: bill,
        originBill: bill,
        customer: {
          phone: bill.phone,
        },
        products: [],
      });

      if ((bill._province || '').trim()) {
         this.addBill.getDistrict(bill._province)
         
      }

      if ((bill._ward || '').trim()) {
         this.addBill.getWard(bill._district);
         
      }

    } else {
      this.setState({
        customer: {
          phone: '',
        },
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
    this.setState({ page: page }, () => {
      this.getBills();
    });
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
  async onSelectStatus(value) {
    if (!value) {
      this.clearAll();
      return;
    }
    value = value.split(',').map(o => +o);
    const { mode } = this.state;
    this.setState({
      mode: 'filterByStatus',
      idFilterStatus: value,
      page: 1,
    }, () => {
      this.getTotal();
      this.getBills();
    });
  }

  onSelectSearchOPtions(value) {
    this.setState({ searchOptionsValue: value });
    this.onSearchBill(this.state.keyword);
  }

  clearAll() {
    this.setState({
      mode: 'normal',
      page: 1,
      enableFilterDate: false,
      idFilterStatus: [],
      keyword: ''
    }, () => {
      this.getTotal();
      this.getBills();
    });
  }
  onChangeSearchBill(e) {
    const keyword = e.target.value;
    this.onSearchBill(keyword);
  }
  onSearchBill(keyword, type = '') {
    const { page } = this.state;
    if (!keyword && !type) {
      this.clearAll();
      return;
    }
    if (keyword.length < 3 && !type) return ;
    this.setState({
      mode: 'search',
      page: 1,
      enableFilterDate: false,
      idFilterStatus: [],
      searchType: type,
      keyword,
    });
    this.getTotalSearch(keyword, type, page);
    this.searchBill(keyword, type, page);
  }
  searchBill(keyword, type = '', page) {
    axios.get(`/auth/bill/search?q=${keyword}&type=${type}&page=${page}&per_page=${PER_PAGE}&fields=${this.state.searchOptionsValue}`)
      .then(
        (res) => {
          this.props.dispatch(receiveBill(res.data, page));
        },
        (error) => {

        },
      )
  }
  getTotalSearch(keyword, type = '', page) {
    const { mode, idFilterStatus } = this.state;
    return axios.get(`/auth/bill/search?q=${keyword}&type=${type}&page=${page}&per_page=${PER_PAGE}&mode=count&fields=${this.state.searchOptionsValue}`, ).then(
      (res) => {
        this.props.dispatch(receiveTotalBill(res.data.quantity));
      }
    )
  }
  reloadBilld(page) {
    const { keyword, mode, searchType } = this.state;
    if (mode === 'search') {
      this.onSearchBill(keyword, searchType);
    } else {
      this.getBills(page);
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
    const header = [
        'ID',
        'Mã',
        'Trạng thái',
        'Giá cước',
        'Nhân viên',
        'Tên trên phiếu',
        'Facebook',
        'Tên khách hàng',
        'Số điện thoại',
        'Sản phẩm',
        'Danh mục',
        'Số lượng',
        'Địa chỉ',
        'Địa chỉ đầy đủ',
        'Mã tỉnh/thành phố',
        'Mã quận/huyện',
        'Tổng thu',
        'Ghi chú'
    ];
    let bills = selectedBills.map((bill) => {
      const categories = _.uniq(bill.products.map(product => product.category)).join('+');
      const quantity = bill.products.reduce((sum, product) => {
                                        return sum + product.quantity;
                                      }, 0);
      return [
          bill.id,
          bill.code,
          bill.status,
          bill.real_shipping,
          bill.user_name,
          bill.customer_name || bill.facebook || '',
          bill.facebook,
          bill.customer_name,
          bill.phone,
          bill.products_info,
          categories,
          quantity,
          bill.address,
          `${bill.address || ''}, ${bill._ward}, ${bill._district}, ${bill._province}`,
          bill.province_custom_id,
          bill.district_custom_id,
          bill.pay || 0,
          bill.note
      ];
    });
    bills = _.sortBy(bills, o => o[1]);
    if (window.confirm('Quá trình này có thể  lâu, vui lòng đợi ?')) {
      axios.post('/auth/bill/excel', {
        bills: [header, ...bills],
      }, { responseType: 'blob' }).then(
        (res) => {
          FileSaver.saveAs(res.data, "Don-Hang.xlsx");
          this.setState({ selectedBills: [] });
        },
        (error) => {
          alert('Lỗi mịa nó rùi :(');
        }
      )
    }
  }
  exportGhn() {
      const { selectedBills } = this.state;
      if (!selectedBills.length) {
        window.alert('Không có hóa đơn được chọn');
        return;
      }
      const header = [
          'Nguoi_Nhan',
          'Dien_Thoai',
          'Dia_Chi',
          'Tinh_Thanh',
          'Quan',
          'Dich_Vu',
          'Hinh_Thuc_Thanh_Toan',
          'Ghi_Chu',
          'COD',
          'Ma_Shop',
          'Khoi_Luong_(gr)',
          'Dai_(cm)',
          'Rong_(cm)',
          'Cao_(cm)',
          'KL_Quy_Doi_(gr)',
          'Noi_Dung_Hang',
          'Ghi chú bắt buộc',
          'Gửi hàng tại điểm'
      ];
      let bills = selectedBills.map((bill) => {
        const categories = _.uniq(bill.products.map(product => product.category)).join('+');
        const quantity = bill.products.reduce((sum, product) => {
                                          return sum + product.quantity;
                                        }, 0);
        return [
            bill.customer_name || bill.facebook || '',
            _.trim(bill.phone),
            `${bill.address || ''}, ${bill._district}, ${bill._province}`,
            bill.province_custom_id,
            bill.district_custom_id,
            '2 - Chuẩn',
            '1 - Người gửi trả tiền',
            bill.note,
            bill.pay || 0,
            bill.id,
            500,
            10,
            10,
            10,
            200,
            categories,
            '1 -  Cho xem hàng, không cho thử',
            '1 - Có'
        ]
      });
      if (window.confirm('Quá trình này có thể  lâu, vui lòng đợi ?')) {
        axios.post('/auth/bill/excel', {
          bills: [header, ...bills],
        }, { responseType: 'blob' }).then(
          (res) => {
            FileSaver.saveAs(res.data, "Don-Hang.xlsx");
            this.setState({ selectedBills: [] });
          },
          (error) => {
            alert('Lỗi mịa nó rùi :(');
          }
        )
      }
  }
  exportProducts() {
      const { selectedBills } = this.state;
      if (!selectedBills.length) {
        window.alert('Không có hóa đơn được chọn');
        return;
      }
      let products = [];
      for ( let bill of selectedBills) {
          products = products.concat(bill.products);
      }
      products = _.groupBy(products, 'name');
      const header = [
          'Sản phẩm',
          'Số lượng'
      ];
      let products_infos = [];
      for (let product_name in products) {
          products_infos.push(`${product_name}: ${_.sumBy(products[product_name], 'quantity')}`);
      }
      this.setState({
          showProducts: true,
          products_info: products_infos.sort().join('\n')
      })
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
  onFileSatusChange(e) {
    e.persist();
    const file = e.target.files[0];
    if (file) {
      if (fileExtension(file.name) === 'xlsx') {
        if (!window.confirm('Tác vụ tốn thời gian, đủ kiên nhẫn đợi không ?')) return;
        const formData = new FormData();
        formData.append('file', file);
        axios.post('/auth/bill/excel/upload_status', formData)
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
  updateStatusByExcel() {
    const el = document.getElementById('excel-up-status');
    if (el) el.click();
  }
  deleteBill(id, e) {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xóa ?')) {
      axios.delete(`/auth/bill/${id}`)
        .then(
          (res) => {
            this.reloadBilld(this.state.page);
          },
          (error) => {
            window.alert('Có lỗi xảy ra');
          },
        )
    }
  }
  openChangeStatus(bill) {
    this.setState({ showChangeStatus: true });
    if (bill.id) {
       this.setState({ selectedBills: [bill] });
    }
  }
  getStatusOptions() {
    return this.props.status.map((status) => {
      status.value = status.id;
      status.label = status.name;
      return status
    });
  }
  closeChangeStatus() {
    this.setState({ showChangeStatus: false });
  }
  onChangeChangeStatus(item) {
    const { user, status } = this.props;
    if (window.confirm(`Thay đổi các đơn đã chọn sang trang thái ${item.label} ?`)) {
      axios.put('auth/bill/change_status', {
        status_id: item.id,
        bills: this.state.selectedBills.map((bill) => {
          return { id: bill.id, status_id: bill.status_id };
        }),
        user_id: user.userId,
        user_full_name: user.full_name,
        status,
        write_log: user.role != 1 ? 1 : 0,
      })
      .then(
        (res) => {
          this.getBills();
          this.closeChangeStatus();
          this.setState({ selectedBills: [] });
        },
        (error) => {
          window.alert('Có lỗi xảy ra');
          this.closeChangeStatus();
        },
      )
    }
  }
  notDuplicate(id) {
    if (window.confirm(`Xác nhận đơn không trùng`)) {
      axios.put(`auth/bill/not_duplicate/${id}`)
      .then(
        (res) => {
          this.reloadBilld(this.state.page);
        },
        (error) => {
          window.alert('Có lỗi xảy ra');
        },
      )
    }
  }
  duplicate(id) {
    if (window.confirm(`Xác nhận đơn trùng`)) {
      axios.put(`auth/bill/duplicate/${id}`)
      .then(
        (res) => {
          this.reloadBilld(this.state.page);
        },
        (error) => {
          window.alert('Có lỗi xảy ra');
        },
      )
    }
  }
  filterDuplicate() {
    this.onSearchBill('', 'duplicate');
  }
  handleChangeStart = (e) => {
    this.setState({ startDate: e , enableFilterDate: false });

  }
  handleChangeEnd = (e) => {
    this.setState({ endDate: e, enableFilterDate: false });

  }
  onChangeFilterDate = (e) => {
    this.setState({ enableFilterDate: e, page: 1 }, () => {
      this.reloadBilld(1);
      this.getTotal();
    });
  }
  closeShowProducts() {
      this.setState({ showProducts: false });
  }

  groupDistrictColor() {
      const bills = this.props.bills[this.state.page] || [];
      let group = _.groupBy(bills, o => o.district_color.trim());
      group = Object.keys(group).map(o => ({ color: `#${o}`, qty: group[o].length }))
      return group;
  }

  getInstance(instance) {
    this.addBill = instance;
  }

  getSearchOptions() {
    return [
      {
        value: 'code',
        label: 'Mã'
      },
      {
        value: 'facebook',
        label: 'Facebook'
      },
      {
        value: 'phone',
        label: 'Số điện thoại'
      },
      {
        value: 'address',
        label: 'Địa chỉ'
      },
      {
        value: 'customer_name',
        label: 'Tên khách'
      },
      {
        value: 'note',
        label: 'Ghi chú'
      }
    ]
  }

  render() {
    const { user, total } = this.props;
    const { showForm,
        type,
        customer,
        billInfo,
        products,
        page,
        mode,
        idFilterStatus,
        searchOptionsValue,
        selectedBills,
        showChangeStatus,
        originBill,
        startDate,
        endDate,
        enableFilterDate,
        showProducts,
        closeShowProducts,
        products_info
    } = this.state;
    const bills = this.props.bills[page] || [];
    var options = [
  { value: 1 , label: 'Còn hàng' },
  { value: 0, label: 'Hết hàng' }
];
    return (
      <div className="row ng-scope">
      <Modal show={showProducts} onHide={this.closeShowProducts.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Sản phầm cần lấy hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <pre>{products_info}</pre>
          </Modal.Body>
    </Modal>
        <div className="">
        <p></p>
        <div>
          <Col md={3}>
          <Select
            name="form-field-name"
            options={this.getStatusOptions()}
            placeholder="Lọc theo trạng thái"
            searchable= {false}
            multi
            simpleValue
            onChange={this.onSelectStatus.bind(this)}
            value={idFilterStatus}
          />
          <p></p>
          </Col>
          <Col md={3}>
            <FormControl
            type="text"
            placeholder="Nhập mã đơn, tên, sdt hoặc facebook"
            onChange={this.onChangeSearchBill.bind(this)}
            />
            <p></p>
            <Select
            name="form-field-name"
            options={this.getSearchOptions()}
            placeholder="Tìm theo"
            searchable= {false}
            multi
            simpleValue
            onChange={this.onSelectSearchOPtions.bind(this)}
            value={searchOptionsValue}
            />
            <p></p>
          </Col>
          <Col md={3}>
            <Button bsStyle="primary" onClick={this.filterDuplicate.bind(this)}>
              Lọc đơn trùng
            </Button>
            &nbsp;
            <Button bsStyle="warning" onClick={this.clearAll.bind(this)} id="clear-all">
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
                getInstance={this.getInstance.bind(this)}
                products={products}
                changeProduct={this.changeProduct.bind(this)}
                page={page}
                mode={mode}
                reloadBilld={this.reloadBilld.bind(this)}
                originBill={originBill}
              />
            </div>
          </Col>
          <p className="clear-fix"></p>
        </div>
        <p className="clear-fix"></p>
        <p></p>
          <Panel header={<span>Danh sách đơn hàng </span>} >
            <div className="table-responsive bill-table">
            <div className="bill-tool">
              <Button onClick={this.selectAllBills.bind(this)} bsStyle="success">
                Chọn tất cả ({selectedBills.length})
              </Button>
              &nbsp;
              <Button onClick={this.unSelectAllBills.bind(this)} bsStyle="danger">
                Bỏ chọn tất cả
              </Button>
              &nbsp;
              <Button onClick={this.openChangeStatus.bind(this)} bsStyle="primary">
                Đổi trạng thái đơn đã chọn
              </Button>
              &nbsp;
              {
                user.role < 3 ?
                <Button onClick={this.exportToEXcel.bind(this)} bsStyle="primary">
                  Xuất ra file excel
                </Button>
                : null
              }
              &nbsp;
              {
                user.role < 3 ?
                <Button onClick={this.exportGhn.bind(this)} bsStyle="primary">
                  Xuất file ghn
                </Button>
                : null
              }
              &nbsp;
              <Button onClick={this.exportProducts.bind(this)} bsStyle="primary">
                Xuất file lấy hàng
              </Button>
              &nbsp;
              {
                user.role < 3 ?
                <Button  bsStyle="primary" onClick={this.updateByExcel.bind(this)}>
                  Cập nhật bằng file excel
                </Button>
                : null
              }
              &nbsp;
              <input type="file" className="hide" id="excel-up" onChange={this.onFileChange.bind(this)} />
              <p></p>
            </div>
            <DatePicker
              startDate={startDate}
              endDate={endDate}
              handleChangeStart={this.handleChangeStart}
              handleChangeEnd={this.handleChangeEnd}
              enable={enableFilterDate}
              onChange={this.onChangeFilterDate}
            />
            <div className="text-center pagination-block">
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
                <div className="group-color">
                    {
                        this.groupDistrictColor().map((group) => {
                            return (<span style={{ color: group.color }}>{ group.qty }&nbsp;</span>)
                        })
                    }
                </div>
            </div>
              <table className="table table-striped table-bordered table-hover bill-table">
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
                      const selected = !!selectedBills.find(o => o.id === bill.id);
                      return (
                        <tr key={bill.id} className={className({ selected: selected })}>
                          <td className="pointer" onClick={this.selectBill.bind(this, bill)}>
                            <Checkbox checked={selected} >
                              <span>#{bill.id}</span>
                            </Checkbox>
                            <Button className="btn-bill-edit" bsStyle="info" bsSize="xs" active onClick={this.open.bind(this, 'edit', bill.id)}>
                              Chỉnh sửa
                            </Button>
                            &nbsp;
                            {
                              user.role == 1 || user.role == 2 ?
                              <Button className="btn-bill-edit" bsStyle="danger" bsSize="xs" active onClick={this.deleteBill.bind(this, bill.id)}>
                                Xóa
                              </Button>
                              : null
                            }
                          </td>
                          <td>
                            {bill.code}
                            {
                              bill.real_shipping > 0 ?
                              <p title={bill.real_shipping}><i className="fa fa-usd pointer" aria-hidden="true"></i></p>
                              : null
                            }
                          </td>
                          <td>
                          {bill.user_name}
                          <p className="text-info">{moment(bill.create_at, 'x').format('HH:mm DD/MM/YYYY')}</p>
                          </td>
                          <td>
                            <span style={{color: bill.color}}>{bill.status}</span>
                            <div>
                              <Button bsStyle="info" bsSize="xs" active onClick={this.openChangeStatus.bind(this, bill)}>
                                Đổi trạng thái
                              </Button>
                              &nbsp;
                            </div>
                            {
                              bill.duplicate == 2 ?
                              <p className="duplicate" onClick={this.notDuplicate.bind(this, bill.id)}>trùng ({bill.phone})</p>
                              : null
                            }
                            {
                              bill.duplicate == 1 ?
                              <p className="not-duplicate" onClick={this.duplicate.bind(this, bill.id)}>đã kiểm tra</p>
                              : null
                            }
                          </td>
                          <td>{bill.facebook} </td>
                          <td>
                            {bill.customer_name}
                            <p style={{color: '#337ab7'}}><NumberFormat value={bill.district_shipping} displayType={'text'} thousandSeparator={true}/></p>
                            <p style={{color: '#337ab7'}}>{bill.shipping_time}</p>
                          </td>
                          <td>{bill.phone} </td>
                          <td>
                            {bill.products_info}
                          </td>
                          <td>
                          {bill.address}
                          {
                              _.trim(bill._ward) ?
                              <p style={{color: `#${bill.district_color || '8EC13E'}`}}>{bill._ward}</p>
                              : null
                          }
                          {
                              _.trim(bill._district) ?
                              <p style={{color: `#${bill.district_color || '8EC13E'}`}}>{bill._district}</p>
                              : null
                          }
                          {
                              _.trim(bill._district) ?
                              <p style={{color: `#${bill.district_color || '8EC13E'}`}}>{bill._province}</p>
                              : null
                          }
                          </td>
                          <td><NumberFormat value={bill.pay} displayType={'text'} thousandSeparator={true}/></td>
                          <td>{bill.note}</td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
              <div className="text-center">
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
              </div>
            </div>
          </Panel>
        </div>
        <Modal show={showChangeStatus} onHide={this.closeChangeStatus.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Đổi trạng thái</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Select
              name="form-field-name"
              options={this.getStatusOptions()}
              placeholder="Trạng thái"
              searchable= {false}
              clearable={false}
              onChange={this.onChangeChangeStatus.bind(this)}
            />
          </Modal.Body>
      </Modal>
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
