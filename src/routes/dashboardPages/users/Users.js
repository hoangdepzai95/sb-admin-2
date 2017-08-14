import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import Panel from 'react-bootstrap/lib/Panel';
import { Button, Modal, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';

import Pagination from 'react-bootstrap/lib/Pagination';
import { receiveUsers } from '../../../actions/fetchData';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      name: '',
      username: '',
      password: '',
    };
  }
  componentDidMount() {
    const { loaded } = this.props;
    if (!loaded) {
      axios.get('/auth/user/users', ).then(
        (res) => {
          this.props.dispatch(receiveUsers(res.data));
        }
      )
    }
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
  addUser(e) {
    e.preventDefault();
    const { name, username, password } = this.state;
    if (
      name.length < 1 ||
      username.length < 1 ||
      password.length < 1
    ) return;
    axios.post('/auth/user/create', {
      username,
      password,
      full_name: name,
      role: 2,
    })
      .then(
        (res) => {
          this.close();
          this.props.dispatch(receiveUsers([...this.props.users, res.data]));
        },
        (err) => {
          alert('Có lỗi xảy ra hoặc tài khoản đã được sử dụng');
        }
      )
  }
  removeUser(id) {
    if (confirm('Bạn có chắc chắn ?')) {
      axios.delete(`/auth/user/${id}`)
      .then(
        (res) => {
          this.props.dispatch(receiveUsers(this.props.users.filter(user => user.id != id)));
        },
        (err) => {
          alert('Co loi xay ra');
        }
      )
    }
  }
  render() {
    const { users, user } = this.props;
    const { showForm, name, username, password } = this.state;
    if (user.role != 1) return null;
    return (
      <div className="row ng-scope">
        <div className="">
          <Panel header={<span>Danh sách nhân viên </span>} >
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th># </th>
                    <th>Họ tên </th>
                    <th>Tên đăng nhập</th>
                    <th>Thao tác </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    users.map((user, index) => {
                      return (
                        <tr key={user.id}>
                          <td>{index} </td>
                          <td>{user.full_name} </td>
                          <td>{user.username} </td>
                          <td>
                            <Button bsStyle="danger" bsSize="xs" active onClick={this.removeUser.bind(this, user.id)}>
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
          <Button bsStyle="success" bsSize="large" active onClick={this.open.bind(this)}>
            Thêm nhân viên
          </Button>
          <Modal show={showForm} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm nhân viên</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form role="form" onSubmit={this.addUser.bind(this)}>
                <fieldset>
                <div className="form-group">
                  <FormControl
                    className="form-control"
                    placeholder="Họ tên"
                    type="text"
                    name="password"
                    value={name}
                    onChange={this.onChange.bind(this, 'name')}
                  />
                </div>
                <div className="form-group">
                  <FormControl
                    type="text"
                    className="form-control"
                    placeholder="Tên đăng nhập"
                    onChange={this.onChange.bind(this, 'username')}
                    value={username}
                  />
                </div>

                <div className="form-group">
                  <FormControl
                    className="form-control"
                    placeholder="Mật khẩu"
                    type="text"
                    value={password}
                    onChange={this.onChange.bind(this, 'password')}
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
    loaded: state.data.home.loaded,
    users: state.data.home.data.filter(user => user.role != 1),
    user: state.data.user,
  };
})(Home);
