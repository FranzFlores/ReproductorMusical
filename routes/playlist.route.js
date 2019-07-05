'use strict'

var express = require('express');
var router = express.Router();
var playListController = require('../controllers/playlist.controller');
const { isLoggedIn } = require('../lib/auth');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/playLists'});

router.get('/playLists/:user',isLoggedIn,playListController.getPlayLists);
router.get('/playList/:external',isLoggedIn,playListController.getPlayList);
router.get('/songsList/:playlist',isLoggedIn,playListController.getListSongs);
router.get('/playlistAdmin',isLoggedIn,playListController.getPlayListAdmin);
router.post('/savePlayList/:user',isLoggedIn,playListController.savePlayList);
router.post('/upload-image-playList/:id',[isLoggedIn,md_upload],playListController.uploadImage);
router.post('/addSongs',isLoggedIn,playListController.addSongtoPlayList);
router.get('/get-image-playList/:imageFile', playListController.getImageFile);
router.post('/ranking',playListController.createPlaylistRanking);

module.exports = router;