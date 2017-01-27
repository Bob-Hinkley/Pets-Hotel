var express = require("express");
var router = express.Router();

var pg = require("pg");

var config = { database: "pets_hotel" };

// initialize connection Pool
// think of as 'how I connect to DB'
var pool = new pg.Pool(config);

router.get("/", function(req, res) {
  // err - an error object, will be non-null if there was some error
  //       connecting to the DB. ex. DB not running, config is incorrect
  // client - used to make actual queries against DB
  // done - function to call when we are finished
  //        returns the connection back to the pool
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Error connecting to DB", err);
      res.sendStatus(500);
      done();
    } else {
      // no error occurred, time to query
      // 1. sql string - the actual SQL query we want to running
      // 2. array of data - any data we want to pass to a parameterized statement
      // 3. callback - function to run after the database gives us our result
      //               takes an error object and the result object as it's args
      client.query(
        "SELECT * FROM pets JOIN visits ON pets.id = visits.pets_id WHERE check_in IS NOT NULL ORDER BY check_out DESC",
        function(err, result) {
          done();
          if (err) {
            console.log("Error querying DB", err);
            res.sendStatus(500);
          } else {
            console.log("Got info from DB", result.rows);
            res.send(result.rows);
          }
        }
      );
    }
  });
});



router.put('/in/:id', function(req, res){
  console.log(req.body);
  pool.connect(function(err, client, done){
    if(err) {
      console.log("Error connecting to DB: ", err);
      res.sendStatus(500);
      done();
    } else {
      client.query('UPDATE visits SET check_in=$1 WHERE pets_id = $2 AND check_out IS NULL RETURNING *',
        [req.body.date, req.params.id], function(err, result){
        done();
        if (err) {
          console.log("Error deleting from DB: ", err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      })
    }

  });
});

router.put('/out/:id', function(req, res){
  console.log(req.body);
  pool.connect(function(err, client, done){
    if(err) {
      console.log("Error connecting to DB: ", err);
      res.sendStatus(500);
      done();
    } else {
      client.query('UPDATE visits SET check_out=$1 WHERE pets_id = $2 AND check_out IS NULL RETURNING *',
        [req.body.date, req.params.id], function(err, result){
        done();
        if (err) {
          console.log("Error deleting from DB: ", err);
          res.sendStatus(500);
        } else {
          client.query(
            "INSERT INTO visits (pets_id) VALUES ($1) RETURNING *;",
            [result.rows[0].pets_id],
            function(err, result) {
              if (err) {
                console.log("Error querying DB", err);
                res.sendStatus(500);
              } else {
                console.log("Got info from DB", result.rows);
                res.sendStatus(204);

              }
            }
          );
        }
      })
    }

  });
});

module.exports = router;
