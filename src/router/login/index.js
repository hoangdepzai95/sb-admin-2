import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import { FormControl, Checkbox } from 'react-bootstrap';
import axios from 'axios';
import './Login.css';
import { getUser } from '../util';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      message: '',
    };
  }
  submitHandler(e) {
    const { username, password } = this.state;
    e.preventDefault();
    axios.post('login', {
      username,
      password,
    }).then((res) => {
      if (res.data.access_token) {
        localStorage.setItem('access_token', res.data.access_token);
        getUser(this.props.dispatch);
        this.props.history.push('/home/bill');
      }
    }, () => {
      alert('Sai thông tin');
    })
  }
  isValid(v) {
    return v.length < 16;
  }
  onChange(type, e) {
    if (!this.isValid(e.target.value)) return;
    this.setState({
      [type]: e.target.value,
    });
  }
  render() {
    const { username, password } = this.state;
    return (
    <div id="page-wrapper" className="page-wrapper no-margin">
      <div className="col-md-4 col-md-offset-4">
        <Panel header={<h3>Đăng nhập</h3>} className="login-panel">

          <form role="form" onSubmit={this.submitHandler.bind(this)}>
            <fieldset>
              <div className="form-group">
                <FormControl
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  name="name"
                  onChange={this.onChange.bind(this, 'username')}
                  value={username}
                />
              </div>

              <div className="form-group">
                <FormControl
                  className="form-control"
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.onChange.bind(this, 'password')}
                />
              </div>
              <Checkbox label="Remember Me" > Lưu trạng thái </Checkbox>
              <Button type="submit" bsSize="large" bsStyle="success" block>Đăng nhập</Button>
            </fieldset>
          </form>

        </Panel>

      </div>
    </div>
    );
  }
}

export default (connect()(Login));
