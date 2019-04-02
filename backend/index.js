const express = require('express')
const app = express()

app.use((request, response, next) => {
  console.log(request.headers)
  next()
})

app.use((request, response, next) => {
  next()
})

app.get('/', (request, response) => {
  response.send(
    "<h1>Sore saaba wa Ekusupuresu no okage de arukimasu !</h1>"
  )
})

app.get('/getData', function (req, res) {
  var param = req.params
  // TODO les params
  res.send({param})
  var mysql = require('mysql');
  var con = mysql.createConnection({ 
    port: "3333",
    user      : 'ps6_team',
    password  : 'ps6_sushi',
    database  : 'renkinjutsushi',
  });
  
  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM test", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.send({result})
    });

  });

  
});

app.listen(3000)
console.log("Saaba-sama wa sanzen no pooto o kiiteru")