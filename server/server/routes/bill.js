const pool = require('../db');
const _ = require('lodash');
const multer  = require('multer');
const express = require('express');
const xlsx =  require('node-xlsx');
const getRootPath = require('../../../util');

const router = express.Router();

const upload  = multer({ storage: multer.memoryStorage() });

router.get('/', (req, res) => {
  const page = req.query.page;
  const perPage = req.query.per_page;
  const offset = (page - 1) * perPage;
  const mode = req.query.mode;
  const statusId = req.query.idStatus;
  const whereSql = mode === 'filterByStatus' ? `WHERE status_id='${statusId}'` : '';
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query(`
            SELECT b.*, product.name AS product_name, bill_detail.quantity, user.full_name AS user_name,
            customer.name as customer_name, customer.phone, customer.facebook, status.name as status, product_category.category, status.color
            FROM (SELECT * FROM bill ${whereSql} ORDER BY id DESC LIMIT ${perPage}  OFFSET ${offset} ) as b
            INNER JOIN customer ON b.customer_id = customer.id
            INNER JOIN status ON b.status_id = status.id
            INNER JOIN user ON b.user_id = user.id
            INNER JOIN (bill_detail INNER JOIN (product INNER JOIN product_category ON product.id_category = product_category.id) ON bill_detail.product_id = product.id) ON b.id = bill_detail.bill_id
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
            return { name: o.product_name, quantity: o.quantity, category: o.category };
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
  const mode = req.query.mode;
  const statusId = req.query.idStatus;
  const sql = mode === 'filterByStatus' ? `SELECT COUNT(*) FROM bill WHERE status_id=${statusId}` : 'SELECT COUNT(*) FROM bill';
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query(sql, (error, result) => {
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

router.get('/search', (req, res) => {
  const keywords = req.query.q.split(',').map(o => o.trim()).join('|');
  const multiKeyword = req.query.q.split(',').length > 1 ;
  const condition = multiKeyword ? `WHERE bill.code REGEXP '${keywords}'` :
    `WHERE customer.phone LIKE '%${keywords}%' OR customer.facebook LIKE '%${keywords}%' OR bill.code LIKE '%${keywords}%'`;
  const sql = `
    SELECT bill.*, product.name AS product_name, bill_detail.quantity,
    customer.name as customer_name, customer.phone, customer.facebook, status.name as status, product_category.category
    FROM bill
    INNER JOIN customer ON bill.customer_id = customer.id
    INNER JOIN status ON bill.status_id = status.id
    INNER JOIN (bill_detail INNER JOIN (product INNER JOIN product_category ON product.id_category = product_category.id) ON bill_detail.product_id = product.id) ON bill.id = bill_detail.bill_id
    ${condition};
  `;
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query(sql, (error, result) => {
        if (error) {
          res.status(400).send('Error');
          con.release();
        } else {
          const billGroup = _.groupBy(result, 'id');
          let rs = [];
          for ( let billId in billGroup) {
            const bill = billGroup[billId][0];
            bill.products = billGroup[billId].map((o) => {
              return { name: o.product_name, quantity: o.quantity, category: o.category };
            });
            bill.products_info = bill.products.map(product => `${product.name}(${product.quantity})`).join(', ');
            rs.unshift(bill);
          }
          res.status(200).json(rs);
          con.release();
      }
    });
  });
})


router.get('/product/:billId', (req, res) => {
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query(`
        SELECT product.*, bill_detail.quantity, product_category.category
        FROM bill
        INNER JOIN (bill_detail INNER JOIN (product INNER JOIN product_category ON product.id_category = product_category.id) ON bill_detail.product_id = product.id) ON bill.id = bill_detail.bill_id
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

router.get('/status', (req, res) => {
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query('SELECT * FROM status', (error, result) => {
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

router.post('/status', (req, res) => {
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query('INSERT INTO status SET ?', {name: req.body.name}, (error, result) => {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
        con.release();
      } else {
        res.status(200).json({ id: result.insertId, name: req.body.name });
        con.release();
      }
    });
  });
})

router.put('/status', (req, res) => {
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query('UPDATE status SET ? WHERE ?', [{color: req.body.color}, { id: req.body.id }], (error, result) => {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
        con.release();
      } else {
        res.status(200).send('Ok');
        con.release();
      }
    });
  });
})

router.delete('/status/:id', (req, res) => {
  const id = req.params.id;
  if (id == 1 || id == 2) {
    return res.status(400).send('Error');
  }
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query('DELETE FROM status WHERE ?', { id } , (error, result) => {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
        con.release();
      } else {
        res.status(200).send('Ok');
        con.release();
      }
    });
  });
});

router.post('/', (req, res) => {
  const bill = req.body.bill_info;
  bill.create_at = (new Date()).valueOf();
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

router.post('/excel', (req, res) => {
  const bills = req.body.bills;
  const buffer = xlsx.build([{name: "mySheetName", data: bills}]);
  res.end(buffer);
});

router.post('/excel/upload', upload.single('file'), (req, res) => {
  const workSheetsFromBuffer = xlsx.parse(req.file.buffer);
  const bills = workSheetsFromBuffer[0].data;
  bills.shift();
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query('SELECT * FROM status', (error, result) => {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
        con.release();
      } else {
        const status = result;
        const updated = [];
        bills.forEach((bill) => {
          let stop = false;
          if (stop) return;
          const billStatus = status.find(o => o.name === bill[2].trim());
          const statusId = billStatus ? billStatus.id : null;
          const value = [ { status_id: statusId, code: bill[1] }, { id: bill[0] }];
          con.query('UPDATE bill SET ? WHERE ?  ', value, (error, result) => {
          if (error) {
            console.log(error);
            res.status(200).josn({ message: `Có lỗi xảy ra, ${updated.length} hóa đơn đã được cập nhật, lỗi ở hóa đơn có ID ${bill.id}` });
            con.release();
            stop = true;
          } else {
            updated.push(bill);
            if (updated.length === bills.length) {
              res.status(200).json({ message: `Cập nhật thành công, ${updated.length} hóa đơn đã được cập nhật` });
            }
          }
        });
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

router.get('/category', (req, res) => {
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query('SELECT * FROM product_category', (error, result) => {
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

router.post('/category', (req, res) => {
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query('INSERT INTO product_category SET ?', { category: req.body.category }, (error, result) => {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
        con.release();
      } else {
        res.status(200).json({ id: result.insertId, category: req.body.category });
        con.release();
      }
    });
  });
})

router.delete('/category/:id', (req, res) => {
  const id = req.params.id;
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query('DELETE FROM product_category WHERE ?', { id } , (error, result) => {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
        con.release();
      } else {
        res.status(200).send('Ok');
        con.release();
      }
    });
  });
});

router.get('/statistic/userbills', (req, res) => {
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query(`
        SELECT user.full_name FROM bill
        INNER JOIN user ON bill.user_id = user.id
        WHERE bill.create_at >= ${req.query.start} AND bill.create_at <= ${req.query.end}`,
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(400).send('Error');
          con.release();
        } else {
          const users = _.uniqBy(result, 'full_name');
          const data = users.map((user) => {
            return { name: user.full_name, quantity: result.filter(o => o.full_name === user.full_name).length };
          })
          res.status(200).json(_.sortBy(data, 'quantity'));
          con.release();
        }
    });
  });
});
router.get('/statistic/newcustomer', (req, res) => {
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
          res.status(200).json(result);
          con.release();
        }
    });
  });
});

module.exports = router;
