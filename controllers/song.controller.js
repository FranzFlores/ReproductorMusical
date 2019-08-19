'use strict'
var fs = require('fs');
var path = require('path');
var request = require('request');

const { Album, Song, Artist } = require('../database');
const SongController = {};

SongController.viewAddSong = (req, res) => {
  Album.findAll({
    where: { status: true },
    order: [
      ['title', 'ASC']
    ]
  }).then((list) => {
    res.render("dashboard", { title: "Agregar Canción", fragment: "fragments/song/addSong", albums: list });
  }).catch((err) => {
    res.status(500).send({ message: 'Error en la peticion' });
  });
};

SongController.viewListSong = (req, res) => {
  Song.findAll({
    where: { status: true },
    order: ['title'],
    include: [{ model: Album, include: { model: Artist } }]
  }).then((list) => {
    res.render("dashboard", { title: "Agregar Canción", fragment: "fragments/song/listSong", songs: list });
  }).catch((err) => {
    console.log(err);
    res.status(500).send({ message: 'Error en la peticion' });
  });
};

SongController.viewAddFileSong = (req, res) => {
  Song.findAll({
    where: { status: true },
    order: ['title']
  }).then((list) => {
    res.render("dashboard", { title: "Agregar Canción", fragment: "fragments/song/addFileSong", songs: list });
  }).catch((err) => {
    console.log(err);
    res.status(500).send({ message: 'Error en la peticion' });
  });
};

/**
 * @api {post} /song/saveSong Guarda información de la canción
 * @apiName saveSong
 * @apiGroup Song
 * @apiDescription El método guarda información de la canción en la base de datos
 * 
 * @apiParam {Number}           number            número de la canción
 * @apiParam {String}           title             titulo de canción
 * @apiParam {Number}           album             el id del album a la que pertenece la canción
 *
 * 
 *  @apiParamExample {json} Request-Example:
 *      {
 *         number: 1,
 *         title:"Canción",
 *         album:1
 *      }
 * 
 * @apiSuccess {flashNotification} pop up 'Se ha guardado correctamente la información de la canción'
 * 
 */
SongController.saveSong = (req, res) => {
  Song.create({
    number: req.body.number,
    title: req.body.title,
    file: 'null',
    status: true,
    listeners: 0,
    albumId: req.body.album
  }).then((songStored) => {
    if (songStored) {
      // Request for Firebase Notificacion                 
      // request(options, (err, response, body) => {
      //   if (err) console.log(err);
      //   if (!err && response.statusCode == 200) {
      //     var info = JSON.parse(body);
      //     console.log(info);
      //   }
      //   console.log(response.statusCode)
      // });
      req.flash('GOOD', 'Se ha guardado correctamente la información de la canción', '/song/addSong');
    } else {
      req.flash('OK', 'No se pudo guardar la canción', '/song/addSong');
    }
  }).catch((err) => {
    console.log(err);
    req.flash('BAD', 'Error al guardar la canción', '/song/addSong');
  });
};
/**
 * @api {post} /song/listen  Actualiza los listeners 
 * @apiName updateListeners
 * @apiGroup Song
 * @apiDescription El método actualiza el atributo listeners en la base de datos
 * @apiParam {String}           external            id de canción
 * 
 *  @apiParamExample {json} Request-Example:
 *      {
 *         external_id: "443434"
 *      }
 * 
 * @apiSuccess {console} 'Si se actualizo listeners'
 * 
 */
SongController.updateListeners = (req, res) => {
  Song.findOne({
    where: { external_id: req.params.external }
  }).then((song) => {
    var listeners = song.listeners + 1;
    Song.update({
      listeners: listeners,
    }, {
        where: { external_id: song.external_id }
      }).then((result) => {
        if (result == 0) {
          console.log('NO se actualizo listeners');
        } else {
          console.log('Si se actualizo listeners');
        }
      }).catch((err) => {
        res.status(500).send({ message: 'Error en la peticion' });
      });
  }).catch((err) => {
    res.status(500).send({ message: 'Error en la peticion' });
  });
};
/**
 * @api {get} /song/:external Registro de la tabla canción 
 * @apiName getSong
 * @apiGroup Song
 * @apiDescription El método obtiene un solo registro de la tabla cancion
 * @apiParam {String}           external            El atributo external_id de canción
 * @apiParamExample {json} Request-Example:
 *      {
 *         external_id: "443434"
 *      }
 * @apiSuccess {json} song
 * @apiSuccessExample Sucess-Response:
 * HTTP/1.1 200 OK
 *   {
 *    id_song:1,
 *    number:1,
 *    title:"titulo cancion",
 *    file:"archivo.mp3",
 *    status: true,
 *    listerners: 1,
 *    external_id:gskfgfjlgf 
 *  }
 */
SongController.getSong = (req, res) => {
  Song.findOne({
    where: { external_id: req.params.external },
    include: [{ model: Album, include: { model: Artist } }]
  }).then((song) => {
    res.status(200).send(song);
  }).catch((err) => {
    res.status(500).send({ message: 'Error en la peticion' });
  });
};

/**
 * @api {get} /song/songs Obtiene todas las canciones almacenadas en la base de datos
 * @apiName getSongs
 * @apiGroup Song
 * @apiDescription El método obtiene todas las canciones registradas en la base de datos
 * 
 * @apiSuccess {json} list
 * @apiSuccessExample Sucess-Response:
 * HTTP/1.1 200 OK
 *   [{
 *    id_song:1,
 *    number:1,
 *    title:"titulo cancion",
 *    file:"archivo.mp3",
 *    status: true,
 *    listerners: 1,
 *    external_id:gskfgfjlgf 
 *  },
 *  {
 *    id_song:2,
 *    number:2,
 *    title:"titulo cancion 2",
 *    file:"archivo.mp3",
 *    status: true,
 *    listerners: 1,
 *    external_id:gskfgfjlgf 
 *  }]
 * 
 */
