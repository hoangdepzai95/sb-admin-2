const pool = require('../db');
const multer  = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const mime = require('mime');
const getRootPath = require('../../../util');

const express = require('express');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${getRootPath()}/uploads/images`)
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});
const upload = multer({ storage: storage });
router.get('/', (req, res) => {
  const condition = req.query.filter_real_price == 1 ? 'WHERE product.real_price = 0' : '';
  pool.getConnection(function(err, con) {
    if (err) return res.status(400).send('Error');
    con.query(`SELECT product.*, product_category.category FROM product INNER JOIN product_category ON product.id_category = product_category.id ${condition}`, function (error, results) {
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
  pool.getConnection(function(err, con) {
    if (err) return res.status(400).send('Error');
    con.query(`SELECT * FROM product WHERE name LIKE '%${keyword}%' OR code LIKE '%${keyword}%'` , function (error, results) {
    if (error) {
      console.log(error);
      res.status(400).send('Error');
      con.release();
    }else{
      res.status(200).json(results);
      con.release();
    }
    });
  });
})
router.post('/', upload.single('file'), (req, res) => {
  const product = JSON.parse(req.body.product);
  if (req.file) product.image = req.file.filename;
  pool.getConnection(function(err, con) {
    if (err) return res.status(400).send('Error');
    con.query('INSERT INTO product SET ?', product, function (error, results) {
    if (error) {
      console.log(error);
      res.status(400).send('Error');
      con.release();
    }else{
      con.query(`SELECT product.*, product_category.category FROM product INNER JOIN product_category ON product.id_category = product_category.id WHERE product.id='${results.insertId}'`, function (error, results) {
      if (error) {
        console.log(error);
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

router.put('/', upload.single('file'), (req, res) => {
  const product = JSON.parse(req.body.product);
  if (req.file) product.image = req.file.filename;
  pool.getConnection(function(err, con) {
    if (err) return res.status(400).send('Error');
    con.query('UPDATE product SET ? WHERE ?', [product, { id: product.id }], function (error, results) {
    if (error) {
      res.status(400).send('Error');
      con.release();
    }else{
      con.query(`SELECT product.*, product_category.category FROM product INNER JOIN product_category ON product.id_category = product_category.id WHERE product.id='${product.id}'`, function (error, results) {
      if (error) {
        console.log(error);
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
