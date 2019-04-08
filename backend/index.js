const express = require('express')
const app = express()
var cors = require('cors')
var mysql = require('mysql');
var con = mysql.createConnection({
  port: "3333",
  user: 'ps6_team',
  password: 'ps6_sushi',
  database: 'renkinjutsushi',
});

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});


app.get('/', (request, response) => {
  response.send(
    "<h1>Sore saaba wa Ekusupuresu no okage de arukimasu !</h1>"
  )
})

app.get('/getData/specialite', function (req, res) {
  con.query("select * from specialite", function (err, result, fields) {
    if (err) {
      console.log('Error 2 =\n', err);
    } else {
      // console.log(result);
      res.status(200).json(result);
    }
  });
});


app.get('/getData/pays', function (req, res) {
  con.query("select id as idPays, nom_fr_fr as nomPays from pays", function (err, result, fields) {
    if (err) {
      console.log('Error 2.1 =\n', err);
    } else {
      // console.log(result);
      res.status(200).json(result);
    }
  });
});


app.get('/getData/etat', function (req, res) {
  con.query("select * from etat", function (err, result, fields) {
    if (err) {
      console.log('Error 2.2 =\n', err);
    } else {
      // console.log(result);
      res.status(200).json(result);
    }
  });
});


app.get('/getData', function (req, res) {

  var urlQuery = req.query;

  var hasParams = Object.keys(urlQuery).length > 0

  var queryStr = "SELECT * FROM etudiant as etu, pays, specialite as spe, etat"
  queryStr += " WHERE "

  if (hasParams) {

    for (i = 0; i < Object.keys(urlQuery).length; i++)

      switch (Object.keys(urlQuery)[i]) {
// PROMO
        case 'pays':
          {
            queryStr += 'pays.nom_fr_fr';
            if (Array.isArray(Object.values(urlQuery)[i])) {
              queryStr += " in ( ? ) and ";
            } else queryStr += " like ? and ";
            break;
          }

        case 'specialite':
          {
            queryStr += 'spe.nomSpecialite';
            if (Array.isArray(Object.values(urlQuery)[i])) {
              queryStr += " in ( ? ) and ";
            } else queryStr += " like ? and ";
            break;
          }

        case 'etat':
          {
            queryStr += 'etat.nomEtat';
            if (Array.isArray(Object.values(urlQuery)[i])) {
              queryStr += " in ( ? ) and ";
            } else queryStr += " like ? and ";
            break;
          }

        default:
          {
            queryStr += 'etu.';
            if (Array.isArray(Object.values(urlQuery)[i])) {
              queryStr += " in ( ? ) and ";
            } else queryStr += " like ? and ";
            break;
          }
      }

    //   if (Array.isArray(Object.values(urlQuery)[i])) {
    //     queryStr += Object.keys(urlQuery)[i] + " in ( ? ) and ";
    //   }
    // else queryStr += Object.keys(urlQuery)[i] + " like ? and ";

    queryStr = queryStr.substring(0, queryStr.length - 4)
    queryStr += ' AND ';
    console.log(queryStr)
  }
  queryStr += ' pays.id = etu.pays AND spe.idSpecialite = etu.specialite AND etat.idEtat = etu.etat';

  con.query(queryStr, Object.values(urlQuery), function (err, result, fields) {
    if (err) {
      console.log('Error 3 =\n');
      console.log(err);
    } else {
      // console.log(result);
      res.status(200).json(result);
    }
  });
});

app.listen(3000)
console.log("Saaba-sama wa sanzen no pooto o kiiteru");