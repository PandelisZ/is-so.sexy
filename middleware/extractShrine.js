const Shrine = require('../models/Shrine');

module.exports = (req, res, next) => {
	const firstSub = req.subdomains[0];

	return Shrine.findOne({ subdomain: firstSub }, (err, doc) => {
		if (err) return res.status(503).send("DB down or something lol");

		if (!doc & firstSub !== undefined) return res.redirect('/generator');

		req.shrine = doc;

		return next();
	});
};
