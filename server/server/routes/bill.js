const pool = require('../db');

const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  const bill = req.body.bill_info;
  bill.create_at = (new Date()).valueOf();
  bill.status_id = 1;
  pool.getConnection(function(err, con) {
    if (err) return res.status(400).send('Error');
    con.query('INSERT INTO bill SET ?', bill, function (error, results) {
    if (error) {
      res.status(400).send('Error');
      con.release();
    }else{
      res.status(200).json(results);
      con.query('INSERT INTO bill SET ?', bill, function (error, results) {
      if (error) {
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
