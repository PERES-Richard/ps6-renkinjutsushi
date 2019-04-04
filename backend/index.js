const express = require('express')
const app = express()

app.use((request, response, next) => {
  // console.log(request.headers)
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

  var urlQuery = req.query;

  var hasParams = Object.keys(urlQuery).length > 0

  var mysql = require('mysql');
  var con = mysql.createConnection({ 
    port: "3333",
    user      : 'ps6_team',
    password  : 'ps6_sushi',
    database  : 'renkinjutsushi',
  });
  
  con.connect(function(err) {
    if (err) throw err;
    var queryStr = "SELECT * FROM etudiant";

    con.query(queryStr, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });

    if(hasParams) {
      queryStr += " WHERE "

      for(i = 0; i < Object.keys(urlQuery).length; i++)

        if(Array.isArray(Object.values(urlQuery)[i])) {
          queryStr += Object.keys(urlQuery)[i] + " in ( ? ) and ";
        }
        else queryStr += Object.keys(urlQuery)[i] + " like ? and "
  
      queryStr = queryStr.substring(0, queryStr.length-4)
      console.log(queryStr)
    }

    con.query(queryStr, Object.values(urlQuery), function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      var affichage = JSON.stringify(result)

      var idSpe = result[0].specialite
      console.log(idSpe)
      // res.send(result);

      con.query("select * from specialite where idSpecialite = ?", idSpe , function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        affichage += "\n\n\n" + JSON.stringify(result)
        res.send(affichage)
      });
    });
  });

  
});

app.listen(3000)
console.log("Saaba-sama wa sanzen no pooto o kiiteru")