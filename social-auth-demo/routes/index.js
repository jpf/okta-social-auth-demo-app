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
  	'popup': localStorage.getItem('popup')
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
    var error = req.query['error_description']
    res.render('social_auth_processing', {
	'error': error,
	'oktaBaseUrl': localStorage.getItem('oktaOrgUrl')
    });
});

router.get('/social_auth_tx_processing', function(req, res, next) {
  var oktaBaseUrl = localStorage.getItem('oktaOrgUrl');
    var oktaToken = localStorage.getItem('oktaToken');
    var viewLocals = {
	'targetUserResponse': []
    }

  localStorage.setItem('txId', req.query['txId'])

  var request_options = {
    url: oktaBaseUrl + '/api/v1/idps/tx/' + req.query['txId'] + '/target',
    headers: {
      'Authorization': 'SSWS ' + oktaToken
    }
  };

  if (oktaBaseUrl && oktaToken) {
    request(request_options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
	  viewLocals['targetUserResponse'] = JSON.parse(body);
	  res.render('social_auth_tx_processing', viewLocals);
      }
    });
  } else {
  	//todo: add error handling
    res.render('index', viewLocals);
  } 
});

router.post('/social_auth_tx_processing', function(req, res, next) {
  var oktaBaseUrl = localStorage.getItem('oktaOrgUrl');
  var oktaToken = localStorage.getItem('oktaToken');
    
  var request_options = {
    url: oktaBaseUrl + '/api/v1/idps/tx/' + localStorage.getItem('txId') + '/lifecycle/jit/',
    headers: {
      'Authorization': 'SSWS ' + oktaToken
    }
  };

  var jsonBody = JSON.stringify(req.body);
  var jsonPostBody = {'profile': req.body}
  console.log(jsonPostBody)

  if (oktaBaseUrl && oktaToken) {
    request({
    	method: 'POST',
    	url: oktaBaseUrl + '/api/v1/idps/tx/' + localStorage.getItem('txId') + '/lifecycle/jit/',
      headers: {
        'Authorization': 'SSWS ' + oktaToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    	body: jsonPostBody,
    	json: true
    },
      function (error, response, body) {
        console.log(JSON.stringify(error));
          console.log(JSON.stringify(response));
        if (!error && response.statusCode == 200) {
	    res.render('complete', {});
        }
      }
    );
  } else {
    res.render('complete', {});
  } 
  res.render('complete', {});
});

module.exports = router;
