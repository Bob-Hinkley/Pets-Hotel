var express = require("express");
var router = express.Router();

var pg = require("pg");

var config = { database: "pets_hotel" };

// initialize connection Pool
// think of as 'how I connect to DB'
var pool = new pg.Pool(config);


router.put('/:id', function(req, res){
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



module.exports = router;
