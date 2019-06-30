'use strict'
const {PlayList, User,Song } = require('../database');
var fs = require('fs');
var path = require('path');
var PlayListController = {};
// mètodo que sirve para guardar playlist, requiere  el id del usuario por parametro
PlayListController.savePlayList = (req, res) => {
  PlayList.create({
    title: req.body.title,
    description: req.body.description,
    status: true,
    image: 'pZf0xvCSsl5hg0Wq9Yz-Lkoc.jpg',
    userId: req.params.user
  }).then((playListStored) => {
    if (playListStored) {
      req.flash('success', 'Se ha guardado la Playlist con éxito');
    } else {
      req.flash('message', 'No se pudo guardar la Playlist');
    }
    res.redirect('/profile');
  }).catch((err) => {
    res.status(500).send({ message: 'Error en la peticion' });
  });
};
//mètodo para gregar unacancion en la playlist
PlayListController.addSongtoPlayList = (req, res) => {
  PlayList.findOne({
    where: { id: req.body.playlist }
  }).then((playListResult) => {
    playListResult.setSongs(req.body.songs);
    req.flash('success', 'Se ha agregado correctamente las canciones');
    res.redirect('/profile');
  }).catch((err) => {
    console.log(err);
    res.status(500).send({ message: 'Error en la peticion 2' });
  });
};
//mètodo para obtener un solo registro de la tabla playlist en la base de datos, requiere el external id por parametro
PlayListController.getPlayList = (req, res) => {
  PlayList.findOne({
    where: { external_id: req.params.external }
  }).then((playList) => {
    res.status(200).send(playList);
  }).catch((err) => {
    res.status(500).send({ message: 'Error en la peticion' });
  });
};
//mètodo para en listar todos las playlist
PlayListController.getPlayListAdmin = (req, res) => {
  User.findOne({
    where: { roleId: 1 }
  }).then((user)=>{
    PlayList.findAll({
      where: { userId: user.id }
    }).then((list) => {
      res.status(200).send(list);
    }).catch((err) => {
      console.log(err);
      res.status(500).send({ message: 'Error en la peticion' });
    });
  }).catch((err) => {
    console.log(err);
    res.status(500).send({ message: 'Error en la peticion' });
  });
};
//mètodo para crear un ranking con las canciones mas escuchadas
PlayListController.createPlaylistRanking = (req,res)=>{
  Song.findAll({where: {status: true},
    order: [['listeners', 'DESC']],
    limit : 25 
  }).then((list) => {
    PlayList.findOne({
      where: { external_id: '508104d0-cf74-4a9d-ad7d-42a0754f3ae0' }
    }).then((playListResult) => {
      playListResult.setSongs(list);
      req.flash('success', 'Se ha agregado correctamente las canciones');
      res.redirect('/profile');
    }).catch((err) => {
      console.log(err);
      res.status(500).send({ message: 'Error en la peticion 2' });
    });
  }).catch((err) => {
    console.log(err);
    res.status(500).send({ message: 'Error en la peticion' });
  });
};

//mètodo paera en listar las canciones del rankings

PlayListController.getListSongs = (req, res) => {
  PlayList.findOne({
    where: { external_id: req.params.playlist }
  }).then((playList) => {
    playList.getSongs()
      .then((list) => {
        res.status(200).send(list);
       }).catch((err) => {
        res.status(500).send({ message: 'Error en la peticion' });
      });
     }).catch((err) => {
       res.status(500).send({ message: 'Error en la peticion' });
     });
};
// mètodo que en lista todos las playlist registradas

  PlayListController.getPlayLists = (req, res) => {
    PlayList.findAll({
      where: {
        status: true,
        userId: req.params.user
      }
    }).then((list) => {
      res.status(200).send(list);
    }).catch((err) => {
      res.status(500).send({ message: 'Error en la peticion' });
    });
  };

//mètodo para subir fotos en la tabla playlist

  PlayListController.uploadImage = (req, res) => {
    var file_name = "Imagen no encontrada";

    if (req.files) {
      var file_path = req.files.image.path;
      var file_split = file_path.split('\/');
      var file_name = file_split[2];

      var ext_split = file_name.split('\.');
      var file_ext = ext_split[1];

      if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
        PlayList.update({ image: file_name }, {
          where: { external_id: req.params.id }
        }).then((result) => {
          if (result==0) {
            req.flash('message', "No se ha podido actualizar la playlist");
          } else {
            req.flash('success', "Se ha subido la Imagen de la playlist con éxito");
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
//mètodo para presentar la imagen de la playlist con una ruta
  PlayListController.getImageFile = (req, res) => {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/playLists/' + imageFile;

    fs.exists(path_file, function (exists) {
      if (exists) {
        res.sendFile(path.resolve(path_file));
      } else {
        res.status(200).send({ message: "No existe la imagen" });
      }
    });
  };


  module.exports = PlayListController;