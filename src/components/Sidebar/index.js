import React, { Component } from 'react';
import classNames from 'classnames';
import history from '../../core/history';

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
    return (
      <div className="navbar-default sidebar" style={{ marginLeft: '-20px' }} role="navigation">
        <div className="sidebar-nav navbar-collapse collapse">
          <ul className="nav in" id="side-menu">
            <li>
              <a href="" onClick={(e) => { e.preventDefault(); history.push('/'); }} >
                <i className="fa fa-dashboard fa-fw" /> &nbsp;Quản lí nhân viên
              </a>
            </li>


            <li>
              <a href="" onClick={(e) => { e.preventDefault(); history.push('/table'); }} >
                <i className="fa fa-table fa-fw" /> &nbsp;Kho hàng
              </a>
            </li>

            <li>
              <a href="" onClick={(e) => { e.preventDefault(); history.push('/forms'); }} >
                <i className="fa fa-table fa-fw" /> &nbsp;Đơn hàng
              </a>
            </li>

            <li>
              <a href="" onClick={(e) => { e.preventDefault(); history.push('/forms'); }} >
                <i className="fa fa-table fa-fw" /> &nbsp;Khách hàng
              </a>
            </li>
            <li>
              <a href="" onClick={(e) => { e.preventDefault(); history.push('/forms'); }} >
                <i className="fa fa-table fa-fw" /> &nbsp;Thống kê
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}


export default Sidebar;
