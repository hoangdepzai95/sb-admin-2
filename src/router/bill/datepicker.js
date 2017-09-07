import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Button, Modal, FormControl, Form, FormGroup, Col, ControlLabel, FieldGroup } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import Switch from 'rc-switch';

export default class Picker extends Component {
  render() {
    const { startDate, endDate, handleChangeStart, handleChangeEnd, onChange, enable } = this.props;
    return (
      <div className="bill-date-pick">
        <Col md={2} >
        Từ 0 giờ sáng ngày:
        </Col>
        <Col md={2}>
          <DatePicker
            selected={startDate}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            onChange={handleChangeStart}
          />
      </Col>
      <Col md={2} >
      Đến 0 giờ sáng ngày:
      </Col>
      <Col md={2}>
        <DatePicker
          selected={endDate}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          onChange={handleChangeEnd}
        />
      </Col>
      <Col md={4}>
         <Switch checked={enable} onChange={onChange} />
      </Col>
      <p className="clear-fix"></p>
    </div>
    );
  }
}
