const pool = require('../db');

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  const phone = req.query.phone;
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query(`SELECT * FROM customer WHERE phone='${phone}'`, (error, result) => {
      if (error) {
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
  const customer = {
    phone: req.body.phone,
    name: req.body.name,
    facebook: req.body.facebook,
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
