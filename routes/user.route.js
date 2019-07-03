'use strict'

var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');

const { isLoggedIn } = require('../lib/auth');
const userController = require('../controllers/user.controller');
const md_upload = multipart({ uploadDir: './uploads/users' });

router.get('/profile',isLoggedIn,userController.viewProfile);
router.post('/updateUser/:external',isLoggedIn,userController.updateUser);
router.post('/updatePassword/:external_id',isLoggedIn,userController.updatePassword);
router.post('/upload-image-user/:external', [md_upload,isLoggedIn],userController.uploadImage);
router.get('/get-image-user/:imageFile', userController.getImageFile);


//Para la aplicacion movil
// router.post('/login',userController.login);

module.exports = router;

