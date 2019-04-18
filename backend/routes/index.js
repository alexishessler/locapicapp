var express = require('express');
var router = express.Router();

var passport = require('passport');
var UserModel = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// router.get('/auth/facebook',
//   passport.authenticate('facebook', { scope: 'email', state: JSON.stringify(req.query) })
// );

router.get('/auth/facebook',
  function(req,res,next){
      //console.log('/auth/facebook', req.query.redirectUrl);
      passport.authenticate(
          'facebook', { scope : 'email', state: JSON.stringify(req.query) }
      )(req,res,next);
  }
)

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { session: false }),


  function(req, res) {
    console.log(req.user.redirectUrl);
    console.log(req.user.first_name);

    res.redirect(req.user.redirectUrl+"?facebookid="+req.user.id
      +"&firstName="+req.user.first_name
      +"&lastName="+req.user.last_name
      +"&email="+req.user.email
      +"&picture="+encodeURIComponent(req.user.picture.data.url));
  }
);

router.post('/logPosition', function(req, res) {
      UserModel.findOne({facebookid : req.body.facebookid}, function(err, user) {
        if(user){

           user.historiquePosition.push({latitude: req.body.latitude, longitude: req.body.longitude});
           user.save();
           res.json({result: true});
        }
      })
  }
);

router.get('/logPosition', function(req, res){
  UserModel.findOne({facebookid : req.query.facebookid}, function(err, user) {
     if(user) {
      res.json({historiquePosition : user.historiquePosition});
    } else {
      res.json({historiquePosition: []});
    }
  })
}
)

module.exports = router;
