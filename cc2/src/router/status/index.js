import React, { Component } from 'react';
import axios from 'axios';
import Panel from 'react-bootstrap/lib/Panel';
import { Button, Modal, FormControl, Checkbox } from 'react-bootstrap';
import 'rc-color-picker/assets/index.css';
import { connect } from 'react-redux';
import Select from 'react-select';
import ColorPicker from 'rc-color-picker';
import _ from 'lodash';

import { receiveStatus } from '../../actions/fetchData';

class Status extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      name: '',
    };
    this.onChangeColor = _.debounce(this.onChangeColor, 500);
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
  open() {
    this.setState({
      showForm: true,
    });
  }
  close() {
    this.setState({
      showForm: false,
    });
  }
  onChange(type, e) {
    const value = e.target.value;
    if (value.length > 15 && type != 'name') return;
    this.setState({
      [type]: value,
    });
  }
  addStatus(e) {
    e.preventDefault();
    const { name } = this.state;
    if (name.length < 1) return;
    axios.post('/auth/bill/status', {
      name,
    })
      .then(
        (res) => {
          this.close();
          this.props.dispatch(receiveStatus([...this.props.status, res.data]));
        },
        (err) => {
          window.alert('Có lỗi xảy ra hoặc tài khoản đã được sử dụng');
        }
      )
  }
  removeStatus(id) {
    if (window.confirm('Bạn có chắc chắn ?')) {
      axios.delete(`/auth/bill/status/${id}`)
      .then(
        (res) => {
          this.props.dispatch(receiveStatus(this.props.status.filter(item => item.id != id)));
        },
        (err) => {
          window.alert('Co loi xay ra');
        }
      )
    }
  }
  onChangeColor(id, v) {
    axios.put('/auth/bill/status', {
      color: v.color,
      id
    })
    .then(
      (res) => {
        const status = this.props.status.map((item) => {
          if (item.id === id) item.color = v.color;
          return item;
        });
        this.props.dispatch(receiveStatus(status));
      }
    );
  }
  showNotify(item) {
    const showNotify = item.show_notify == 1 ? 0 : 1;
    axios.put(`/auth/bill/status/show_notify?id=${item.id}&show=${showNotify}`)
     .then(
       (res) => {
         const status = this.props.status.map((o) => {
           if (o.id == item.id) o.show_notify = showNotify;
           return o;
         });
         this.props.dispatch(receiveStatus(status));
       },
       (error) => {
         window.alert('Co loi xay ra');
       },
     )
  }
  render() {
    const { status, user } = this.props;
    const { showForm, name  } = this.state;
    if (user.role != 1) return null;
    return (
      <div className="row ng-scope">
        <div className="">
        <p></p>
        <div className="text-right">
        <Button bsStyle="success" active onClick={this.open.bind(this)}>
          Thêm trạng thái
        </Button>
        </div>
        <p></p>
          <Panel header={<span>Danh trạng thái </span>} >
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>ID </th>
                    <th>Tên Trạng thái </th>
                    <th>Màu sắc</th>
                    <th>Hiện thông báo</th>
                    <th>Thao tác </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    status.map((item, index) => {
                      return (
                        <tr key={item.id}>
                          <td>{item.id} </td>
                          <td>{item.name} </td>
                          <td>
                            <ColorPicker
                              animation="slide-up"
                              color={item.color || '#FFF'}
                              onChange={this.onChangeColor.bind(this, item.id)}
                            />
                          </td>
                          <td>
                            <Checkbox checked={item.show_notify == 1} onChange={this.showNotify.bind(this, item)} >
                            </Checkbox>
                          </td>
                          <td>
                            <Button bsStyle="danger" bsSize="xs" active onClick={this.removeStatus.bind(this, item.id)}>
                              Xóa
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </Panel>
          <Modal show={showForm} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm trạng thái</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form role="form" onSubmit={this.addStatus.bind(this)}>
                <fieldset>
                <div className="form-group">
                  <FormControl
                    className="form-control"
                    placeholder="Tên trạng thái"
                    type="text"
                    value={name}
                    onChange={this.onChange.bind(this, 'name')}
                  />
                </div>
                <Button type="submit" bsSize="large" bsStyle="success" block>Thêm mới</Button>
              </fieldset>
            </form>
          </Modal.Body>
        </Modal>
        </div>
      </div>
    );
  }
}
export default connect((state) => {
  return {
    status: state.data.status,
    user: state.data.user,
  };
})(Status);
