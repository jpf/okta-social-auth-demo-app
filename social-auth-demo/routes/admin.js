var express = require('express');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  var localStorage = new LocalStorage('./database');
}

var router = express.Router();

router.get('/', function(req, res, next) {

  res.render('admin', {
        'oktaOrgUrl': localStorage.getItem('oktaOrgUrl'),
        'oktaToken': localStorage.getItem('oktaToken'),
  	'redirectUri': localStorage.getItem('redirectUri')
  });
});

router.post('/', function(req, res, next) {
    localStorage.setItem('oktaOrgUrl', req.body.oktaOrgUrl);
    localStorage.setItem('oktaToken', req.body.oktaToken);
    localStorage.setItem('redirectUri', req.body.redirectUri);
    res.render('admin', {
	message: 'Settings Saved!',
  	'oktaOrgUrl': req.body.oktaOrgUrl,
        'oktaToken': req.body.oktaToken,
  	'redirectUri': req.body.redirectUri
    })
}); 

module.exports = router;
