'use strict'

var express = require('express');
var router = express.Router();
var artistController = require('../controllers/artist');
const { isLoggedIn } = require('../lib/auth');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artists'});

router.get('/artists',artistController.getArtists);
router.get('/artist/:external',isLoggedIn,artistController.getArtist);
router.post('/saveArtist',isLoggedIn,artistController.saveArtist);
router.post('/updateArtist/:external',isLoggedIn,artistController.updateArtist);
router.post('/deleteArtist/:external',isLoggedIn,artistController.deleteArtist);
router.post('/upload-image-artist',[md_upload,isLoggedIn],artistController.uploadImage);
router.get('/get-image-artist/:imageFile', artistController.getImageFile);
module.exports = router;