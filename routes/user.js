var mongoose = require('mongoose'),
    User = mongoose.model('User');

// GET user creation form
exports.create = function(req, res){
  console.log("in user.create function");
  res.render('user-form', {
    title: 'Create user',
    buttonText: "Join!"
  });
};

// POST new user creation form
exports.doCreate = function(req, res){
  User.create({
    name: req.body.FullName,
    email: req.body.Email,
    modifiedOn : Date.now(),
    lastLogin : Date.now()
  }, function( err, user ){
    if(!err){
      // Success
      console.log("User created and saved: " + user);
      req.session.user = { "name" : user.name, "email": user.email, "_id": user._id };
      req.session.loggedIn = true;
      res.redirect( '/user' );
    }
    else{
      console.error(err);
      if(err === 11000) {
        res.redirect( '/user/new?exists=true' );
      }
      else {
        res.redirect('/?error=true');
      }
    }
  });

};

// GET logged in user page
exports.index = function (req, res) {
  if(req.session.loggedIn == true){
    res.render('user-page', {
      title: req.session.user.name,
      name: req.session.user.name,
      email: req.session.user.email,
      userID: req.session.user._id
    })
  }else{
    console.log("not logged in please login");
    res.redirect('/login');
  }
}

// GET login page
exports.login = function (req, res) {
  res.render('login-form', {title: 'Log in'})
}

// POST login page
exports.doLogin = function (req, res) {
  if (req.body.Email) {
    User.findOne({'email' : req.body.Email}, '_id name email', function(err, user) {
        if (!err) {
          if (!user){
            res.redirect('/login?404=user');
          }else{
            req.session.user = {
              "name" : user.name,
              "email": user.email,
              "_id": user._id
            };
            req.session.loggedIn = true;
            console.log('Logged in user: ' + user);
              res.redirect( '/user' );
          }
        } else {
        res.redirect('/login?404=error');
      }
    });
  }
  else {
    res.redirect('/login?404=error');
  }
};
