var debug = ''; 

// This uses CORS, to learn more about CORS visit:
// http://developer.okta.com/docs/api/getting_started/enabling_cors.html
var baseUrl = 'https://jfranusic.oktapreview.com';
$.ajax({
  url: baseUrl + '/api/v1/users/me',
  type: 'GET',
  xhrFields: { withCredentials: true },
  accept: 'application/json'
}).done(function(data) {
    // assign the result to the global 'debug' variable so that you can
    // inspect it via the developer console in your web browser
    debug = data;
    $('#userDisplayName').html("User name: " + data.profile.displayName);
    $('#userId').html("User ID: " + data.id);
})
.fail(function(xhr, textStatus, error) {
  var title, message;
  switch (xhr.status) {
    case 403 :
      title = xhr.responseJSON.errorSummary;
      message = 'Please login to your Okta organization before running the test';
      break;
    default :
      title = 'Invalid URL or Cross-Origin Request Blocked';
      message = 'You must explictly add this site (' + window.location.origin + ') to the list of allowed websites in your Okta Admin Dashboard';
      break;
  }
  alert(title + ': ' + message);
});

window.addEventListener('message', function (event) {
  if(event.origin !== 'http://localhost:3000') {
    return;
  }
    
  if (window.location.href && window.location.href.indexOf('idpUserId') > -1) {
    event.source.postMessage('close:window', event.origin);
  } else if (window.location.href && window.location.href.indexOf('txId') > -1) {
    event.source.postMessage('complete:transaction url:' + window.location.href, event.origin);
  } else {
    event.source.postMessage('incomplete');
  }
}, false);
