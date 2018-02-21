import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Button, Modal, FormControl, Form, FormGroup, Col, ControlLabel, FieldGroup } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

export default class Picker extends Component {
  render() {
    const { startDate, endDate, handleChangeStart, handleChangeEnd, onProcess } = this.props;
    return (
      <div>
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
         <Button bsStyle="success" onClick={onProcess}> Thống kê</Button>
      </Col>
      <p className="clear-fix"></p>
    </div>
    );
  }
}
