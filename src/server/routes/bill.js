import pool from '../db';

const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
  const bill = {
    user_id: req.body.user_id,
    customer_id: req.body.customer_id,
    shipping: req.body.shipping,
    note: req.body.note,
    status_id: req.body.status_id,
    pay: req.body.pay,
    create_at: (new Date()).valueOf(),
  };

  const bill_detail = req.body.bill_detail;
  const con = await pool.getConnection;
  const insertBill = await con.query('INSERT INTO bill (product_id) ?', bill);
  console.log(insertBill);
  // const insertBillDetail = con.query('INSERT INTO bill_detail SET ?', bill);
});

module.exports = router;
