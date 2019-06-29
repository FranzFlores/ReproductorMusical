'use strict'

const { Album, Artist, Song } = require('../database');
var fs = require('fs');
var path = require('path');

const AlbumController = {};
// mètodo que sirve para guardar albunes, requiere  que se pase el id del artista
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
// mètodo que en lista todos los albunes registrados
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
    include: [{ model: Artist }, { model: Song , where: { status: true }}],
    order: [
      [Song, 'number', 'ASC']
    ]
  }).then((album) => {
    res.status(200).send(album);
  }).catch((err) => {
    res.status(500).send({ message: 'Error en la peticion' });
  });
};
//mètodo que actualiza los albunes en la base de datos, requiere el external id por parametro
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
//mètodo para subir fotos en la tabla album

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
//mètodo para presentar la imagen de album con una ruta
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

module.exports = AlbumController;a