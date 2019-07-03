'use strict'

var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');

const albumController = require('../controllers/album.controller');
const { isLoggedIn } = require('../lib/auth');
const md_upload = multipart({uploadDir: './uploads/albums'});

router.get('/albums',isLoggedIn,albumController.getAlbums);
router.get('/album/:external',isLoggedIn,albumController.getAlbum);
router.post('/saveAlbum',isLoggedIn,albumController.saveAlbum);
router.post('/updateAlbum/:external',isLoggedIn,albumController.updateAlbum);
router.post('/deleteAlbum/:external',isLoggedIn,albumController.deleteAlbum);
router.post('/upload-image-album',[md_upload,isLoggedIn],albumController.uploadImage);
router.get('/get-image-album/:imageFile', albumController.getImageFile);

module.exports = router;