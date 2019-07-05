'use strict'
var fs = require('fs');
var path = require('path');

const helpers = require('../lib/helpers');
const { Role, User, Artist } = require('../database');
// const jwt = require('../lib/jwt');
const UserController = {};

//----------------------Métodos para la Web--------------------------

/**
 * @api {get} /user/profile Muestra la vista de perfil de usuario cuando se inicia sesión
 * @apiName viewProfile
 * @apiGroup User
 * @apiDescription El método renderiza la vista del perfil de usuario cuando se inicia sesión
 * 
 * @apiSuccess {html} Carga un archivo html con toda la informacion necesaria en la vista. 
 * 
 */
UserController.viewProfile = (req, res) => {
    Artist.findAll({
        where: { status: true }
    }).then((list) => {
        res.render('sidebar', { list });
    }).catch((err) => {
        res.status(500).send({ message: 'Error en la peticion' });
    });
};

/**
 * @api {post} /user/updatePassword/:external_id  Actualiza la contraseña del usuario 
 * @apiName updatePassword
 * @apiGroup User
 * @apiDescription El método compara si la antigua contraseña es correcta y luego permite actualizar la contraseña.
 * 
 * @apiParam {String}           external_id          Atributo external_id único del usuario.Se obtiene por la URL
 * @apiParam {String}           newPassword          La nueva contraseña del usuario.
 * @apiParam {String}           oldPassword          La antigua contraseña del usuario.
 * 
 * @apiParamExample {json} Request-Example:
 *      {
 *         external_id:48d0a02df461f0519b1c,
 *         newPassword: "Nueva Contraseña", 
 *         oldPassword: "Antigua Contraseña",
 *      }
 * 
 * @apiSuccess {flashNotification} popup "Se ha actualizado correctamente la contraseña"
 * 
 */
UserController.updatePassword = (req, res) => {
    var external_id = req.params.external_id;
    var newPassword = req.body.newPassword;
    var oldPassword = req.body.oldPassword;
    User.findOne({ where: { external_id: external_id } })
        .then((user) => {
            if (helpers.matchPassword(oldPassword, user.password)) {
                var hash = helpers.generateHash(newPassword);
                User.update({ password: hash }, { where: { external_id: external_id } })
                    .then((result) => {
                        if (result == 0) {
                            req.flash('message', 'No se pudo actualizar la contraseña');
                            res.redirect('/profile#');
                        } else {
                            req.flash('success', 'Se ha actualizado correctamente la contraseña');
                            res.redirect('/signin');
                        }
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).send({ message: 'Error en la peticion' });
                    });
            } else {
                req.flash('message', 'Ha ingresado incorrectamente su actual contraseña');
                res.redirect('/profile');
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).send({ message: 'Error en la peticion' });
        });
};


/**
 * @api {post} /user/updateUser/:external  Actualiza la información del usuario 
 * @apiName updateUser
 * @apiGroup User
 * @apiDescription El método actualiza en la Base de Datos la información del usuario.
 * 
 * @apiParam {String}           external            Atributo external_id único del usuario.Se obtiene por la URL
 * @apiParam {String}           firstName           Atributo firstName del usuario.
 * @apiParam {String}           lastName            Atributo lastName del usuario.
 * @apiParam {String}           user                Atributo user del usuario.
 * @apiParam {String}           email               Atributo email del usuario.
 * 
 * @apiParamExample {json} Request-Example:
 *      {
 *         external:48d0a02df461f0519b1c,
 *         firstName: "Nombre Usuario", 
 *         lastName: "Apellido Usuario",
 *         user: "alias de Usuario",
 *         email: "email@gmail.com" 
 *      }
 * 
 * 
 * @apiSuccess {flashNotification} popup "Se ha actualizado correctamente el usuario"
 * 
 */
UserController.updateUser = (req, res) => {
    User.update({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.user,
        email: req.body.email,
    },
        {
            where: { external_id: req.params.external }
        }).then((user) => {
            if (user == 0) {
                req.flash('message', "No se ha podido actualizar el usuario");
            } else {
                req.flash('success', "Se ha actualizado correctamente el usuario");
            }
            res.redirect('/profile');
        }).catch((err) => {
            console.log(err);
            res.status(500).send({ message: 'Error en la peticion' });
        });
};

