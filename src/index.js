import express from 'express';
import mysql from "mysql";
import bodyParser from "body-parser";

const uuidv1 = require('uuid/v1');
const connection = mysql.createConnection({
  host     : 'name-list.cxj3kuethmvo.ap-south-1.rds.amazonaws.com\n',
  database : 'tmp',
  user     : 'admin',
  password : 'Lnm_2310',
});

const app = express();
app.use( bodyParser.json());

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }

  console.log('Connected as id ' + connection.threadId);
});

//Read data from Database
app.get('/:id', (req, res)=>{
  console.log(req.params.id);
  connection.query('SELECT * FROM `name-list` where id="'+req.params.id+'" limit 10', (error, results) => {
    if (error)
      throw error;
    res.send(results);
  });
});

//Delete Data from Database
app.delete('/:id', (req, res) => {
  console.log(req.params.id);
  connection.query('DELETE FROM `name-list` WHERE id="'+ req.params.id+'"', (error, results) => {
    if (error)
      throw error;
    res.send(results);
  });
});

app.put('/:id', (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  connection.query('update `name-list` SET name="'+ req.body.name+'" , age = '+ req.body.age +' where id="'+ req.params.id +'"', (error, results) => {
    if (error)
      throw error;
    res.send(results);
  });
});

app.post('/add', (req, res) => {
  console.log(req.body);
  const id = uuidv1();
  // INSERT INTO `db`.`name-list` (`id`, `name`, `age`) VALUES ('01213414-343r545-34345-4545464634', 'abcd', 12)
  connection.query('INSERT into `name-list` (`id`, `name`, `age`) VALUES ("'+ id +'", "'+ req.body.name +'", '+req.body.age+')', (error, results) => {
    if (error)
      throw error;
    res.send(id);
  });
});



app.listen(3000, ()=> console.log('App is listening'));