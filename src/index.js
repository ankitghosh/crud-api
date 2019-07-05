import express from 'express';
import mysql from "mysql";
import bodyParser from "body-parser";
import cluster from "cluster";

import {cpus} from "os";

const uuidv1 = require('uuid/v1');


const connPool = mysql.createPool({
  connectionLimit: 10,
  host     : 'localhost',
  database : 'db',
  user     : 'root',
  password : 'Lnm_2711'
});


const numCPUs = cpus().length;
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const app = express();
  app.use( bodyParser.json());


//Read data from Database
  app.get('/:id', (req, res)=>{
    console.log(req.params.id);
    connPool.getConnection((err, conn)=>{
      if (err){
        res.send('error')
      } else{
        conn.query('SELECT * FROM `name-list` where id="'+req.params.id+'" limit 10', (error, results) => {
          if (error)
            throw error;
          conn.release();
          res.send(results);
        });
      }
    });
  });

//Delete Data from Database
  app.delete('/:id', (req, res) => {
    console.log(req.params.id);
    connPool.getConnection((err, conn)=> {
      if (err) {
        res.send('error')
      } else {
        conn.query('DELETE FROM `name-list` WHERE id="' + req.params.id + '"', (error, results) => {
          if (error)
            throw error;
          conn.release();
          res.send(results);
        });
      }
    });
  });

  app.put('/:id', (req, res) => {
    console.log(req.params.id);
    console.log(req.body);
    connPool.getConnection((err, conn)=> {
      if (err) {
        res.send('error')
      } else {
        conn.query('update `name-list` SET name="' + req.body.name + '" , age = ' + req.body.age + ' where id="' + req.params.id + '"', (error, results) => {
          if (error)
            throw error;
          conn.release();
          res.send(results);
        });
      }
    });
  });

  app.post('/add', (req, res) => {
    console.log(req.body);
    const id = uuidv1();
    // INSERT INTO `db`.`name-list` (`id`, `name`, `age`) VALUES ('01213414-343r545-34345-4545464634', 'abcd', 12)
    connPool.getConnection((err, conn)=> {
      if (err) {
        res.send('error')
      } else {
        conn.query('INSERT into `name-list` (`id`, `name`, `age`) VALUES ("' + id + '", "' + req.body.name + '", ' + req.body.age + ')', (error, results) => {
          if (error)
            throw error;
          conn.release();
          res.send(id);
        });
      }
    });
  });



  app.listen(3000, ()=> console.log('App is listening'));
}

