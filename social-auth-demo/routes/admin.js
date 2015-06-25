var express = require('express');
var router = express.Router();

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  var localStorage = new LocalStorage('./database');
}

router.get('/', function(req, res, next) {

  res.render('admin', {
        'oktaOrgUrl': localStorage.getItem('oktaOrgUrl'),
        'oktaToken': localStorage.getItem('oktaToken'),
  	'popup': localStorage.getItem('popup'),
  	'redirectUri': localStorage.getItem('redirectUri')
  });
});

router.post('/', function(req, res, next) {
    localStorage.setItem('oktaOrgUrl', req.body.oktaOrgUrl);
    localStorage.setItem('oktaToken', req.body.oktaToken);
    localStorage.setItem('redirectUri', req.body.redirectUri);
    if (!req.body.popup) {
	req.body.popup = "off";
    }
    res.render('admin', {
	message: 'Settings Saved!',
  	'oktaOrgUrl': req.body.oktaOrgUrl,
        'oktaToken': req.body.oktaToken,
  	'popup': req.body.popup,
  	'redirectUri': req.body.redirectUri
    })
});

module.exports = router;
