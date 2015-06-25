var express = require('express');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  var localStorage = new LocalStorage('./database');
}
var router = express.Router();

var info = '';

var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
    var oktaBaseUrl = localStorage.getItem('oktaOrgUrl');
    var oktaToken = localStorage.getItem('oktaToken');
    var redirectUri = localStorage.getItem('redirectUri');
    var viewLocals = {
	'info': info,
	'identityProviders': [],
	'redirectUri': redirectUri,
  	'popup': localStorage.getItem('popup'),
	'hello': "Hello World"
    }
    
    if (!redirectUri) {
	redirectUri = 'http://localhost:3000/social_auth_processing';
	localStorage.setItem('redirectUri', redirectUri);
    }
    var request_options = {
	url: oktaBaseUrl + '/api/v1/idps',
	headers: {
	    'Authorization': 'SSWS ' + oktaToken
	}
    };

    if (oktaBaseUrl && oktaToken) {
	request(request_options, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
		viewLocals['identityProviders'] = JSON.parse(body);
		res.render('index', viewLocals);
	    }
	})
    } else {
	res.render('index', viewLocals);
    }
});


router.get('/social_auth_processing', function(req, res, next) {
  res.render('social_auth_processing');
});

module.exports = router;
