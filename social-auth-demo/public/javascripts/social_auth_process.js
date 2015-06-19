/* process the idpUserId */
if (window.location.href && window.location.href.indexOf('idpUserId') > -1) {
  $('#idpUserId').html('Your userId is: ' + getURIParams('idpUserId'));
}

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