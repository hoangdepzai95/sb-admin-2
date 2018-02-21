import React, { Component } from 'react';
import axios from 'axios';
import Panel from 'react-bootstrap/lib/Panel';
import { Button, Modal, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import Select from 'react-select';

import { receiveUsers } from '../../actions/fetchData';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      name: '',
      username: '',
      password: '',
      role : 3,
      newPassword: '',
      showChangePass: false,
      userId: 0,
    };
  }
  componentDidMount() {
    axios.get('/auth/user/users', ).then(
      (res) => {
        this.props.dispatch(receiveUsers(res.data));
      }
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
  addUser(e) {
    e.preventDefault();
    const { name, username, password, role } = this.state;
    if (
      name.length < 1 ||
      username.length < 1 ||
      password.length < 1
    ) return;
    axios.post('/auth/user/create', {
      username,
      password,
      full_name: name,
      role,
    })
      .then(
        (res) => {
          this.close();
          this.props.dispatch(receiveUsers([...this.props.users, res.data]));
        },
        (err) => {
          window.alert('Có lỗi xảy ra hoặc tài khoản đã được sử dụng');
        }
      )
  }
  removeUser(id) {
    if (window.confirm('Bạn có chắc chắn ?')) {
      axios.delete(`/auth/user/${id}`)
      .then(
        (res) => {
          this.props.dispatch(receiveUsers(this.props.users.filter(user => user.id != id)));
        },
        (err) => {
          window.alert('Co loi xay ra');
        }
      )
    }
  }
  logChange(v) {
    this.setState({ role: v.value });
  }
  changePassword(e) {
    e.preventDefault();
    const { newPassword, userId } = this.state;
    axios.put(`auth/user/change_pass`, {
      password: newPassword,
      user_id: userId,
    }).then(
      (res) => {
        this.closeChangePass();
      },
      (error) => {
        window.alert('Co loi xay ra');
      },
    );
  }
  openChangePassword(userId) {
    this.setState({ showChangePass: true, userId });
  }
  closeChangePass() {
    this.setState({ showChangePass: false });
  }
  render() {
    const { users, user } = this.props;
    const { showForm, name, username, password, role, newPassword, showChangePass } = this.state;
    var options = [
  { value: 2 , label: 'Quản lí' },
  { value: 3, label: 'Nhân viên' }
];
    if (user.role != 1) return null;
    return (
      <div className="row ng-scope">
        <div className="">
        <p></p>
        <div className="text-right">
        <Button bsStyle="success" active onClick={this.open.bind(this)}>
          Thêm nhân viên
        </Button>
        </div>
        <p></p>
          <Panel header={<span>Danh sách nhân viên </span>} >
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th># </th>
                    <th>Họ tên </th>
                    <th>Tên đăng nhập</th>
                    <td>Chức vụ</td>
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
                          <td>{user.role == 1 ? 'Sếp Tổng' : user.role == 2 ? 'Quản lí' : user.role == 3 ? 'Nhân viên' : ''} </td>
                          <td>
                            <Button bsStyle="danger" bsSize="xs" active onClick={this.removeUser.bind(this, user.id)}>
                              Xóa
                            </Button>
                            &nbsp;
                            <Button bsStyle="info" bsSize="xs" active onClick={this.openChangePassword.bind(this, user.id)}>
                              Đổi mật khẩu
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
          <Modal show={showChangePass} onHide={this.closeChangePass.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Đổi mật khẩu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form role="form" onSubmit={this.changePassword.bind(this)}>
                <fieldset>
                <div className="form-group">
                  <FormControl
                    className="form-control"
                    placeholder="Mật khẩu"
                    type="text"
                    value={newPassword}
                    onChange={this.onChange.bind(this, 'newPassword')}
                  />
                </div>
                <Button type="submit" bsSize="large" bsStyle="success" block>Đổi mật khẩu</Button>
              </fieldset>
            </form>
          </Modal.Body>
        </Modal>
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
                <div className="form-group">
                <Select
                name="form-field-name"
                value={role}
                placeholder="Chức vụ"
                options={options}
                onChange={this.logChange.bind(this)}
                clearable={false}
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
    users: state.data.home.data,
    user: state.data.user,
  };
})(Home);
