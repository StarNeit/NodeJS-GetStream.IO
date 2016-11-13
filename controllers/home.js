/**
 * GET /
 * Home page.
 */
const stream = require('getstream');
const client = stream.connect('243aky6924yp', 'xmkpjggbwu9agzqzvkhax67uj7he9h7bwae68m4nyzsyhjcv6zjfq4ykc7jn355d');

exports.index = (req, res) => {
	userId = req.user._id;

	var user1 = client.feed('user', userId);
	user1.get({limit:100, offset:0})
		.then(function(successData){
			console.log(successData);
			res.render('home', {
				timeline: successData.results,
				uploaded_file: req.session['uploaded_file']
			})
		}).catch(function(reason){
			console.log('retrieving data error:' + reason);
			res.render('home', {
			    title: 'Home',
				uploaded_file: req.session['uploaded_file']
			  });
		});
};

/**
 * POST /
 * Post newsfeed.
 */
exports.postFeed = (req, res, next) => {
  req.assert('feed_text', 'Feed content cannot be blank').notEmpty();
  req.assert('_csrf', 'Your session is ended, please login again.').notEmpty();
  
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/');
  }

  userId = req.body.userId;
  userName = req.body.userName;
  email = req.body.email;
  feed_text = req.body.feed_text;
  token = req.body._csrf;
  userImage = req.body.userImage;
  feedImage = req.body.feedImage;

  console.log('userId:' + userId);
  console.log('feed text:' + feed_text);
  console.log('token:' + token);

	var user1 = client.feed('user', userId);
	// Add activity; message is a custom field - tip: you can add unlimited custom fields!
	user1.addActivity({
	  actor: userId,
	  verb: 'add',
	  object: 'text:'+userId,
	  message: feed_text,
	  username: userName,
	  userImage: userImage,
	  email: email,
	  feedImage: feedImage
	}).then(function(data){
		console.log(data);
	}).catch(function(reason){
		console.log(reason);
	});

	req.session['uploaded_file'] = "";
  	res.redirect('/')
};