var express = require('express');
var router = express.Router();

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  var localStorage = new LocalStorage('./database');
}

router.get('/', function(req, res, next) {
    var readonly = false;
    var oktaOrgUrl = localStorage.getItem('oktaOrgUrl')
    if (process.env.OKTA_URL) {
	readonly = true;
	oktaOrgUrl = process.env.OKTA_URL;
    }
  res.render('admin', {
        'oktaOrgUrl': oktaOrgUrl,
        'oktaToken': localStorage.getItem('oktaToken'),
  	'popup': localStorage.getItem('popup'),
        'redirectUri': localStorage.getItem('redirectUri'),
        'readonly': readonly
  });
});

router.post('/', function(req, res, next) {
    localStorage.setItem('oktaOrgUrl', req.body.oktaOrgUrl);
    localStorage.setItem('oktaToken', req.body.oktaToken);
    localStorage.setItem('redirectUri', req.body.redirectUri);
    if (!req.body.popup) {
	req.body.popup = "off";
    }
    localStorage.setItem('popup', req.body.popup);
    res.render('admin', {
	message: 'Settings Saved!',
  	'oktaOrgUrl': req.body.oktaOrgUrl,
        'oktaToken': req.body.oktaToken,
  	'popup': req.body.popup,
  	'redirectUri': req.body.redirectUri
    })
});

module.exports = router;
