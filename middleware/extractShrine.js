const Shrine = require('../models/Shrine');

module.exports = (req, res, next) => {
	const firstSub = req.subdomains[0];

	return Shrine.find({ subdomain: firstSub }, (err, docs) => {
		if (err) return res.status(503).send("DB down or something lol");

		if (docs.length === 0) return res.redirect('/manage');

		req.shrines = docs;

		return next();
	});
};
