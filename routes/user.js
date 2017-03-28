
module.exports = function(app) { 


		var express = require('express');
		var router = express.Router();
		var _ =require('underscore');

		var db = require('../db.js');
		var middleware = require('../middleware.js')(db);
		var bcrypt = require('bcryptjs');





			app.io.on('connect', onConnect);
				function onConnect(socket){
  					console.log('a user connected');
				};

		//POST/ users 
		//users sign up
		router.post('/', function (req, res) {
			var body = _.pick(req.body, 'email', 'password');

			db.user.create(body).then(function (user) {
				res.status(200).json(user.toPublicJSON());
				
			
			}, function (err) {
				res.status(500).json({
		                title: 'An error occurred',
		                error: err
		            });
			});
		});



		// POST /users/signin
		router.post('/signin', function ( req, res, next) {
			console.log('inside the signin')
			var body = _.pick(req.body, 'email', 'password');
			var userInstance;
			db.user.authenticate(body).then(function (user) {
				var token = user.generateToken('authentication');
				userInstance = user;

				return db.token.create({
					token: token
				});
			}).then(function (tokenInstance) {
				 res.status(200).json({
		            message: 'Successfully logged in',
		            token: tokenInstance.dataValues.token,
		            userId: userInstance.dataValues.id,
					userName: userInstance.dataValues.email
		        });
			
			}).catch(function (err) {
				
				res.status(401).json({
					title : 'Unauthorized',
					error : {
						message: 'Authentication failed, email and/or password are incorrect!'
					}
				});
			}, function (err) {
				res.status(500).json({
		                title: 'An error occurred',
		                error: err
		            });
			});



		});

		router.get('/signout',middleware.requireAuthentication, function(req,res){
			var test = req.query.token;
			req.token.destroy().then(function () {
				res.status(204).json({
					message: 'Successfully logged out!'
				});
			}).catch(function () {
					res.status(500).json({
		                title: 'An error occurred',
		                error: err
		            });
			});
		})




		return router;

	};




