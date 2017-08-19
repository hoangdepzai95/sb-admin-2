const pool = require('../db');

const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  const bill = req.body.bill_info;
  bill.create_at = (new Date()).valueOf();
  bill.status_id = 1;
  pool.getConnection(function(err, con) {
    if (err) return res.status(400).send('Error');
    con.query('INSERT INTO bill SET ?', bill, function (error, result) {
    if (error) {
      res.status(400).send('Error');
      con.release();
    }else{
      let products = req.body.products;
      products = products.map((product) => {
        return [product.product_id, product.quantity, result.insertId];
      })
      console.log(products);
      con.query('INSERT INTO bill_detail (product_id, quantity, bill_id) VALUE ?', [products], function (error, results) {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
      }else{
        res.status(200).json(results);
        con.release();
      }
      });
    }
    });
  });
});

module.exports = router;
