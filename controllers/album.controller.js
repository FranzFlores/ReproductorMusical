'use strict'
var fs = require('fs');
var path = require('path');

const { Album, Artist, Song } = require('../database');
const AlbumController = {};


//----------------------Métodos para la Web--------------------------

/**
 * @api {post} /album/saveAlbum Guarda información del album 
 * @apiName saveAlbum
 * @apiGroup Album
 * @apiDescription El método guarda información del album en la base de datos
 * 
 * @apiParam {String}           title             Nombre del album
 * @apiParam {String}           description       Descripción del album
 *  @apiParam {Date}            year              Año de publicación
 *  @apiParam {String}          artistId          Atributo external_id único del album.Se obtiene por la URL
 * 
 *  @apiParamExample {json} Request-Example:
 *      {
 *         name: "Nombre album",
 *         description:"Descripción album",
 *         year:"Año de publicación",
 *         artistId::48d0a02df461f0519b1c
 *      }
 * 
 * @apiSuccess {flashNotification} pop up 'Se ha guardado correctamente el album'
 * 
 */
AlbumController.saveAlbum = (req, res) => {
    Album.create({
        title: req.body.title,
        description: req.body.description,
        year: req.body.year,
        artistId: req.body.artist,
        image: '1lCVIZVunDrB5-Gc1ytgdRsz.jpg',
        status: true,
    }).then((albumStored) => {
        if (albumStored) {
            req.flash('success', 'Se ha guardado correctamente el album');
        } else {
            req.flash('message', 'No se pudo guardar el Album');
        }
        res.redirect('/profile');
    }).catch((err) => {
        res.status(500).send({ message: 'Error en la peticion' });
    });
};
/**
 * @api {get} /album/albums listado de los albumes
 * @apiName getAlbums
 * @apiGroup Album
 * @apiDescription El método enlista los albumes almacenados en la base de datos 
 * 
 * 
 * @apiSuccess {[json]} list Arreglo de albumes
 * @apiSuccessExample Sucess-Response:
 * HTTP/1.1 200 OK
 * [
 *     {
 *         name: "Nombre album 1",
 *         description:"Descripción album 1",
 *         year:"Año de publicación 1",
 *     },
 *     {
 *         name: "Nombre album 2",
 *         description:"Descripción album 2",
 *         year:"Año de publicación 2",
 *     }
 * ]
 */
AlbumController.getAlbums = (req, res) => {
    Album.findAll({
        where: { status: true },
        order: [
            ['title', 'ASC']
        ]
    }).then((list) => {
        res.status(200).send(list);
    }).catch((err) => {
        res.status(500).send({ message: 'Error en la peticion' });
    });
};
//mètodo para obtener un solo registro de la tabla album en la base de datos, requiere el external id por parametro
AlbumController.getAlbum = (req, res) => {
    Album.findOne({
        where: { external_id: req.params.external },
        include: [{ model: Artist }, { model: Song, where: { status: true } }],
        order: [
            [Song, 'number', 'ASC']
        ]
    }).then((album) => {
        res.status(200).send(album);
    }).catch((err) => {
        res.status(500).send({ message: 'Error en la peticion' });
    });
};

/**
 * @api {post} /album/updateAlbum/:external  Actualiza la información del Artista
 * @apiName updateAlbum
 * @apiGroup Album
 * @apiDescription El método actualiza en la Base de Datos la información del Album.
 * 
 * @apiParam {String}           title             Nombre del album
 * @apiParam {String}           description       Descripción del album
 * @apiParam {Date}             year              Año de publicación
 * 
 * @apiParamExample {json} Request-Example:
 *      {
 *         name: "Nombre album",
 *         description:"Descripción album",
 *         year:"Año de publicación"
 *      }
 * 
 * 
 * @apiSuccess {flashNotification} popup "Se ha actualizado correctamente el album"
 * 
 */
AlbumController.updateAlbum = (req, res) => {
    Album.update({
        title: req.body.title,
        description: req.body.description,
        year: req.body.year,
    }, {
            where: { external_id: req.params.external }
        }).then((result) => {
            if (result == 0) {
                req.flash('message', "No se ha podido actualizar el album");
            } else {
                req.flash('success', "Se ha actualizado correctamente el album");
            }
            res.redirect('/profile');
        }).catch((err) => {
            res.status(500).send({ message: 'Error en la peticion' });
        });
};
//mètodo para dar de baja los albunes en la base de datos, requiere el external id por parametro
AlbumController.deleteAlbum = (req, res) => {
    //Actualizar Album
    Album.update({
        status: req.body.status
    }, {
            where: { external_id: req.params.external }
        }).then((album) => {

            if (album == 0) {
                req.flash('message', 'No se pudo eliminar el album');
            } else {

                //Actualizar Canciones de Album
                Song.findAll({
                    where: { albumId: req.body.album },
                }).then((list) => {
                    var ids = [];
                    list.forEach(element => {
                        ids.push(element.id);
                    });
                    Song.update({ status: false }, { where: { id: ids } })
                        .then((result) => {
                            if (result == 0) {
                                req.flash('message', 'No se pudo eliminar el album');
                            } else {
                                req.flash('success', 'Se ha eliminado el album con exito');
                                res.redirect('/profile');
                            }
                        });
                }).catch((err) => {
                    console.log(err);
                    res.status(500).send({ message: 'Error en la peticion' });
                });
                //res.redirect('/profile');
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).send({ message: 'Error en la peticion' });
        });
};
/**
 * @api {post} /album/upload-image-album  Actualiza el atributo image del album en la base de datos.
 * @apiName uploadImage
 * @apiGroup Album
 * @apiDescription El método actualiza el atributo image con la ruta de la imagen subida en la base de datos.
 * 
 * @apiParam {String}           image               Atributo image que llega del formulario form multipart/form-data.
 * 
 * @apiParamExample {json} Request-Example:
 *      {
 *         image:AyLjYZwe-HzZ08Yh0Vsiq7An.png
 *      }
 * 
 * @apiSuccess {flashNotification} popup "Se actualizado de manera correcta el album"
 * 
 */


AlbumController.uploadImage = (req, res) => {

    var file_name = "Imagen no encontrada";

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Album.update({ image: file_name }, {
                where: { external_id: req.body.external }
            }).then((result) => {
                if (result == 0) {
                    req.flash('message', "No se ha podido actualizar el album");
                } else {
                    req.flash('success', "Se ha subido la Imagen del Album con éxito");
                }
                res.redirect('/profile');
            }).catch((err) => {
                res.status(500).send({ message: 'Error en la peticion' });
            });
        } else {
            req.flash('message', "La extension del archivo no es correcta");
            res.redirect('/profile');
        }
    } else {
        req.flash('message', "Ocurrio un error al intentar subir la imagen");
        res.redirect('/profile');
    }
};
/**
 * @api {get} /album/get-image-album/:imageFile Obtiene la foto  del album.
 * @apiName getImageFile
 * @apiGroup Album
 * @apiDescription El método obtiene del servidor la imagen que se encuentra en la base de datos del album.
 * 
 * @apiParam {String}           imageFile              identificador de la fotografia.
 * @apiParamExample {json} Request-Example:
 *      {
 *         imageFile:AyLjYZwe-HzZ08Yh0Vsiq7An.png
 *      }
 * 
 * @apiSuccess {file}  fotografia del album que se encuentra en la base de datos y que se obtiene del servidor.
 * 
 */
AlbumController.getImageFile = (req, res) => {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/' + imageFile

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: "No existe la imagen" });
        }
    });
};

module.exports = AlbumController; 