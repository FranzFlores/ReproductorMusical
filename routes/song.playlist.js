'use strict'

var express = require('express');
var router = express.Router();
var songController = require('../controllers/song');
const { isLoggedIn } = require('../lib/auth');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/songs'});



router.get('/songs',songController.getSongs);
router.get('/song/:external',isLoggedIn,songController.getSong);
router.post('/saveSong',isLoggedIn,songController.saveSong);
router.post('/updateSong/:external',isLoggedIn,songController.updateSong);
router.post('/upload-file-song',[md_upload,isLoggedIn],songController.uploadFile);
router.post('/listen/:external',isLoggedIn,songController.updateListeners);
router.get('/get-song-file/:songFile', songController.getSongFile);
router.post('/deleteSong/:external',isLoggedIn,songController.deleteSong);


module.exports = router;