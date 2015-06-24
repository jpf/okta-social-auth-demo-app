var express = require('express');
var router = express.Router();

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  var localStorage = new LocalStorage('./database');
}

router.get('/', function(req, res, next) {

  res.render('admin', {
  	'redirectURI': localStorage.getItem('redirectURI'),
  	'facebookLoginUrl': localStorage.getItem('facebookLoginUrl'),
  	'googleLoginUrl': localStorage.getItem('googleLoginUrl'),
  	'popup': localStorage.getItem('popup'),
  	'apiToken': localStorage.getItem('apiToken'),
  	
  });
});

router.post('/', function(req, res, next) {
  localStorage.setItem('redirectURI', req.body.redirectURI);
  localStorage.setItem('facebookLoginUrl', req.body.facebookLoginUrl);
  localStorage.setItem('googleLoginUrl', req.body.googleLoginUrl);
  if (!req.body.popup) {
  	req.body.popup = "off";
  }
  localStorage.setItem('popup', req.body.popup);
  localStorage.setItem('apiToken', req.body.apiToken);
  res.render('admin', {message: 'Settings Saved!',
  	'redirectURI': req.body.redirectURI,
  	'facebookLoginUrl': req.body.facebookLoginUrl,
  	'googleLoginUrl': req.body.googleLoginUrl,
  	'popup': req.body.popup,
  	'apiToken': req.body.apiToken,
  })
}); 

module.exports = router;
