var express = require('express');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  var localStorage = new LocalStorage('./database');
}
var router = express.Router();

var info = '';

var request = require('request');
var oktaBaseUrl = process.env.OKTA_URL || localStorage.getItem('oktaOrgUrl');
var oktaToken = process.env.OKTA_TOKEN || localStorage.getItem('oktaToken');


function get_idps_from_okta(res, viewLocals) {
    var request_options = {
	url: oktaBaseUrl + '/api/v1/idps',
	headers: {
	    'Authorization': 'SSWS ' + oktaToken
	}
    };

    if (oktaBaseUrl && oktaToken) {
	request(request_options, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
		var identityProvidersFound = JSON.parse(body);
		var identityProviders = [];
		console.log(identityProvidersFound);
		identityProvidersFound.forEach(function(idp) {
		    console.log(idp);
		    if ("protocol" in idp && "type" in idp.protocol && idp.protocol.type == "OAUTH2") {
			identityProviders.push(idp)
		    }
		});
		viewLocals['identityProviders'] = identityProviders;
		res.render('index', viewLocals);
	    }
	})
    } else {
	res.render('index', viewLocals);
    }
}

function get_client_id_from_okta(res, viewLocals) {
    var request_options = {
	url: oktaBaseUrl + '/api/v1/clients',
	headers: {
	    'Authorization': 'SSWS ' + oktaToken
	}
    };

    request(request_options, function (error, response, body) {
	if (!error && response.statusCode == 200) {
	    var oauthClientsFound = JSON.parse(body);
	    var redirectUri = viewLocals['redirectUri']
	    var oauthClients = [];
	    console.log("Clients found");
	    console.log(oauthClientsFound);
	    oauthClientsFound.forEach(function(client) {
		if ("redirect_uris" in client && client["redirect_uris"].indexOf(redirectUri) > -1) {
		    console.log(client.client_id);
		    viewLocals['clientId'] = client.client_id;
		}
	    });
	    get_idps_from_okta(res, viewLocals);
	}
    })
}

/* GET home page. */
// FIXME: Run this on every request
router.get('/', function(req, res, next) {
    var protocol = req.secure ? 'https' : 'http'
    protocol = 'https' // Force to https for now
    var server_name = req.headers.host;
    var redirectUri = protocol + '://' + server_name + '/social_auth_processing';

    var viewLocals = {
	'info': info,
	'identityProviders': [],
  	'popup': localStorage.getItem('popup'),
	'clientId': 'FzuJH9jQXZ5oc4NJ37pi',
	'redirectUri': redirectUri
    }
    get_client_id_from_okta(res, viewLocals);
});


router.get('/social_auth_processing', function(req, res, next) {
    var error = req.query['error_description'];
    var userId = req.query['user_id'];
    var request_options = {
	url: oktaBaseUrl + '/api/v1/users/' + userId,
	headers: {
	    'Authorization': 'SSWS ' + oktaToken
	}
    };

    if (oktaBaseUrl && oktaToken) {
	request(request_options, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
		var user = JSON.parse(body);
		var displayName = user.profile.displayName;
		res.render('social_auth_processing', {
		    'displayName': displayName,
		    'userId': userId,
		    'error': error
		});
	    }
	})
    } else {
	res.render('social_auth_processing', {
	    'unconfigured': true
	});
    }
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
