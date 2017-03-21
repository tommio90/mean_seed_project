var express = require('express');
var router = express.Router();
var _ =require('underscore');

var db = require('../db.js');
var middleware = require('../middleware.js')(db);


router.get('/',middleware.requireAuthentication, function (req, res, next) {
//   var where = {
// 		userId: req.user.get('id')
// 	};
    db.message.findAll({
		// where : where
		include: [db.user]
	}).then(function(messages){
		console.log(messages);
        res.status(200).json({
                    message: 'Success',
                    obj: messages
                });
    }).catch(function (err) {
         return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
    }); 
            
});

router.post('/',middleware.requireAuthentication, function (req, res, next) {

        // var body = req.body.content
		var body = _.pick(req.body, 'content');
       
        db.message.create(body).then(function(message){

			req.user.addMessage(message).then(function () {
			return message.reload();
		}).then(function (message) {
			db.user.findOne({where: {
				id : message.dataValues.userId
			}}).then(function(user){
				var send ={user , message};
				console.log(send);
					res.status(200).json({
						message: 'Saved message',
						obj: send
					})
				})
			})
        }).catch(function (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
        });
    });
});



router.patch('/:id', middleware.requireAuthentication, function(req, res) {
	var itemId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'content');
	var attributes = {};

	if (body.hasOwnProperty('content')) {
		attributes.content = body.content;
	}

	db.message.findOne({
		where: {
			id: itemId
			// userId: req.user.get('id')
		}
	}).then(function(msg) {
		
		if (msg) {
			msg.update(attributes).then(function(msg) {
				res.json(msg.toJSON());
			}, function(e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).json({
                title: 'No Message Found!',
                error: {message: 'Message not found'}
            });
	});
});

router.delete('/:id',middleware.requireAuthentication, function(req, res, next) {
	var itemId = parseInt(req.params.id, 10);

db.message.destroy({
		where: {
			id: itemId,
			
		}
}).then(function(rowsDeleted){

	if (rowsDeleted === 0) {
		return	res.status(404).json({
				error: 'No message with id'
			});
		
			res.status(204).json({
                message: 'Deleted message',
                obj: result
            });
		}
	}, function() {
		res.status(500).send();
	});
});
 


module.exports = router;