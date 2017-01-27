var express = require("express");
var router = express.Router();

var pg = require("pg");

var config = { database: "pets_hotel" };

// initialize connection Pool
// think of as 'how I connect to DB'
var pool = new pg.Pool(config);

// router.get("/", function(req, res) {
//   // err - an error object, will be non-null if there was some error
//   //       connecting to the DB. ex. DB not running, config is incorrect
//   // client - used to make actual queries against DB
//   // done - function to call when we are finished
//   //        returns the connection back to the pool
//   pool.connect(function(err, client, done) {
//     if (err) {
//       console.log("Error connecting to DB", err);
//       res.sendStatus(500);
//       done();
//     } else {
//       // no error occurred, time to query
//       // 1. sql string - the actual SQL query we want to running
//       // 2. callback - function to run after the database gives us our result
//       //               takes an error object and the result object as it's args
//       client.query("SELECT * FROM books ORDER BY title;", function(err, result) {
//         done();
//         if (err) {
//           console.log("Error querying DB", err);
//           res.sendStatus(500);
//         } else {
//           console.log("Got info from DB", result.rows);
//           res.send(result.rows);
//         }
//       });
//     }
//   });
// });

router.post("/", function(req, res) {
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
        "INSERT INTO pets (name, color, breed, owner_id) VALUES ($1, $2, $3, $4) RETURNING *;",
        [req.body.pet_name, req.body.pet_color, req.body.pet_breed, req.body.owner_id],
        function(err, result) {
          if (err) {
            done();
            console.log("Error querying DB", err);
            res.sendStatus(500);
          } else {
            done();
            // console.log("Result.rows.id: " , result.rows[0].id);
            client.query(
              "INSERT INTO visits (pets_id) VALUES ($1) RETURNING *;",
              [result.rows[0].id],
              function(err, result) {
                if (err) {
                  console.log("Error querying DB", err);
                  res.sendStatus(500);
                } else {
                  console.log("Got info from DB", result.rows);

                }
              }
            );

            console.log("Got info from DB", result.rows);
            res.sendStatus(204);
          }
        }
      );
    }
  });
});

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
        "SELECT * FROM owners JOIN pets ON owners.id = pets.owner_id LEFT JOIN visits ON pets.id = visits.pets_id WHERE check_out IS NULL;",
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

router.delete('/:id', function(req, res){
  pool.connect(function(err, client, done){
    if(err) {
      console.log("Error connecting to DB: ", err);
      res.sendStatus(500);
      done();
    } else {
      client.query('DELETE FROM visits WHERE pets_id = $1', [req.params.id], function(err, result){
        if (err) {
          done();
          console.log("Error deleting from DB: ", err);
          res.sendStatus(500);
        } else {

          client.query('DELETE FROM pets WHERE id = $1', [req.params.id], function(err, result){
            done();
            if (err) {
              console.log("Error deleting from DB: ", err);
              res.sendStatus(500);
            } else {
              res.sendStatus(204);
            }
          })

        }
      })

    }

  });
});

router.put('/:id', function(req, res){
  console.log(req.body, "req.body PUT");
  pool.connect(function(err, client, done){
    if(err) {
      console.log("Error connecting to DB: ", err);
      res.sendStatus(500);
      done();
    } else {
      client.query('UPDATE pets SET name=$2, breed=$3, color=$4 WHERE id = $1 RETURNING *',
        [req.params.id, req.body.name, req.body.breed, req.body.color], function(err, result){
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

//
// //localhost:3000/books/4
// router.put('/:id', function(req, res){
//   console.log(req.body);
//   pool.connect(function(err, client, done){
//     if(err) {
//       console.log("Error connecting to DB: ", err);
//       res.sendStatus(500);
//       done();
//     } else {
//       client.query('UPDATE books SET title=$2, author=$3, publication_date=$4, edition=$5, publisher=$6 WHERE id = $1 RETURNING *',
//         [req.params.id, req.body.title, req.body.author, req.body.published, req.body.edition, req.body.publisher], function(err, result){
//         done();
//         if (err) {
//           console.log("Error deleting from DB: ", err);
//           res.sendStatus(500);
//         } else {
//           res.send(result.rows);
//         }
//       })
//     }
//
//   });
// });
//
// router.delete('/:id', function(req, res){
//   pool.connect(function(err, client, done){
//     if(err) {
//       console.log("Error connecting to DB: ", err);
//       res.sendStatus(500);
//       done();
//     } else {
//       client.query('DELETE FROM books WHERE id = $1', [req.params.id], function(err, result){
//         done();
//         if (err) {
//           console.log("Error deleting from DB: ", err);
//           res.sendStatus(500);
//         } else {
//           res.sendStatus(204);
//         }
//       })
//     }
//
//   });
// });




module.exports = router;
