'use strict'

var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');

const { isLoggedIn } = require('../lib/auth');
const userController = require('../controllers/user.controller');
const md_upload = multipart({ uploadDir: './uploads/users' });

//Vistas Aplicación Web
router.get("/dashboard",isLoggedIn,userController.viewDashBoard);
router.get("/updateInfo",isLoggedIn,userController.viewUpdateInfo);
router.get("/updatePassword",isLoggedIn,userController.viewUpdatePassword);
router.get("/updateImage",isLoggedIn,userController.viewUpdateImage);


router.post('/updateInfo/:external',isLoggedIn,userController.updateInfo);
router.post('/updatePassword/:external',isLoggedIn,userController.updatePassword);
router.post('/upload-image-user/:external', [md_upload,isLoggedIn],userController.uploadImage);
router.get('/get-image-user/:imageFile', userController.getImageFile);


//Para la aplicacion movil
router.post('/loginApp',userController.login);

module.exports = router;

