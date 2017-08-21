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
              <li title="Quản lí nhân viên">
                <Link to="/home/users">
                  <i className="fa fa-users" />
                </Link>
              </li>
              :
              null
            }
            {
              user.role == 1 ?
              <li title="Trạng thái đơn hàng">
                <Link to="/home/status">
                  <i className="fa fa-yelp" />
                </Link>
              </li>
              :
              null
            }
            {
              user.role == 1 ?
              <li title="Quản lí nhóm hàng">
                <Link to="/home/category">
                  <i className="fa fa-object-group" />
                </Link>
              </li>
              :
              null
            }
            <li title="Kho hàng">
              <Link to="/home/product">
                <i className="fa fa-table fa-fw" />
              </Link>
            </li>

            <li title="Đơn hàng">
              <Link to="/home/bill">
                <i className="fa fa-sticky-note-o" />
              </Link>
            </li>

            <li title="Khách hàng">
              <Link to="/home/customer">
                <i className="fa fa-address-book-o" />
              </Link>
            </li>
            <li title="Thống kê">
              <Link to="/home/chart">
                <i className="fa fa-bar-chart" />
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
