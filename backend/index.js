



const Etudiant = require("./src/app/models/etudiant.model");

const express = require('express');
const app = express();
var cors = require('cors');
var mysql = require('mysql');
var con = mysql.createConnection({
  port: "3306",
  user: 'ps6_team',
  password: 'ps6_sushi',
  database: 'renkinjutsushi',
});
var bodyParser = require('body-parser');

app.use(bodyParser.json());
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
    '<h1>Sore saaba wa Ekusupuresu no okage de arukimasu !</h1><h2> <a href="/getData">localhost:3306/getData</a></h2>'
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

app.get('/getData/numbersucceed/:annee', function (req, res) {
  let annee = req.param('annee');

  con.query("select count(*) as degre from etudiant where annee= ? group by etudiant.semestreValide ;", annee, function (err, result, fields) {
    if (err) {
      console.log('Error 2.2 =\n', err);
    } else {
      // console.log(result);
      res.status(200).json(result);
    }
  });
});

app.get('/getData/piechart/:promo', function (req, res) {
  let promo = req.param('promo');
  con.query("select etat.degre as etatdegre ,count(*) as degre from etudiant inner join etat on etudiant.etat = etat.idEtat where etudiant.promo= ? group by etat.degre order by etatdegre;", promo, function (err, result, fields) {
    if (err) {
      console.log('Error 2.2 =\n', err);
    } else {
      // console.log(result);
      res.status(200).json(result);
    }
  });
});

app.get('/getData/piechartnonvalide/', function (req, res) {
  con.query("select etat.idEtat as etatdegre, count(*) as degre from etudiant inner join etat on etudiant.etat = etat.idEtat where etat.degre = 3 or etat.degre = 2 group by etat.idEtat order by etat.idEtat;", function (err, result, fields) {
    if (err) {
      console.log('Error 2.2 =\n', err);
    } else {
      // console.log(result);
      res.status(200).json(result);
    }
  });
});




