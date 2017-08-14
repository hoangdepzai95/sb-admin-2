import pool from '../db';

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  pool.getConnection(function(err, con) {
    con.query(`SELECT * FROM product`, function (error, results) {
    if (error) {
      res.status(400).send('Error');
    }else{
      res.status(200).json(results);
    }
    });
  });
})

router.post('/', (req, res) => {
  const product = req.body;
  pool.getConnection(function(err, con) {
    con.query('INSERT INTO product SET ?', product, function (error, results) {
    if (error) {
      res.status(400).send('Error');
    }else{
      con.query(`SELECT * FROM product WHERE id='${results.insertId}'`, function (error, results) {
      if (error) {
        res.status(400).send('Error');
      }else{
        res.status(200).json(results[0]);
      }
      });
    }
    });
  });
});

router.put('/', (req, res) => {
  const product = req.body;
  pool.getConnection(function(err, con) {
    con.query('UPDATE product SET ? WHERE ?', [product, { id: product.id }], function (error, results) {
    if (error) {
      res.status(400).send('Error');
    }else{
      con.query(`SELECT * FROM product WHERE id='${product.id}'`, function (error, results) {
      if (error) {
        res.status(400).send('Error');
      }else{
        res.status(200).json(results[0]);
      }
      });
    }
    });
  });
});


router.delete('/:id', (req, res) => {
  const id = req.params.id;
  pool.getConnection(function(err, con) {
    con.query(`DELETE FROM product WHERE id='${id}'`, function (error, results) {
    if (error) {
      res.status(400).send('Error');
    }else{
      res.status(200).send('Ok');
    }
    });
  });
})

module.exports = router;
