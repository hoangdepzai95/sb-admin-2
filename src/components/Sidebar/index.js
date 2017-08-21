import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uiElementsCollapsed: true,
      chartsElementsCollapsed: true,
      multiLevelDropdownCollapsed: true,
      thirdLevelDropdownCollapsed: true,
      samplePagesCollapsed: true,
    };
  }

  render() {
    const { user } = this.props;
    return (
      <div className="navbar-default sidebar" style={{ marginLeft: '-20px' }} role="navigation">
        <div className="sidebar-nav navbar-collapse collapse">
          <ul className="nav in" id="side-menu">
            {
              user.role == 1 ?
              <li>
                <Link to="/home/users">
                  <i className="fa fa-users" /> &nbsp;Quản lí nhân viên
                </Link>
              </li>
              :
              null
            }
            {
              user.role == 1 ?
              <li>
                <Link to="/home/status">
                  <i className="fa fa-yelp" /> &nbsp;Trạng thái đơn hàng
                </Link>
              </li>
              :
              null
            }
            {
              user.role == 1 ?
              <li>
                <Link to="/home/category">
                  <i className="fa fa-object-group" /> &nbsp;Quản lí nhóm hàng
                </Link>
              </li>
              :
              null
            }
            <li>
              <Link to="/home/product">
                <i className="fa fa-table fa-fw" /> &nbsp;Kho hàng
              </Link>
            </li>

            <li>
              <Link to="/home/bill">
                <i className="fa fa-sticky-note-o" /> &nbsp;Đơn hàng
              </Link>
            </li>

            <li>
              <Link to="/home/customer">
                <i className="fa fa-address-book-o" /> &nbsp;Khách hàng
              </Link>
            </li>
            <li>
              <Link to="/home/chart">
                <i className="fa fa-bar-chart" /> &nbsp;Thống kê
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}


export default connect((state) => {
  return {
    user: state.data.user,
  };
})(Sidebar);
