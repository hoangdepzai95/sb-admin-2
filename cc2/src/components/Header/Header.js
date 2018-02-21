import React, { Component } from 'react';
import {
  NavDropdown,
  MenuItem,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar, {Brand} from 'react-bootstrap/lib/Navbar';
import $ from "jquery";
import Sidebar from '../Sidebar';
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import className from 'classnames';
import { getUser } from '../../router/util';
import { checkNotify, receiveNotify, receiveStatus } from '../../actions/fetchData';


class Header extends Component {
  componentDidMount() {
    const { status} = this.props;
    getUser(this.props.dispatch);

    if (!status.length) {
     this.getStatus();
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
  toggleMenu = () => {
      if($(".navbar-collapse").hasClass('collapse')){
        $(".navbar-collapse").removeClass('collapse');
      }
      else{
        $(".navbar-collapse").addClass('collapse');
      }
  }
  logOut = () => {
    localStorage.removeItem('access_token');
    this.props.history.push('/login');
  }
  openChangelog(id) {
    const { user, notify } = this.props;
    this.props.dispatch(checkNotify(id));
    window.open(`/home/changelog?id=${id}`);
    this.checkNotify(id);
  }
  checkNotify(id) {
    const { user, notify } = this.props;
    axios.put('/auth/bill/check_changelog', {
      user_id: user.userId,
      id,
    })
     .then(
       (res) => {
         const data = notify.map((o) => {
           if (o.id == id) {
             o.checked = res.data.checked;
           }
           return o;
         })
         this.props.dispatch(receiveNotify(data));
       },
       (error) => {

       },
     )
  }
  isChecked(user_id, item) {
    return !!(item.checked || '').split(',').find(o => o == user_id);
  }
  formatNotify(notify, user_id) {
    return notify.map((o) => {
      o.isChecked = this.isChecked(user_id, o);
      return o;
    });
  }
  checkAll() {
    const { user } = this.props;
    const notify = this.formatNotify(this.props.notify, user.userId);
    notify.forEach((o, index) => {
      if (!o.isChecked) {
        setTimeout(() => {
          this.checkNotify(o.id);
        }, index * 100);
      }
    })
  }
  render() {
    const { user } = this.props;
    const notify = this.formatNotify(this.props.notify, user.userId);
    return (
      <div id="wrapper" className="content">
        <Navbar fluid={true}  style={ {margin: 0} }>
            <Brand>
              <span>
                <span>&nbsp;Quản lý đơn hàng</span>
                  <button type="button" className="navbar-toggle" onClick={this.toggleMenu} style={{position: 'absolute', right: 0, top: 0}}>
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
              </span>
            </Brand>
            <ul className="nav navbar-top-links navbar-right">
            <span className="notify">
              <NavDropdown title={<i className="fa fa-bell fa-fw"></i>} id = 'navDropdown3' noCaret>
                    {
                      notify.map((item, index) => {
                        return (
                          <div key={index} onClick={this.openChangelog.bind(this, item.id)} className={className({checked: item.isChecked })} >
                            <MenuItem eventKey="1" style={ {width: 300} }>
                                {item.content.user} sửa đơn #{item.bill_id} lúc {item.create_at.split(' ')[0]}
                            </MenuItem>
                            <MenuItem divider />
                          </div>
                        )
                      })
                    }
                </NavDropdown>
                <span className="notify-qty" onClick={this.checkAll.bind(this)}>{notify.filter(o => !o.isChecked).length}</span>
              </span>
             <NavDropdown title={<i className="fa fa-user fa-fw"></i> } id = 'navDropdown4'>
                    <MenuItem eventKey = "4" onClick = {this.logOut}>
                      <span> <i className = "fa fa-sign-out fa-fw" /> Đăng xuất </span>
                    </MenuItem>
              </NavDropdown>

            </ul>
            <Sidebar />
      </Navbar>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    notify: state.data.notify,
    user: state.data.user,
    status: state.data.status,
  };
})(Header);