app.get('/getData/numberstudents/:etat&:promo&:specialite', function (req, res) {
  let etat = req.param('etat');
  let promo = req.param('promo');
  let specialite = req.param('specialite');

  let idEtat = '';
  let idPromo = '';
  let idSpecialite = '';


  if (etat === '1') {
    idEtat = "where (etudiant.etat=2 OR etudiant.etat=4)";
  }
  else if (etat === '0') {
    idEtat = "where (etudiant.etat=3 OR etudiant.etat=7)";
  }
  else if (etat === '3') {
    idEtat = "where (etudiant.etat=1 OR etudiant.etat=5 OR etudiant.etat=6)";
  }


  if (promo !== "null"){
    idPromo = " AND etudiant.promo = '"+promo+"' ";
  }

  if (specialite !== "null"){
    idSpecialite = " AND etudiant.specialite = '"+specialite+"' ";
  }




  let request = " select pays.nom_fr_fr as pays,count(*) as nombre from etudiant INNER JOIN pays ON etudiant.pays = pays.id " + idEtat + idPromo + idSpecialite + " group by pays.id order by count(*) DESC limit 3 ; ";

  con.query(request, function (err, result, fields) {
    if (err) {
      console.log('Error 2.2 =\n', err);
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/getData/numberstudentswithcountry/:country&:etat&:promo&:specialite', function (req, res) {
  let etat = req.param('etat');
  let promo = req.param('promo');
  let specialite = req.param('specialite');
  let country = req.param('country');

  let idEtat = '';
  let idPromo = '';
  let idSpecialite = '';


  if (etat === '1') {
    idEtat = "and (etudiant.etat=2 OR etudiant.etat=4)";
  }
  else if (etat === '0') {
    idEtat = "and (etudiant.etat=3 OR etudiant.etat=7)";
  }
  else if (etat === '3') {
    idEtat = "and (etudiant.etat=1 OR etudiant.etat=5 OR etudiant.etat=6)";
  }


  if (promo !== "null"){
    idPromo = " AND etudiant.promo = '"+promo+"' ";
  }

  if (specialite !== "null"){
    idSpecialite = " AND etudiant.specialite = '"+specialite+"' ";
  }

  let request = " select pays.nom_fr_fr as pays, etudiant.annee,count(*) as nombre from etudiant INNER JOIN pays ON etudiant.pays = pays.id where pays.nom_fr_fr= '"+country+"' "+idEtat+idPromo+idSpecialite+"  group by pays.id,etudiant.annee order by etudiant.annee ; ";
  console.log(request);
  con.query(request, function (err, result, fields) {
    if (err) {
      console.log('Error 2.2 =\n', err);
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/getData/numbersucceedcountry/:pays', function (req, res) {
  let pays = req.param('pays');
  con.query("select count(*) as degre from etudiant INNER JOIN pays ON etudiant.pays = pays.id where pays.nom_fr_fr= ? group by etudiant.semestreValide;\n\n", pays, function (err, result, fields) {
    if (err) {
      console.log('Error 2.2 =\n', err);
    } else {
      // console.log(result);
      res.status(200).json(result);
    }
  });
});


app.get('/getData/getidcountry/:country', function (req, res) {
  let country = req.param('country');

  con.query("SELECT id FROM renkinjutsushi.pays where nom_fr_fr = ?; \n\n", country, function (err, result, fields) {
    if (err) {
      console.log('Error 2.2 =\n', err);
    } else {
      res.status(200).json(result);
    }
  });
});


app.get('/getData/getidspeciality/:speciality', function (req, res) {
  let speciality = req.param('speciality');

  let params = [speciality];

  con.query("SELECT idSpecialite FROM renkinjutsushi.specialite where nomSpecialite = ?;; \n\n", params, function (err, result, fields) {
    if (err) {
      console.log('Error 2.3 =\n', err);
    } else {
      res.status(200).json(result);
    }
  });
});


app.get('/getData/getidetat/:etat', function (req, res) {
  let etat = req.param('etat');

  con.query("SELECT idEtat FROM renkinjutsushi.etat where nomEtat = ? ;; \n\n", etat, function (err, result, fields) {
    if (err) {
      console.log('Error 2.2 =\n', err);
    } else {
      res.status(200).json(result);
    }
  });
});







app.get('/getData', function (req, res) {

  var urlQuery = req.query;

  var hasParams = Object.keys(urlQuery).length > 0

  var queryStr = "SELECT * FROM etudiant AS etu, pays, specialite AS spe, etat"
  queryStr += " WHERE "

  if (hasParams) {

    for (i = 0; i < Object.keys(urlQuery).length; i++)

      switch (Object.keys(urlQuery)[i]) {
        case 'pays':
          {
            queryStr += 'pays.nom_fr_fr';
            if (Array.isArray(Object.values(urlQuery)[i])) {
              queryStr += " IN ( ? ) AND ";
            } else queryStr += " LIKE ? AND ";
            break;
          }

        case 'specialite':
          {
            queryStr += 'spe.nomSpecialite';
            if (Array.isArray(Object.values(urlQuery)[i])) {
              queryStr += " IN ( ? ) AND ";
            } else queryStr += " LIKE ? AND ";
            break;
          }

        case 'etat':
          {
            queryStr += 'etat.nomEtat';
            if (Array.isArray(Object.values(urlQuery)[i])) {
              queryStr += " IN ( ? ) AND ";
            } else queryStr += " LIKE ? AND ";
            break;
          }

        case 'degre':
          {
            queryStr += 'etat.degre';
            if (Array.isArray(Object.values(urlQuery)[i])) {
              queryStr += " IN ( ? ) AND ";
            } else queryStr += " LIKE ? AND ";
            break;
          }

        default:
          {
            queryStr += 'etu.';
            if (Array.isArray(Object.values(urlQuery)[i])) {
              queryStr += Object.keys(urlQuery)[i] + " IN ( ? ) AND ";
            } else queryStr += Object.keys(urlQuery)[i] + " LIKE ? AND ";
            break;
          }
      }

    queryStr = queryStr.substring(0, queryStr.length - 4)
    queryStr += ' AND ';
  }
  queryStr += ' pays.id = etu.pays AND spe.idSpecialite = etu.specialite AND etat.idEtat = etu.etat';

  console.log(queryStr, Object.values(urlQuery))

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


app.get('/getData', function (req, res) {

  var urlQuery = req.query;

  var hasParams = Object.keys(urlQuery).length > 0

  var queryStr = "SELECT * FROM etudiant AS etu, pays, specialite AS spe, etat"
  queryStr += " WHERE "

  if (hasParams) {

    for (i = 0; i < Object.keys(urlQuery).length; i++)

      switch (Object.keys(urlQuery)[i]) {
        case 'pays':
          {
            queryStr += 'pays.nom_fr_fr';
            if (Array.isArray(Object.values(urlQuery)[i])) {
              queryStr += " IN ( ? ) AND ";
            } else queryStr += " LIKE ? AND ";
            break;
          }

        case 'specialite':
          {
            queryStr += 'spe.nomSpecialite';
            if (Array.isArray(Object.values(urlQuery)[i])) {
              queryStr += " IN ( ? ) AND ";
            } else queryStr += " LIKE ? AND ";
            break;
          }

        case 'etat':
          {
            queryStr += 'etat.nomEtat';
            if (Array.isArray(Object.values(urlQuery)[i])) {
              queryStr += " IN ( ? ) AND ";
            } else queryStr += " LIKE ? AND ";
            break;
          }

        case 'degre':
          {
            queryStr += 'etat.degre';
            if (Array.isArray(Object.values(urlQuery)[i])) {
              queryStr += " IN ( ? ) AND ";
            } else queryStr += " LIKE ? AND ";
            break;
          }

        default:
          {
            queryStr += 'etu.';
            if (Array.isArray(Object.values(urlQuery)[i])) {
              queryStr += Object.keys(urlQuery)[i] + " IN ( ? ) AND ";
            } else queryStr += Object.keys(urlQuery)[i] + " LIKE ? AND ";
            break;
          }
      }

    queryStr = queryStr.substring(0, queryStr.length - 4)
    queryStr += ' AND ';
  }
  queryStr += ' pays.id = etu.pays AND spe.idSpecialite = etu.specialite AND etat.idEtat = etu.etat';

  console.log(queryStr, Object.values(urlQuery))

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

app.post('/postData/updateStudent', (req, res) => {


  const student = Etudiant.create(req.body);
  console.log("student " + student.nom);

  let dateD1 = student.dateDebut.toString().replace('T', ' ');
  let dateD2 = dateD1.replace('Z', '');

  let dateF1 = student.dateDebut.toString().replace('T', ' ');
  let dateF2 = dateF1.replace('Z', '');



  let params = [student.nom, student.prenom, student.promo, student.specialite.idSpecialite, student.commentaire, student.etat.idEtat, student.semainesRestantes, student.typeValidation, dateD2, dateF2, student.pays.idPays, student.obtenuVia, student.mail, student.annee, student.idEtudiant];
  //res.status(201).json(ticket);

  //res.status(200).json(SchoolTicket.update(req.params.schoolTicketId, req.body));

  /*let student = Etudiant.create(req.body);
  const updatedItem = Object.assign({}, req.body);
  console.log("test : "+student);
  console.log("test : "+updatedItem);*/
  con.query("UPDATE `renkinjutsushi`.`etudiant` SET `nom` = ?, `prenom` = ?, `promo` = ?, `specialite` = ?, `commentaire` = ?, `etat` = ?, `semainesRestantes` = ?, `typeValidation` = ?, `dateDebut` = ?, `dateFin` = ?, `pays` = ?, `obtenuVia` = ?, `mail` = ?, `annee` = ? WHERE (`idEtudiant` = ?);\n\n\n", params,
    function (err, result, fields) {
      if (err) {
        console.log('Error 2.2 =\n', err);
      } else {
        res.status(201).json(result);
      }
    });
});


/*router.put('/:schoolTicketId', (req, res) => {
  try {
    res.status(200).json(SchoolTicket.update(req.params.schoolTicketId, req.body));
  } catch (err) {
    if (err.name === 'NotFoundError') {
      res.status(404).end();
    } else if (err.name === 'ValidationError') {
      res.status(400).json(err.extra);
    } else {
      res.status(500).json(err);
    }
  }
})*/

app.listen(3000)

console.log('Starting...')
console.log('http://localhost:3000/');
console.log('http://localhost:3000/getData');
console.log("Saaba-sama wa sanzen no pooto o kiiteru..");
console.log('#############################')
