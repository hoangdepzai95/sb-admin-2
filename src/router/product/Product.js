import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { Button, Modal, FormControl, Form, FormGroup, Col, ControlLabel, FieldGroup } from 'react-bootstrap';

import { HOST, PER_PAGE } from '../../config';

export default class Product extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.products != this.props.products;
  }
  render() {
    const {  parent, products, removeProduct, open, user } = this.props;
    return (
      <tbody>
      {
        products.map((product, index) => {
          return (
            <tr key={product.id}>
              <td>{index + 1} </td>
              <td>
               {
                 product.image ?
                 <img src={`${HOST}/images/${product.image}`} className="product-image" />
                 : null
               }
               {product.name}
              </td>
              <td>{product.code} </td>
              <td>{product.quantity} </td>
              <td><NumberFormat value={product.price} displayType={'text'} thousandSeparator={true}/></td>
              {
                user.role == 1 ?
                <td><NumberFormat value={product.real_price} displayType={'text'} thousandSeparator={true}/></td>
                : null
              }
              <td><NumberFormat value={product.real_price_2} displayType={'text'} thousandSeparator={true}/></td>

              <td>{product.category}</td>
              <td>
                {
                  product.instock == 1 ?
                    <Button bsStyle="success" bsSize="xs"> Còn hàng</Button>
                    :
                    <Button bsStyle="danger" bsSize="xs"> Hết hàng</Button>
                }
              </td>
              {
                user.role < 3 ?
                <td>
                  <Button bsStyle="danger" bsSize="xs" active onClick={removeProduct.bind(parent, product.id)}>
                    Xóa
                  </Button>
                  &nbsp;
                  <Button bsStyle="info" bsSize="xs" active onClick={open.bind(parent, 'edit', product.id)}>
                    Chỉnh sửa
                  </Button>
                </td>
                : null
              }
            </tr>
          );
        })
      }
      </tbody>
    );
  }
}
