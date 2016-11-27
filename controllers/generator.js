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
 * GET /generator
 * Profile page.
 */
exports.newShrine = (req, res) => {
  res.render('generator/create', {
    title: 'Create a new Shrine',
    name: '',
    description: '',
    subdomain: req.subdomains[0] || '',
    _id: null
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

    if (req.body._id === null){
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

    }else{

      Shrine.update({ _id: req.body._id }, { $set: {
        name: req.body.name,
        description: req.body.description,
        images: files,
        subdomain: req.body.subdomain,
        music: req.body.music,
      }}, () => {
        res.redirect('/')
      });

    }


  })
};

/**
 * GET /manage/
 * See list of shrines
 */
exports.listShrines = (req, res, next) => {

  var myShrines = Shrine.find({
  'owner': req.user.id
  })

  myShrines.exec( (err, shrine) => {
    if (err) return
    console.log(shrine)
    res.render('generator/manage', {
      title: 'My shrines',
      shrines: shrine
    })
  })
};

/**
 * GET /manage/:shrine
 * See list of shrines
 */
exports.editShrine = (req, res, next) => {
  let shrineID = req.params.shrine

  Shrine.findOne({ _id: shrineID }, (err, doc) => {
    if (err) return res.status(503).send("DB down or something lol");

    if (!doc & shrineID !== undefined) return res.redirect('/generator');

    res.render('generator/create', {
      title: 'Create a new Shrine',
      name: doc.name,
      description: doc.description,
      subdomain: doc.subdomain,
      _id: doc._id
    });
  });




}
