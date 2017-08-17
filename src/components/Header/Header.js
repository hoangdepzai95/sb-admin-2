import React, { Component } from 'react';
import {
  NavDropdown,
  MenuItem,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import Navbar, {Brand} from 'react-bootstrap/lib/Navbar';
import $ from "jquery";
import Sidebar from '../Sidebar';
import { getUser } from '../../router/util';


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
  render() {
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

export default connect()(Header);
