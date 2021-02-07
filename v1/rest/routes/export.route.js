const express = require('express'),
	router = express.Router({
		mergeParams: true
	}),
	{ check, param } = require('express-validator'),
	validator = require('../../../utilities/validator.util'),
	messages = require('../../../com/constants/messages'),
	logger = require('../../../logs/winston');

router.get('/:id',
	[
		param('id')
			.exists()
			.withMessage(messages.api.export.idRequired)
			.trim()
	],
	(req, res, next) => {
		if (validator.validate(req, res)) {
			// return articleHandler.getArticleDetails(articleId)
			// 	.then((response) => {
			// 		logger.info(`${messages.api.article.respondingContent} ${req.params.articleId}`);
			// 		res.status(200).json(response);
			// 	})
			// 	.catch(err => {
			// 		next(err);
			// 	});
		}
	});


module.exports = router;