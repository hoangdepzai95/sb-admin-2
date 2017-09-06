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
  const perPage = +req.query.per_page;
  const offset = (page - 1) * perPage;
  const mode = req.query.mode;
  const statusId = req.query.idStatus;
  const whereSql = mode === 'filterByStatus' ? `WHERE ${statusId.split(',').map(o => `status_id=${o}`).join(' OR ')}` : '';
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query(`
            SELECT b.*, user.full_name AS user_name, customer.phone, status.name as status, status.color
            FROM (SELECT * FROM bill ${whereSql} ORDER BY id DESC LIMIT ${perPage}  OFFSET ${offset} ) as b
            INNER JOIN customer ON b.customer_id = customer.id
            INNER JOIN status ON b.status_id = status.id
            INNER JOIN user ON b.user_id = user.id
            `, (error, bills) => {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
        con.release();
      } else {
        if (!bills.length) {
          res.status(200).json([]);
          con.release();
          return;
        }
        con.query(
          `SELECT bill_detail.bill_id, bill_detail.quantity, p.name, p.category FROM bill_detail
           INNER JOIN (SELECT product.*, product_category.category FROM product INNER JOIN product_category ON product.id_category = product_category.id) AS p ON bill_detail.product_id = p.id
           WHERE bill_detail.bill_id IN (?)`
        ,[bills.map(o => o.id)], (error, products) => {
          if (error) {
            console.log(error);
            res.status(400).send('Error');
            con.release();
          } else {
            const groupProduct = _.groupBy(products, 'bill_id');
            for (let bill of bills) {
              const billProducts = groupProduct[bill.id] || [];
              bill.products = billProducts || [];
              bill.products_info = bill.products.map(product => `${product.name}(${product.quantity})`).join(', ');
            }
            res.status(200).json(_.sortBy(bills, 'id').reverse());
            con.release();
          }
        })
      }
    });
  });
});

