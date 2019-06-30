'use strict'

var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');

const artistController = require('../controllers/artist.controller');
const { isLoggedIn } = require('../lib/auth');
const md_upload = multipart({uploadDir: './uploads/artists'});

router.get('/artists',artistController.getArtists);
router.get('/artist/:external',isLoggedIn,artistController.getArtist);
router.post('/saveArtist',isLoggedIn,artistController.saveArtist);
router.post('/updateArtist/:external',isLoggedIn,artistController.updateArtist);
router.post('/deleteArtist/:external',isLoggedIn,artistController.deleteArtist);
router.post('/upload-image-artist',[md_upload,isLoggedIn],artistController.uploadImage);
router.get('/get-image-artist/:imageFile', artistController.getImageFile);
module.exports = router;