SongController.getSongs = (req, res) => {
  Song.findAll({
    where: { status: true },
    order: ['title'],
    include: [{ model: Album, attributes: ['image', 'title'], include: { model: Artist, attributes: ['name'] } }]
  }).then((list) => {
    res.status(200).send(list);
  }).catch((err) => {
    console.log(err);
    res.status(500).send({ message: 'Error en la peticion' });
  });
};
/**
 * @api {post} /song/updateSong Actualiza la información de la canción 
 * @apiName updateSong
 * @apiGroup Song
 * @apiDescription El método actualiza las canciones
 * @apiParam {String}           external          atributo external_id de la canción
 * @apiParam {String}           title             titulo de canción
 * @apiParam {Number}           number            número de la canción
 * 
 *  @apiParamExample {json} Request-Example:
 *      {
 *         number: 1,
 *         title: "canción",
 *         external_id: "443434"
 * 
 *      }
 * @apiSuccess {flashNotification} pop up 'Se ha actualizado la canción correctamente'
 * 
 * 
 */SongController.updateSong = (req, res) => {
  Song.update({
    title: req.body.title,
    number: req.body.number,
  }, {
      where: { external_id: req.params.external }
    }).then((result) => {
      if (result == 0) {
        req.flash('OK', "No se ha podido actualizar la canción", "/song/listSong");
      } else {
        req.flash('GOOD', "Se ha actualizado la canción correctamente", "/song/listSong");
      }
    }).catch((err) => {
      console.log(err);
      req.flash('BAD', "Error al actualizar la canción", "/song/listSong");
    });
};
/**
 * @api {post} /song/deleteSong  Dar de baja una canción 
 * @apiName deleteSong
 * @apiGroup Song
 * @apiDescription El método da de baja una canción en la base de datos
 * @apiParam {String}           external            el atributo external_id de canción.Se pasa por la URL
 *
 *  @apiParamExample {json} Request-Example:
 *      {
 *         external_id: "443434"
 *      }
 * 
 * @apiSuccess {flashNotification} pop up 'Se ha elimanado la canción con éxito'
 * 
 */
SongController.deleteSong = (req, res) => {
  Song.update({
    status: false
  }, {
      where: { external_id: req.params.external }
    }).then((song) => {
      if (song == 0) {
        req.flash('OK', 'No se pudo eliminar la canción', "/song/listSong");
      } else {
        req.flash('GOOD', 'Se ha elimanado la canción con éxito', "/song/listSong");
      }
    }).catch((err) => {
      console.log(err);
      req.flash('BAD', 'Error al eliminar la canción', "/song/listSong");
    });
};

/**
 * @api {post} /song/upload-file-song Actualiza el atributo file de canción en la base de datos.
 * @apiName uploadFile
 * @apiGroup song
 * @apiDescription El método actualiza el atributo file con la ruta de la imagen subida en la base de datos.
 * 
 * @apiParam {String}           file               Atributo file que llega del formulario form multipart/form-data.
 * @apiParamExample {json} Request-Example:
 *      {
 *         file:AyLjYZwe-HzZ08Yh0Vsiq7An.png
 *      }
 * 
 * @apiSuccess {flashNotification} pop up 'Se ha subido el fichero de audio con éxito'
 * 
 */
SongController.uploadFile = (req, res) => {
  var file_name = "no subido...";

  if (req.files) {
    var file_path = req.files.file.path;
    if (process.platform == 'darwin') {
      var file_split = file_path.split('\/');
    } else {
      var file_split = file_path.split('\\');
    }
    var file_name = file_split[file_split.length - 1];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if (file_ext == 'mp3' || file_ext == 'ogg' || file_ext == 'm4a') {
      Song.update({ file: file_name }, {
        where: { external_id: req.body.external }
      }).then((result) => {
        if (result == 0) {
          req.flash('OK', "No se ha podido subir el fichero de la canción", "/song/addFileSong");
        } else {
          req.flash('GOOD', "Se ha subido el fichero de audio con éxito", "/song/addFileSong");
        }
      }).catch((err) => {
        console.log(err);
        req.flash('BAD', "Error al subir el fichero de audio", "/song/addFileSong");
      });
    } else {
      req.flash('OK', "La extension del archivo no es correcta", "/song/addFileSong");
    }
  } else {
    req.flash('OK', "Ocurrio un error al intentar subir la imagen", "/song/addFileSong");
  }
};

/**
 * @api {get} /song/get-song-file  presenta el fichero de audio de una canción con una ruta
 * @apiName getSongFile
 * @apiGroup Song
 * @apiDescription El método presenta el fichero de audio de una canción con una ruta en la base de datos
 * @apiParam {String}           songFile           Nombre del fichero de audio almacenado en el servidor
 *  @apiParamExample {json} Request-Example:
 *      {
 *         songFile: "gjfdklgjfdlk.mp3"
 *      }
 * 
 * @apiSuccess {file} Archivo de audio de la cancion.
 * 
 */
SongController.getSongFile = (req, res) => {
  var songFile = req.params.songFile;
  var path_file = './uploads/songs/' + songFile

  fs.exists(path_file, function (exists) {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({ message: "No existe el fichero de audio" });
    }
  });
};

module.exports = SongController;