var express = require('express');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  var localStorage = new LocalStorage('./database');
}

var router = express.Router();

router.get('/', function(req, res, next) {

  res.render('admin', {
  	'redirectURI': localStorage.getItem('redirectURI'),
  	'facebookLoginUrl': localStorage.getItem('facebookLoginUrl'),
  	'googleLoginUrl': localStorage.getItem('googleLoginUrl')
  });
});

router.post('/', function(req, res, next) {
  localStorage.setItem('redirectURI', req.body.redirectURI);
  localStorage.setItem('facebookLoginUrl', req.body.facebookLoginUrl);
  localStorage.setItem('googleLoginUrl', req.body.googleLoginUrl);
  res.render('admin', {message: 'Settings Saved!',
  	'redirectURI': req.body.redirectURI,
  	'facebookLoginUrl': req.body.facebookLoginUrl,
  	'googleLoginUrl': req.body.googleLoginUrl})
}); 

module.exports = router;