/**
 * @api {post} /user/upload-image-user/:external  Actualiza el atributo image del usuario en la base de datos.
 * @apiName uploadImage
 * @apiGroup User
 * @apiDescription El método actualiza el atributo image con la ruta de la imagen subida en la base de datos.
 * 
 * @apiParam {String}           image               Atributo image que llega del formulario form multipart/form-data.
 * 
 * @apiParamExample {json} Request-Example:
 *      {
 *         image:AyLjYZwe-HzZ08Yh0Vsiq7An.png
 *      }
 * 
 * @apiSuccess {flashNotification} popup "Se actualizado de manera correcta el usuario"
 * 
 */
UserController.uploadImage = (req, res) => {
    var file_name = "Imagen no encontrada";
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg') {
            User.update({ image: file_name }, {
                where: { external_id: req.params.external }
            }).then((user) => {
                if (user == 0) {
                    req.flash('message', "No se pudo actualizar la foto de perfil del usuario");
                } else {
                    req.flash('success', "Se actualizado de manera correcta el usuario");
                }
                res.redirect('/profile');
            }).catch((err) => {
                res.status(500).send({ message: 'Error en la peticion' });
            });
        } else {
            req.flash('message', "La extension del archivo no es correcta");
        }
        res.redirect('/profile');
    } else {
        res.status(200).send({ message: "No se ha podido subir ninguna imagen" });
    }
};


/**
 * @api {get} /user/get-image-user/:imageFile Obtiene la foto de perfil del usuario.
 * @apiName getImageFile
 * @apiGroup User
 * @apiDescription El método obtiene del servidor la imagen que subio el usuario.
 * 
 * @apiParam {String}           imageFile              identificador de la fotografia.
 * @apiParamExample {json} Request-Example:
 *      {
 *         imageFile:AyLjYZwe-HzZ08Yh0Vsiq7An.png
 *      }
 * 
 * @apiSuccess {file}  fotografia que el usuario ha guardado y que se obtiene del servidor.
 * 
 */
UserController.getImageFile = (req, res) => {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: "No existe la imagen" });
        }
    });
};

UserController.registerUser = (req, res) => {

    var rolesNames = [
        { name: 'Administrador' },
        { name: 'Usuario' }
    ];

    Role.findOne({ where: { name: 'Administrador' } })
        .then((role) => {
            if (!role) {
                Role.bulkCreate(rolesNames);
            }
        });

    User.findOne({ where: { email: email } })
        .then((user) => {
            if (user) {
                req.flash('OK', 'El usuario ya existe', "/signup");
            } else {
                //Crear un usuario
                var hash = helpers.generateHash(password);
                Role.findOne({ where: { name: "Administrador" } })
                    .then((role) => {
                        if (role) {
                            var modelUser = {
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                email: req.body.email,
                                image: 'null',
                                password: hash,
                                roleId: role.id
                            }
                            User.create(modelUser)
                                .then((newUser, created) => {
                                    if (!newUser) {
                                        req.flash('OK', 'No se ha podido crear el usuario', "/signup");
                                    } else {
                                        console.log(newUser);
                                        req.flash('GOOD', 'El usuario se ha creado satisfactoriamente', "/signin");
                                    }
                                });
                        } else {
                            req.flash('BAD', 'Ha ocurrido un error al crear el usuario', "/signup");
                        }
                    });
            }
        });
};


//----------------------Métodos para la Aplicacion Movil--------------------------

// UserController.login = (req, res) => {
//     User.findOne({ where: { email: req.body.email } })
//         .then((user) => {
//             if (!user) res.status(404).send('Usuario no existe');
//             else {
//                 if (helpers.matchPassword(req.body.password, user.password)) {
//                     if (req.body.getHash) {
//                         res.status(200).send({
//                             token: jwt.createToken(user)
//                         });
//                     } else {
//                         res.status(200).send(user);
//                     }
//                 } else {
//                     res.status(404).send('Contraseña Incorrecta');
//                 }
//             }
//         }).catch((err) => {
//             console.log(err);
//             res.status(500).send({ message: 'Error en la peticion' });
//         });;
// };




module.exports = UserController;
