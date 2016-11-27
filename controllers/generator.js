const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
const Shrine = require('../models/Shrine');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: path.join(__dirname, '../uploads') }).array('images');

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * GET /generator
 * Profile page.
 */
exports.newShrine = (req, res) => {
  res.render('generator/create', {
    title: 'Create a new Shrine'
  });
};

/**
 * POST /generator/create
 * Update profile information.
 */
exports.createShrine = (req, res, next) => {
console.log(req.user.id)
  upload(req, res, (err) => {

    if(err){
      console.log('shit done fucked mate')

      return
    }

    console.log('upload successfull')

    let files = req.files.map(f => f.filename);

    const shrine = new Shrine({
      name: req.body.name,
      description: req.body.description,
      images: files,
      subdomain: req.body.subdomain,
      music: req.body.music,
      owner: req.user.id
    });


    shrine.save((err, shrine) => {
        if (err) { console.log(err) }

          res.redirect('/');

      });



  })


};
