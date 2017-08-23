import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { HOST, PER_PAGE } from '../../config';
import { receiveChangelog, addNotify } from '../../actions/fetchData';

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
  componentWillReceiveProps(nextProps) {
    if (nextProps.user.userId && !this.props.user.userId) {
      this.getChangelog();
      setInterval(this.getChangelog.bind(this), 10000);
    }
  }
  getChangelog() {
    axios.get('/auth/bill/changelog')
     .then(
       (res) => {
         const changes = this.compareChangelog(res.data, this.props.changelog);
         if (changes.length) {
           this.props.dispatch(receiveChangelog(res.data));
           this.props.dispatch(addNotify(this.parseChangelog(changes)));
         }
       },
       (error) => {

       },
     );
  }
  compareChangelog(newChangelog, changelog) {
    return newChangelog.filter(o => _.every(changelog, e => e.id != o.id));
  }
  parseChangelog(changelog) {
    const clone = _.cloneDeep(changelog);
    return clone.map((log) => {
      log.create_at = moment(log.create_at, 'x').format('HH:mm DD/MM/YYYY');
      log.content = JSON.parse(log.content);
      log.content.data = log.content.data.map((item) => {
        item.name = this.formatChange(item.field);
        return item;
      }).filter(o => o.name);
      return log;
    })
  }
  formatChange(field) {
    switch (field) {
      case 'code':
        return 'Mã';
      case 'status_id':
        return 'Trạng thái';
      case 'customer_id':
        return 'Khách hàng';
      case 'products_info':
        return 'Sản phẩm';
      case 'address':
        return 'Địa chỉ';
      case 'note':
        return 'Ghi chú';
      case 'pay':
        return 'Tổng thu';
      case 'shipping':
        return 'Phí ship';
      case 'decrease':
        return 'Giảm giá';
      default:
        return null;
    }
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
            {
              user.role < 3 ?
              <li title="Thống kê">
                <Link to="/home/statistic">
                  <i className="fa fa-bar-chart" />
                </Link>
              </li>
              : null
            }
            <li title="Lịch sử thay đổi">
              <Link to="/home/changelog">
                <i className="fa fa-sticky-note-o" />
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
    changelog: state.data.changelog,
  };
})(Sidebar);
