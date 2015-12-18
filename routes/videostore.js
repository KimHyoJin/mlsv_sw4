var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/videostore', function(req, res, next) {
  res.render('videostore', { title: 'Express' });
});


module.exports = router;
