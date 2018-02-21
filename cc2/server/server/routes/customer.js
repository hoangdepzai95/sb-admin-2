const pool = require('../db');
const moment = require('moment');
const _ = require('lodash');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  const phone = req.query.phone;
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query(`SELECT customer.*, COUNT(bill.id) AS bills FROM customer INNER JOIN bill ON bill.customer_id = customer.id WHERE phone='${phone}'`, (error, result) => {
      if (error) {
        res.status(400).send('Error');
        con.release();
      } else {
        if (result[0] && !result[0].id) {
          res.status(200).json([]);
          con.release();
          return;
        }
        res.status(200).json(result);
        con.release();
      }
    });
  });
})

router.get('/statistic', (req, res) => {
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query(`
        SELECT * FROM customer
        WHERE customer.create_at >= ${req.query.start} AND customer.create_at <= ${req.query.end}`,
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(400).send('Error');
          con.release();
        } else {
          const by = req.query.by || 'day';
          let customers = result.map((customer) => {
            const createAt = moment(customer.create_at, 'x');
            customer.day = createAt.startOf('days').format('X');
            customer.week = createAt.startOf('weeks').format('X');
            customer.month = createAt.startOf('months').format('X');
            return customer;
          })
          customers = _.groupBy(customers, by);
          for (let key in customers) {
            customers[key] = customers[key].length;
          }
          res.status(200).json(customers);
          con.release();
        }
    });
  });
});

router.post('/', (req, res) => {
  const customer = {
    phone: req.body.phone,
    name: req.body.name,
    facebook: req.body.facebook,
    create_at: (new Date()).valueOf(),
  };
  pool.getConnection((err, con) => {
    if (err) return res.status(400).send('Error');
    con.query('INSERT INTO customer SET ?', customer, (error, result) => {
      if (error) {
        res.status(400).send('Error');
        con.release();
      } else {
        con.query(`SELECT * FROM customer WHERE phone='${customer.phone}'`, (error, result) => {
        if (error) {
          res.status(400).send('Error');
          con.release();
        } else {
          res.status(200).json(result[0]);
          con.release();
        }
        });
      }
    });
  });
});

module.exports = router;
