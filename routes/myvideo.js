var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/myvideo', function(req, res, next) {
  res.render('myvideo', { title: 'Express' });
});


module.exports = router;
