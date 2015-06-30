function popup(url) {
  var childWindow = open(url, '_blank');
  addEventListener('message', function (event) {
    if (event.data.indexOf('close:window') > -1) {
      childWindow && childWindow.close();
    } else if (event.data.indexOf('complete:authentication url:') > -1) {
    //we got a transaction id back, so we have to do the transaction in a child window
    var url = event.data.substring(25);
    var params = parseQuery(url.split('?')[1] || '');

    childWindow && childWindow.close();
      //this.completeSocialAuthTransaction(params['txId']);
    }
    //TODO: check event.data.indexOf('error:authentication url:') and display an error message.
    }, false);

  _.delay(_.bind(this._pollWindow, this), 500, childWindow);
}

function _pollWindow (window) {
  window.postMessage('check', 'http://localhost:3000');
  if (window) {
    _.delay(_.bind(this._pollWindow, this), 500, window);
  }
}