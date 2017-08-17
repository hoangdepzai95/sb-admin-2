import React , { Component } from 'react';

export default class Blank extends Component {
  componentDidMount() {
    this.props.history.push('/home/bill');
  }
  render() {
    return null;
  }
}
