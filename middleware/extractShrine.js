const Shrine = require('../models/Shrine');

module.exports = (req, res, next) => {
  console.log(req.subdomains);
	return next();
};
