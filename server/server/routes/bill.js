const pool = require('../db');
const _ = require('lodash');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  const page = req.query.page;
  const perPage = req.query.per_page;
  const offset = (page - 1) * perPage;
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query(`
            SELECT b.*, product.name AS product_name, bill_detail.quantity,
            customer.name as customer_name, customer.phone, customer.facebook, status.name as status
            FROM (SELECT * FROM bill ORDER BY id DESC LIMIT ${perPage}  OFFSET ${offset} ) as b
            INNER JOIN customer ON b.customer_id = customer.id
            INNER JOIN status ON b.status_id = status.id
            INNER JOIN (bill_detail INNER JOIN product ON bill_detail.product_id = product.id) ON b.id = bill_detail.bill_id
            `, (error, result) => {
      if (error) {
        res.status(400).send('Error');
        con.release();
      } else {
        const billGroup = _.groupBy(result, 'id');
        let rs = [];
        for ( let billId in billGroup) {
          const bill = billGroup[billId][0];
          bill.products = billGroup[billId].map((o) => {
            return { name: o.product_name, quantity: o.quantity };
          });
          bill.products_info = bill.products.map(product => `${product.name}(${product.quantity})`).join(', ');
          rs.unshift(bill);
        }
        res.status(200).json(rs);
        con.release();
      }
    });
  });
});

router.get('/total', (req, res) => {
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query(`SELECT COUNT(*) FROM bill`, (error, result) => {
      if (error) {
        res.status(400).send('Error');
        con.release();
      } else {
        res.status(200).json({ quantity: result[0]['COUNT(*)'] });
        con.release();
      }
    });
  });
})

router.get('/product/:billId', (req, res) => {
  console.log(req.params.billId);
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query(`
        SELECT product.*, bill_detail.quantity
        FROM bill
        INNER JOIN (bill_detail INNER JOIN product ON bill_detail.product_id = product.id) ON bill.id = bill_detail.bill_id
        WHERE bill.id='${req.params.billId}'
        `, (error, result) => {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
        con.release();
      } else {
        res.status(200).json(result);
        con.release();
      }
    });
  });
})

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
router.put('/', (req, res) => {
  const bill = req.body.bill_info;
  pool.getConnection(function(err, con) {
    if (err) return res.status(400).send('Error');
    con.query('UPDATE bill SET ? WHERE ?', [bill, { id: bill.id }], function (error, result) {
    if (error) {
      res.status(400).send('Error');
      con.release();
    }else{
      con.query(`DELETE FROM bill_detail WHERE bill_id='${bill.id}'`, function (error, results) {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
      }else{
        let products = req.body.products;
        products = products.map((product) => {
          return [product.product_id, product.quantity, bill.id];
        })
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
    }
    });
  });
});

module.exports = router;