router.get('/total', (req, res) => {
  const mode = req.query.mode;
  const statusId = req.query.idStatus;
  const sql = mode === 'filterByStatus' ? `SELECT COUNT(*) FROM bill WHERE ${statusId.split(',').map(o => `status_id=${o}`).join(' OR ')}` : 'SELECT COUNT(*) FROM bill';
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
  const type = req.query.type;
  let condition;
  if (multiKeyword) {
    condition = `WHERE bill.code REGEXP '${keywords}'`
  } else if (type === 'phone') {
    condition = `WHERE customer.phone = '${keywords}'`;
  } else if (type === 'id') {
    condition = `WHERE bill.id = '${keywords}'`;
  } else if (type === 'duplicate') {
    condition = `WHERE bill.duplicate = '2'`;
  } else {
    condition = `WHERE customer.phone LIKE '%${keywords}%' OR customer.facebook LIKE '%${keywords}%' OR bill.code LIKE '%${keywords}%'`;
  }
  const sql = `
    SELECT bill.*, user.full_name AS user_name, customer.phone, status.name AS status
    FROM bill
    INNER JOIN customer ON bill.customer_id = customer.id
    INNER JOIN status ON bill.status_id = status.id
    INNER JOIN user ON bill.user_id = user.id
    ${condition};
  `;
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query(sql, (error, bills) => {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
        con.release();
      } else {
        if (!bills.length) {
          res.status(200).json([]);
          con.release();
          return;
        }
        con.query(
          `SELECT bill_detail.bill_id, bill_detail.quantity, p.name, p.category FROM bill_detail
           INNER JOIN (SELECT product.*, product_category.category FROM product INNER JOIN product_category ON product.id_category = product_category.id) AS p ON bill_detail.product_id = p.id
           WHERE bill_detail.bill_id IN (?)`
        ,[bills.map(o => o.id)], (error, products) => {
          if (error) {
            console.log(error);
            res.status(400).send('Error');
            con.release();
          } else {
            const groupProduct = _.groupBy(products, 'bill_id');
            for (let bill of bills) {
              const billProducts = groupProduct[bill.id] || [];
              bill.products = billProducts || [];
              bill.products_info = bill.products.map(product => `${product.name}(${product.quantity})`).join(', ');
            }
            res.status(200).json(bills);
            con.release();
          }
        })
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
      con.query('SELECT * FROM status ORDER BY status.order', (error, result) => {
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

router.put('/status/show_notify', (req, res) => {
  const id = req.query.id;
  const show_notify = req.query.show;
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query('UPDATE status SET ? WHERE ?', [{ show_notify }, { id }], (error, result) => {
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

router.put('/change_status', (req, res) => {
  const status_id = req.body.status_id;
  const bills = req.body.bills;
  const user_name = req.body.user_full_name;
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query(`UPDATE bill SET ? WHERE id IN (?)`, [{ status_id }, bills.map(o => o.id) ] , (error, result) => {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
        con.release();
      } else {
        const temp = bills.filter(o => o.status_id == 11);
        const logged = [];
        function writeLog() {
          bills.forEach((bill) => {
            const billStatus = req.body.status.find(o => o.id == bill.status_id);
            const newStatus = req.body.status.find(o => o.id == status_id);
            if (billStatus.id !== status_id && status_id == 31 && billStatus.show_notify == 1) {
              const changes = { user: user_name, data: [] };
              changes.data.push({ field: 'status', origin: billStatus.name, changeto: newStatus.name});
              con.query('INSERT INTO bill_changelog SET ?', { bill_id: bill.id, create_at: (new Date()).valueOf(), content: JSON.stringify(changes) }, (error, result) => {
                if (error) {
                  console.log(error);
                  con.release();
                }else{
                  logged.push(bill);
                  if (logged.length === bills.length) {
                    con.release();
                  }
                }
              })
            } else {
              logged.push(bill);
              if (logged.length === bills.length) {
                con.release();
              }
            }
          })
        }
        if (status_id != 11 && temp.length) {
            con.query(`UPDATE bill SET ? WHERE id IN (?)`, [{ user_id: req.body.user_id }, temp.map(o => o.id) ] , (error, result) => {
            if (error) {
              console.log(error);
              res.status(400).send('Error');
              con.release();
            } else {
              res.status(200).send('Ok');
              // write log
              writeLog();
              //--------------
            }
          });
        } else {
          res.status(200).send('Ok');
          // write log
          writeLog();
          //--------------
        }
      }
    });
  });
});

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

router.put('/not_duplicate/:id', (req, res) => {
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query('UPDATE bill SET ? WHERE ?', [{ duplicate: 1 }, { id: req.params.id }] , (error, result) => {
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

router.put('/duplicate/:id', (req, res) => {
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query('UPDATE bill SET ? WHERE ?', [{ duplicate: 2 }, { id: req.params.id }] , (error, result) => {
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

router.post('/', (req, res) => {
  const bill = req.body.bill_info;
  bill.create_at = (new Date()).valueOf();
  pool.getConnection(function(err, con) {
    if (err) return res.status(400).send('Error');
    con.query(`SELECT * FROM bill WHERE customer_id = ${bill.customer_id} AND duplicate != 1`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
        con.release();
      }else{
        if (result.length) {
          const bill_ids = result.map(o => o.id);
          con.query('UPDATE bill SET ? WHERE id IN (?)', [{ duplicate: 2 }, bill_ids], (error, result) => {
            if (error) {
              console.log(error);
              res.status(400).send('Error');
              con.release();
            }else{
              bill.duplicate = 2;
              con.query('INSERT INTO bill SET ?', bill, function (error, result) {
              if (error) {
                console.log(error);
                res.status(400).send('Error');
                con.release();
              }else{
                let products = req.body.products;
                products = products.map((product) => {
                  return [product.product_id, product.quantity, result.insertId];
                })
                if (!products.length) {
                  res.status(200).send('Ok');
                  con.release();
                  return;
                }
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
          })
        } else {
          bill.duplicate = 0;
          con.query('INSERT INTO bill SET ?', bill, function (error, result) {
          if (error) {
            console.log(error);
            res.status(400).send('Error');
            con.release();
          }else{
            let products = req.body.products;
            products = products.map((product) => {
              return [product.product_id, product.quantity, result.insertId];
            })
            if (!products.length) {
              res.status(200).send('Ok');
              con.release();
              return;
            }
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
      }
    })
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
        let current_status_id;
        let stop = false;
        bills.forEach((bill) => {
          if (stop) return;
          const billStatus = status.find(o => o.name === _.trim(bill[2]));
          const statusId = billStatus ? billStatus.id : null;
          if (statusId) {
            current_status_id = statusId
          };
          if (!current_status_id) {
            res.status(200).json({ message: `Có lỗi xảy ra, ${updated.length}/${bills.length} hóa đơn đã được cập nhật, lỗi ở hóa đơn có mã ${bill[0]}` });
            con.release();
            stop = true;
            return;
          }
          const value = [ { status_id: current_status_id, code: bill[1] }, { id: bill[0] }];
          con.query('UPDATE bill SET ? WHERE ?  ', value, (error, result) => {
          if (error) {
            console.log(error);
            res.status(200).json({ message: `Có lỗi xảy ra, ${updated.length}/${bills.length} hóa đơn đã được cập nhật, lỗi ở hóa đơn có mã ${bill[0]}` });
            con.release();
            stop = true;
            return;
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
  const originBill = req.body.origin_bill;
  const changes = { user: req.body.user_full_name, data: [] };
  const newProductInfo = req.body.products.map(product => `${product.name}(${product.quantity})`).join(', ');
  for (let field in bill) {
    if ((bill[field] !== originBill[field]) && field !== 'products'){
      changes.data.push({ field, origin: originBill[field], changeto: bill[field] });
    }
  }
  if (originBill.products_info !== newProductInfo) {
    changes.data.push({ field: 'products_info', origin: originBill.products_info, changeto: newProductInfo});
  }
  if (req.body.origin_status_id == 11 && bill.status_id != 11) {
    bill.user_id = req.body.user_id;
  }
  pool.getConnection(function(err, con) {
    if (err) return res.status(400).send('Error');
    con.query('UPDATE bill SET ? WHERE ?', [bill, { id: bill.id }], function (error, result) {
    if (error) {
      console.log(error);
      res.status(400).send('Error');
      con.release();
    }else{
      con.query(`DELETE FROM bill_detail WHERE bill_id='${bill.id}'`, function (error, results) {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
        con.release();
      }else{
        let products = req.body.products;
        products = products.map((product) => {
          return [product.product_id, product.quantity, bill.id];
        })
        if (!products.length) {
          res.status(200).send('Ok');
          con.release();
          return;
        }
        con.query('INSERT INTO bill_detail (product_id, quantity, bill_id) VALUE ?', [products], function (error, results) {
        if (error) {
          console.log(error);
          res.status(400).send('Error');
          con.release();
        }else{
          res.status(200).json(results);
          // write log
          if (req.body.write_log != 1) return;
          con.query('INSERT INTO bill_changelog SET ?', { bill_id: bill.id, create_at: (new Date()).valueOf(), content: JSON.stringify(changes) }, (error, result) => {
            if (error) {
              console.log(error);
              con.release();
            }else{
            }
          })
          //--------------
        }
        });
      }
      });
    }
    });
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query('DELETE FROM bill_changelog WHERE ?', { bill_id: id }, (error, result) => {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
        con.release();
      } else {
          con.query('DELETE FROM bill_detail WHERE ?', { bill_id: id }, (error, result) => {
              if (error) {
                console.log(error);
                res.status(400).send('Error');
                con.release();
              } else {
                con.query('DELETE FROM bill WHERE ?', { id }, (error, result) => {
                  if (error) {
                    console.log(error);
                    res.status(400).send('Error');
                    con.release();
                  } else {
                    res.status(200).send('Ok');
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
        WHERE bill.create_at >= ${req.query.start} AND bill.create_at <= ${req.query.end} AND status_id != 11`,
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

router.get('/statistic/customerbills', (req, res) => {
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query(`
        SELECT customer.name, customer.phone, customer.facebook FROM bill
        INNER JOIN customer ON bill.customer_id = customer.id
        WHERE bill.create_at >= ${req.query.start} AND bill.create_at <= ${req.query.end}`,
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(400).send('Error');
          con.release();
        } else {
          const bills = _.uniqBy(result, 'phone');
          const data = bills.map((bill) => {
            return { name: bill.name, facebook: bill.facebook, phone: bill.phone, quantity: result.filter(o => o.phone === bill.phone).length };
          })
          res.status(200).json(_.sortBy(data, 'quantity'));
          con.release();
        }
    });
  });
});

router.get('/changelog', (req, res) => {
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query('SELECT * FROM bill_changelog ORDER BY id DESC LIMIT 100 OFFSET 0' , (error, result) => {
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
router.put('/check_changelog', (req, res) => {
  pool.getConnection((err, con) => {
      if (err) return res.status(400).send('Error');
      con.query('SELECT * FROM bill_changelog WHERE ?', { id: req.body.id } , (error, result) => {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
        con.release();
      } else {
        let checked = String(result[0].checked || '').split(',').concat([req.body.user_id]).filter(o => o).map(o => +o);
        checked = _.uniq(checked).join(',');
        con.query('UPDATE bill_changelog SET ? WHERE ?', [{ checked }, { id: req.body.id }], (error) => {
          if (error) {
            console.log(error);
            res.status(400).send('Error');
            con.release();
          } else {
            result[0].checked = checked;
            res.status(200).json(result[0]);
            con.release();
          }
        })
      }
    });
  });
});

module.exports = router;
