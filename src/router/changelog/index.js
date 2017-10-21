import React, { Component } from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import { Button, Modal, FormControl, Checkbox } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import className from 'classnames';
import _ from 'lodash';


class Changelog extends Component {
  parseChangelog(changelog) {
    const { status } = this.props;
    const clone = _.cloneDeep(changelog);
    return clone.map((log) => {
      log.create_at = moment(log.create_at, 'x').format('HH:mm DD/MM/YYYY');
      log.content = JSON.parse(log.content);
      log.content.data = log.content.data.map((item) => {
        if (item.field === 'status_id' || item.field === 'status') {
          item.origin = (status.find(o => o.id == item.origin) || {}).name || item.origin;
          item.changeto = (status.find(o => o.id == item.changeto) || {}).name || item.changeto;
        }
        item.name = this.formatChange(item.field);
        return item;
      }).filter(o => o.name);
      return log;
    })
  }
  getQueryStringValue (key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  }
  formatChange(field) {
    switch (field) {
      case 'code':
        return 'Mã';
      case 'status_id':
      case 'status':
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
      case 'facebook':
        return 'facebook';
      case 'customer_name':
        return 'Tên khách hàng';
      case 'province':
        return 'Tỉnh/Thành phố';
     case 'district':
        return 'Quận/Huyện';
      default:
        return null;
    }
  }
  openBill(id) {
    window.open(`/home/bill?id=${id}`);
  }
  render() {
    const { changelog } = this.props;
    const selected = this.getQueryStringValue('id');
    return (
      <div className="row ng-scope">
        <div className="">
        <p></p>
          <Panel header={<span>Lịch sử thay đổi</span>} >
            <div className="table-responsive changelog">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Thời gian </th>
                    <th>Đơn hàng</th>
                    <th>Nhân viên thay đổi</th>
                    <th> Nội dung</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.parseChangelog(changelog).map((item, index) => {
                      return (
                        <tr key={item.id} onClick={this.openBill.bind(this, item.bill_id)} className={className({selected: item.id == selected})}>
                          <td>{item.create_at} </td>
                          <td>#{item.bill_id}</td>
                          <td>{item.content.user}</td>
                          <td>
                           {
                             item.content.data.map((change, index) => {
                               return (
                                 <p key={index}>{change.name}: <span className="text-danger">{change.origin}</span> thành <span className="text-success">{change.changeto}</span></p>
                               )
                             })
                           }
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>
    );
  }
}
export default connect((state) => {
  return {
    changelog: state.data.changelog,
    status: state.data.status,
  }
})(Changelog);
