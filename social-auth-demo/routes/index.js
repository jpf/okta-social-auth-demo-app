var express = require('express');
var router = express.Router();

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  var localStorage = new LocalStorage('./database');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var redirectUri = localStorage.getItem('redirectURI')
  res.render('index', {
  	'oktaFacebookLoginUrl': localStorage.getItem('facebookLoginUrl') + '?redirect_uri=' + redirectUri,
  	'oktaGoogleLoginUrl': localStorage.getItem('googleLoginUrl') + '?redirect_uri=' + redirectUri
  });
});

router.get('/social_auth_processing', function(req, res, next) {
  res.render('social_auth_processing');
});

module.exports = router;
