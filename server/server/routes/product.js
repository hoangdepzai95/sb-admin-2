const pool = require('../db');

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  pool.getConnection(function(err, con) {
    if (err) return res.status(400).send('Error');
    con.query(`SELECT * FROM product`, function (error, results) {
    if (error) {
      res.status(400).send('Error');
      con.release();
    }else{
      res.status(200).json(results);
      con.release();
    }
    });
  });
})
router.get('/search', (req, res) => {
  const keyword = req.query.q;
  console.log(keyword);
  pool.getConnection(function(err, con) {
    if (err) return res.status(400).send('Error');
    con.query(`SELECT * FROM product WHERE name LIKE '%${keyword}%' OR code LIKE '%${keyword}%'` , function (error, results) {
    if (error) {
      res.status(400).send('Error');
      con.release();
    }else{
      res.status(200).json(results);
      con.release();
    }
    });
  });
})
router.post('/', (req, res) => {
  const product = req.body;
  pool.getConnection(function(err, con) {
    if (err) return res.status(400).send('Error');
    con.query('INSERT INTO product SET ?', product, function (error, results) {
    if (error) {
      res.status(400).send('Error');
      con.release();
    }else{
      con.query(`SELECT * FROM product WHERE id='${results.insertId}'`, function (error, results) {
      if (error) {
        res.status(400).send('Error');
        con.release();
      }else{
        res.status(200).json(results[0]);
        con.release();
      }
      });
    }
    });
  });
});

router.put('/', (req, res) => {
  const product = req.body;
  pool.getConnection(function(err, con) {
    if (err) return res.status(400).send('Error');
    con.query('UPDATE product SET ? WHERE ?', [product, { id: product.id }], function (error, results) {
    if (error) {
      res.status(400).send('Error');
      con.release();
    }else{
      con.query(`SELECT * FROM product WHERE id='${product.id}'`, function (error, results) {
      if (error) {
        res.status(400).send('Error');
        con.release();
      }else{
        res.status(200).json(results[0]);
        con.release();
      }
      });
    }
    });
  });
});


router.delete('/:id', (req, res) => {
  const id = req.params.id;
  pool.getConnection(function(err, con) {
    if (err) return res.status(400).send('Error');
    con.query(`DELETE FROM product WHERE id='${id}'`, function (error, results) {
    if (error) {
      res.status(400).send('Error');
      con.release();
    }else{
      res.status(200).send('Ok');
      con.release();
    }
    });
  });
})

module.exports = router;