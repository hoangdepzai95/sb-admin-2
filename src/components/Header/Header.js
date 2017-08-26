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
import className from 'classnames';
import { getUser } from '../../router/util';
import { checkNotify } from '../../actions/fetchData';


class Header extends Component {
  componentDidMount() {
    getUser(this.props.dispatch);
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
    this.props.dispatch(checkNotify(id));
    window.open('/home/changelog');
  }
  render() {
    const { notify } = this.props;
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
            <NavDropdown title={<i className="fa fa-bell fa-fw"></i>} id = 'navDropdown3'>
                  {
                    notify.reverse().map((item, index) => {
                      return (
                        <div key={index} onClick={this.openChangelog.bind(this, item.id)} className={className({checked: true })} >
                          <MenuItem eventKey="1" style={ {width: 300} }>
                              {item.content.user} sửa đơn #{item.bill_id} lúc {item.create_at.split(' ')[0]}
                          </MenuItem>
                          <MenuItem divider />
                        </div>
                      )
                    })
                  }
                </NavDropdown>
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
  };
})(Header);
