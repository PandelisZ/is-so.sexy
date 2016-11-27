const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
const Shrine = require('../models/Shrine');

/**
 * GET /
 * Main shrine page.
 */
exports.getShrine = (req, res) => {
  // Assume single shrine is in req
  res.send("BANTER");
  banter = {
  	"name" : "Matt",
  	"description" : "test",
  	"subdomain" : "test",
  	"owner" : "583a1483fdbef6203317b176",
  	"images" : [
  		"c0512597c7b392dc67b887b8825dd389",
  		"cfe2a3a40070d7d9978785c6c89af321"
    ]
  };
  console.log(banter);
  // res.render('home', {
  //   // ensure home is setup to display stuff
  //   title: 'Login'
  // });
};
