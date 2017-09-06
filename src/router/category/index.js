import React, { Component } from 'react';
import axios from 'axios';
import Panel from 'react-bootstrap/lib/Panel';
import { Button, Modal, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import Select from 'react-select';

import { receiveUsers, receiveCategory } from '../../actions/fetchData';

class Status extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      name: '',
    };
  }
  componentDidMount() {
    const { category } = this.props;
    this.getCategory();
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
    if (value.length > 35 && type != 'name') return;
    this.setState({
      [type]: value,
    });
  }
  addCategory(e) {
    e.preventDefault();
    const { name } = this.state;
    if (name.length < 1) return;
    axios.post('/auth/bill/category', {
      category: name,
    })
      .then(
        (res) => {
          this.close();
          this.props.dispatch(receiveCategory([...this.props.category, res.data]));
        },
        (err) => {
          window.alert('Có lỗi xảy ra hoặc tài khoản đã được sử dụng');
        }
      )
  }
  removeCategory(id) {
    if (window.confirm('Bạn có chắc chắn ?')) {
      axios.delete(`/auth/bill/category/${id}`)
      .then(
        (res) => {
          this.props.dispatch(receiveCategory(this.props.category.filter(item => item.id != id)));
        },
        (err) => {
          window.alert('Co loi xay ra');
        }
      )
    }
  }
  render() {
    const { category, user } = this.props;
    const { showForm, name  } = this.state;
    if (user.role != 1) return null;
    return (
      <div className="row ng-scope">
        <div className="">
        <p></p>
        <div className="text-right">
        <Button bsStyle="success" active onClick={this.open.bind(this)}>
          Thêm nhóm sản phẩm
        </Button>
        </div>
        <p></p>
          <Panel header={<span>Danh trạng thái </span>} >
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th># </th>
                    <th>Tên nhóm </th>
                    <th>Thao tác </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    category.map((item, index) => {
                      return (
                        <tr key={item.id}>
                          <td>{index + 1} </td>
                          <td>{item.category} </td>
                          <td>
                            <Button bsStyle="danger" bsSize="xs" active onClick={this.removeCategory.bind(this, item.id)}>
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
            <Modal.Title>Thêm nhóm sản phẩm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form role="form" onSubmit={this.addCategory.bind(this)}>
                <fieldset>
                <div className="form-group">
                  <FormControl
                    className="form-control"
                    placeholder="Tên nhóm"
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
    category: state.data.category,
    user: state.data.user,
  };
})(Status);
