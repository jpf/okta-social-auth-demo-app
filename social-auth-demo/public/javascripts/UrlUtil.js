function parseQuery(query) {
  var params = {};
  var pairs = decodeURIComponent(query.replace(/\+/g, ' ')).split('&');
  for (var i = 0; i < pairs.length; i++) {
  	var pair = pairs[i];
  	var data = pair.split('=');
  	params[data.shift()] = data.join('=');
  }
  return params;
}