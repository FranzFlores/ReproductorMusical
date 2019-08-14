'use strict'
var fs = require('fs');
var path = require('path');

const { Artist, Album, Song } = require('../database');
const ArtistController = {};

//----------------------Métodos para la Web--------------------------

//Vista de Usuario para la parte web
ArtistController.viewAddArtist = (req, res) => {
  res.render("dashboard", { title: "Agregar Artista", fragment: "fragments/artist/addArtist" });
};

ArtistController.viewUpdateArtist = (req, res) => {
  Artist.findAll({
    where: { status: true },
    order: [
      ['name', 'ASC']
    ]
  }).then((list) => {
    res.render("dashboard", { title: "Agregar Imagen Artista", fragment: "fragments/artist/updateArtist", artists: list });
  }).catch((err) => {
    res.status(500).send({ message: 'Error en la peticion' });
  });
};

ArtistController.viewAddImageArtist = (req, res) => {
  Artist.findAll({
    where: { status: true },
    order: [
      ['name', 'ASC']
    ]
  }).then((list) => {
    res.render("dashboard", { title: "Agregar Imagen Artista", fragment: "fragments/artist/addImageArtist", artists: list });
  }).catch((err) => {
    res.status(500).send({ message: 'Error en la peticion' });
  });
};

ArtistController.viewListArtist = (req, res) => {
  Artist.findAll({
    where: { status: true },
    order: [
      ['name', 'ASC']
    ]
  }).then((list) => {
    res.render("dashboard", { title: "Lista de Artista", fragment: "fragments/artist/listArtist", artists: list });
  }).catch((err) => {
    res.status(500).send({ message: 'Error en la peticion' });
  });
};


/**
 * @api {post} /artist/saveArtist Guarda información del artista 
 * @apiName saveArtist
 * @apiGroup Artist
 * @apiDescription El método guarda información del artista en la base de datos
 * 
 * @apiParam {String}           name              Nombre de artista 
 * @apiParam {String}           description       Descripción del atista
 * 
 *  @apiParamExample {json} Request-Example:
 *      {
 *         name: "Nombre artista",
 *         description:"Descripción artista"
 *      }
 * 
 * @apiSuccess {flashNotification} pop up 'Se ha guardado correctamente el artista'
 * 
 */
ArtistController.saveArtist = (req, res) => {
  console.log(req.body);
  Artist.create({
    name: req.body.name,
    description: req.body.description,
    image: 'artist.jpg',
    status: true
  }).then((artistStored) => {
    if (artistStored) {
      req.flash('GOOD', 'Se ha guardado correctamente el artista', '/artist/addArtist');
    } else {
      req.flash('OK', 'No se pudo guardar el artista', '/artist/addArtist');
    }
  }).catch((err) => {
    console.log(err);
    req.flash('BAD', 'Ocurrio un error al  guardar el artista', '/artist/addArtist');
  });
};

/**
 * @api {get} /artist/artists listado de los artistas
 * @apiName getArtists
 * @apiGroup Artist
 * @apiDescription El método enlista los artistas almacenados en la base de datos 
 * 
 * 
 * @apiSuccess {[json]} list Arreglo de artistas
 * @apiSuccessExample Sucess-Response:
 * HTTP/1.1 200 OK
 * [
 *     {
 * name: "Nombre Artista 1"
 * description: "Descripcion Artista 1"
 *     },
 *     {
 * name: "Nombre Artista 2"
 * description: "Descripcion Artista 2"
 *     }
 * ]
 */
ArtistController.getArtists = (req, res) => {
  Artist.findAll({
    where: { status: true },
    order: [
      ['name', 'ASC']
    ]
  }).then((list) => {
    res.status(200).send(list);
  }).catch((err) => {
    res.status(500).send({ message: 'Error en la peticion' });
  });
};

/**
 * @api {get} /artist/artist/:external obtención de un artista por su atributo external id
 * @apiName getArtist
 * @apiGroup Artist
 * @apiDescription El método obtiene un artitas mediante su external id
 * 
 * 
 * @apiSuccess {json} artist objeto obtenido del modelo artista
 * @apiSuccessExample Sucess-Response:
 * HTTP/1.1 200 OK
 *
 *     {
 * name: "Nombre Artista 1"
 * description: "Descripcion Artista 1"
 *     }
 *
 */
ArtistController.getArtist = (req, res) => {
  Artist.findOne({
    where: { external_id: req.params.external },
    include: [{ model: Album, include: { model: Song } }]
  }).then((artist) => {
    res.status(200).send(artist);
  }).catch((err) => {
    res.status(500).send({ message: 'Error en la peticion' });
  });
};

/**
 * @api {post} /artist/updateArtist/:external  Actualiza la información del Artista
 * @apiName updateArtist
 * @apiGroup Artist
 * @apiDescription El método actualiza en la Base de Datos la información del Artista.
 * 
 * @apiParam {String}           name              Nombre de artista 
 * @apiParam {String}           description       Descripción del atista
 * 
 * @apiParamExample {json} Request-Example:
 *      {
 *         name: "Nombre Artista "
 *         description: "Descripcion Artista " 
 *      } 
 * 
 * @apiSuccess {flashNotification} popup "Se ha actualizado correctamente el artista"
 */
ArtistController.updateArtist = (req, res) => {
  Artist.update({
    name: req.body.name,
    description: req.body.description
  }, {
      where: { external_id: req.params.external }
    }).then((result) => {
      if (result == 0) {
        req.flash('OK', "No se ha podido actualizar el artista", '/artist/updateArtist');
      } else {
        req.flash('GOOD', "Se ha actualizado el artista correctamente", '/artist/updateArtist');
      }
    }).catch((err) => {
      console.log(err);
      req.flash('BAD', "Error al actualizar el artista", '/artist/updateArtist');
    });
};

