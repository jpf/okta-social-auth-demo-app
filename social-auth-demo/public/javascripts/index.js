// var debug = ''; 

// // This uses CORS, to learn more about CORS visit:
// // http://developer.okta.com/docs/api/getting_started/enabling_cors.html
// var baseUrl = 'https://jfranusic.oktapreview.com';
// $.ajax({
//     url: baseUrl + '/api/v1/users/me',
//     // url: baseUrl + '/api/v1/idps',
//     type: 'GET',
//     xhrFields: { withCredentials: true },
//     accept: 'application/json'
// }).done(function(data) {
//     // assign the result to the global 'debug' variable so that you can
//     // inspect it via the developer console in your web browser
//     debug = data;
//     $('#userDisplayName').html("User name: " + data.profile.displayName);
//     $('#userId').html("User ID: " + data.id);
// })
// .fail(function(xhr, textStatus, error) {
//     var title, message;
//     switch (xhr.status)
//     {
//     case 403 :
// 	title = xhr.responseJSON.errorSummary;
// 	message = 'Please login to your Okta organization before running the test';
// 	break;
//     default :
// 	title = 'Invalid URL or Cross-Origin Request Blocked';
// 	message = 'You must explictly add this site (' + window.location.origin + ') to the list of allowed websites in your Okta Admin Dashboard';
// 	break;
//     }
//   alert(title + ': ' + message);
// });