/**
 * @api {post} /artist/deleteArtist/:external  dar dabaja a un artista 
 * @apiName deleteArtist
 * @apiGroup Artist
 * @apiDescription El método actualiza el estado del artista en la base de datos
 * 
 * @apiParam {String}           external          Atributo external_id único del usuario.Se obtiene por la URL 
 * @apiParam {String}           artist            id del artista. se obtiene mediante el cuerpo de la petición
 * 
 * @apiParamExample {json} Request-Example:
 *      {
 *        external:48d0a02df461f0519b1c,
 *        artist:1
 *      }
 * @apiSuccess {flashNotification} popup "Se ha eliminado correctamente"
 */

ArtistController.deleteArtist = (req, res) => {
  Artist.update({ status: false }, { where: { external_id: req.params.external } })
    .then((result) => {
      if (result == 0) {
        req.flash('OK', 'No se pudo eliminar el artista', '/artist/updateArtist');
      } else {
        Album.findAll({ where: { artistId: req.body.artist } }).then((list) => {
          var ids = [];
          list.forEach(element => {
            ids.push(element.id);
          });

          Album.update({ status: false }, { where: { id: ids } })
            .then((result) => {
              if (result == 0) {
                req.flash('OK', 'No se pudo eliminar el artista', '/artist/updateArtist');
              } else {
                console.log(ids);
                for (var i = 0; i < ids.length; i++) {

                  Song.findAll({ where: { albumId: ids[i] } })
                    .then((list) => {
                      var idsongs = [];
                      list.forEach(song => {
                        idsongs.push(song.id);
                      });
                      Song.update({ status: false }, { where: { id: idsongs } });
                    })

                  if (i == (ids.length - 1)) {
                    Song.findAll({ where: { albumId: ids[i] } })
                      .then((list) => {
                        var idsongs = [];
                        list.forEach(song => {
                          idsongs.push(song.id);
                        });
                        Song.update({ status: false }, { where: { id: idsongs } });
                      })
                    req.flash('GOOD', 'Se ha eliminado el artista de manera correcta.', '/artist/updateArtist');
                  }
                }
              }
            });
        }).catch((err) => {
          console.log(err);
          req.flash('BAD', 'Error al eliminar el artista', '/artist/updateArtist');
        });
      }
    }).catch((err) => {
      console.log(err);
      req.flash('BAD', 'Error al eliminar el artista', '/artist/updateArtist');
    });
};

ArtistController.searchArtist = (req, res) => {
  //const Op = Sequelize.Op;

  Artist.findAll({
    where: {
      name: {
        [Op.like]: '%' + req.body.search + '%'
      }
    }
  }).then((artists) => {
    res.status(200).send(artists);
  }).catch((err) => {
    console.log(err);
    req.flash('BAD', 'Error al buscar el artista', '/artist/updateArtist');
  });


};

/**
 * @api {post} /artist/upload-image-artist  Actualiza el atributo image del artista en la base de datos.
 * @apiName uploadImage
 * @apiGroup Artist
 * @apiDescription El método actualiza el atributo image con la ruta de la imagen subida en la base de datos.
 * 
 * @apiParam {String}           image               Atributo image que llega del formulario form multipart/form-data.
 * 
 * @apiParamExample {json} Request-Example:
 *      {
 *         image:AyLjYZwe-HzZ08Yh0Vsiq7An.png
 *      }
 * 
 * @apiSuccess {flashNotification} popup "Se actualizado de manera correcta el artista"
 * 
 */

ArtistController.uploadImage = (req, res) => {

  var file_name = "Imagen no encontrada";

  if (req.files) {
    var file_path = req.files.image.path;
    if (process.platform == 'darwin') {
      var file_split = file_path.split('\/');
    } else {
      var file_split = file_path.split('\\');
    }
    var file_name = file_split[file_split.length - 1];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg') {
      Artist.update({ image: file_name }, {
        where: { external_id: req.body.external }
      }).then((result) => {
        if (result == 0) {
          req.flash('OK', "No se ha podido actualizar el artista", "/artist/addImageArtist");
        } else {
          req.flash('GOOD', "Se ha subido la Imagen del Artista con éxito", "/artist/addImageArtist");
        }
      }).catch((err) => {
        console.log(err);
        req.flash("BAD", "Error al subir la imagen del artista", "/artist/addImageArtist");
      });
    } else {
      req.flash('OK', "La extension del archivo no es correcta", "/artist/addImageArtist");
    }
  } else {
    req.flash('OK', "Ocurrio un error al intentar subir la imagen", "/artist/addImageArtist");
  }
};

/**
 * @api {get} /artist/get-image-artist/:imageFile Obtiene la foto de perfil del artist.
 * @apiName getImageFile
 * @apiGroup Artist
 * @apiDescription El método obtiene del servidor la imagen que se encuentra en la base de datos del artist.
 * 
 * @apiParam {String}           imageFile              identificador de la fotografia.
 * @apiParamExample {json} Request-Example:
 *      {
 *         imageFile:AyLjYZwe-HzZ08Yh0Vsiq7An.png
 *      }
 * 
 * @apiSuccess {file}  fotografia del artista que se encuentra en la base de datos y que se obtiene del servidor.
 * 
 */
ArtistController.getImageFile = (req, res) => {
  var path_file = './uploads/artists/' + req.params.imageFile;
  var default_file = './public/img/artist.jpg';

  fs.exists(path_file, function (exists) {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      fs.exists(default_file, (exists) => {
        if (exists) {
          res.sendFile(path.resolve(default_file));
        } else {
          res.status(200).send({ message: "No existe la imagen" });
        }
      });
    }
  });
};

module.exports = ArtistController;