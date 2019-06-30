'use strict'
var fs = require('fs');
var path = require('path');
var request = require('request');

const { Album, Song,Artist } = require('../database');
const SongController = {};

var options = {
  method: 'POST',
  url: 'https://fcm.googleapis.com/fcm/send',
  headers: {
    'content-type': 'application/json',
    'authorization': 'key=AAAAW_7JZIc:APA91bED_AR5yNas8XUauZAG7Zgdb94tT-mCSyJMW1IYNEU0w-UZjRCMkzKK50lxyfdru9k04Y7-1FW74IY3BAXFXDXKw6e8C0JUf2vSGVtnQYdur-5AnooX_JtNZZTrBUG-SH9FeWsl'
  },
  body: JSON.stringify({
    notification: {
      "title": "Se ha agregado una nueva canción",
      "body": "Una nuevo canción ha sido añadida.",
      "click action": "http://localhost:4000"
    },
    to: "fcD40OjPbxU:APA91bECGeJ05ezoraaufdmLXBwDiLenVITUWh12uAP7FS11G7bRlDBujFKhBU0--yb-eJdzGZhkGE08BO8Jaz613OkRhCe0CfSaP4wPNoWhsOh56mUFFnZ138aXZj9KYPlRz0yEafG1"
  })
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
      request(options, (err, response, body) => {
        if (err) console.log(err);
        if (!err && response.statusCode == 200) {
          var info = JSON.parse(body);
          console.log(info);
        }
        console.log(response.statusCode)
      });
      req.flash('success', 'Se ha guardado correctamente la información de la canción');
    } else {
      req.flash('message', 'No se pudo guardar la canción');
    }
    res.redirect('/profile');
  }).catch((err) => {
    res.status(500).send({ message: 'Error en la peticion' });
  });
};
/**
 * @api {post} /song/listen  Actualiza los listeners 
 * @apiName updateListeners
 * @apiGroup Song
 * @apiDescription El método actualiza los listeners en la base de datos
 * @apiParam {String}           external_id            id de canción
 * 
 * 
 *  @apiParamExample {json} Request-Example:
 *      {
 *         external_id: "443434"
 *      }
 * 
 * @apiSuccess {flashNotification} pop up 'Si se actualizo listeners'
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
 * @apiParam {String}           external_id            id de canción
 * 
 * 
 * @apiSuccessExample Sucess-Response:
 * HTTP/1.1 200 OK
 */
SongController.getSong = (req, res) => {
  Song.findOne({
    where: { external_id: req.params.external },
    include: [{ model: Album }]
  }).then((song) => {
    res.status(200).send(song);
  }).catch((err) => {
    res.status(500).send({ message: 'Error en la peticion' });
  });
};
/**
 * @api {get} /song/songs Obtiene todas las canciones
 * @apiName getSongs
 * @apiGroup Song
 * @apiDescription El método obtiene todas las canciones registradas en la base de datos
 * @apiParam {String}           external_id            id de canción
 * 
 * 
 * @apiSuccessExample Sucess-Response:
 * HTTP/1.1 200 OK
 */
SongController.getSongs = (req, res) => {
  Song.findAll({
    where: { status: true },
    order: ['title'],
    include: [{ model: Album, attributes: ['image'] ,include: { model: Artist, attributes: ['name'] }}]
  }).then((list) => {
    res.status(200).send(list);
  }).catch((err) => {
    console.log(err);
    res.status(500).send({ message: 'Error en la peticion' });
  });
};
/**
 * @api {get} /song/updateSong Actualiza las canción 
 * @apiName updateSong
 * @apiGroup Song
 * @apiDescription El método actualiza las canciones
 * @apiParam {String}           external_id       id de canción
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
        req.flash('message', "No se ha podido actualizar la cancioón");
      } else {
        req.flash('success', "Se ha actualizado la canción correctamente");
      }
      res.redirect('/profile');
    }).catch((err) => {
      res.status(500).send({ message: 'Error en la peticion' });
    });
};
/**
 * @api {post} /song/deleteSong  Dar de baja una canción 
 * @apiName deleteSong
 * @apiGroup Song
 * @apiDescription El método da de baja una canción en la base de datos
 * @apiParam {String}           external_id            id de canción
 * 
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
        req.flash('message', 'No se pudo eliminar la canción');
      } else {
        req.flash('success', 'Se ha elimanado la canción con éxito');
      }
      res.redirect('/profile');
    }).catch((err) => {
      res.status(500).send({ message: 'Error en la peticion' });
    });
};

/**
 * @api {post} /song/deleteSong  Subir el fichero de audio de una canción 
 * @apiName uploadFile
 * @apiGroup Song
 * @apiDescription El método sube el fichero de audio de una canción en la base de datos
 * @apiParam {String}           external_id            id de canción
 * 
 * 
 *  @apiParamExample {json} Request-Example:
 *      {
 *         external_id: "443434"
 *      }
 * 
 * @apiSuccess {flashNotification} pop up 'Se ha subido el fichero de audio con éxito'
 * 
 */
SongController.uploadFile = (req, res) => {
  var file_name = "no subido...";

  if (req.files) {
    var file_path = req.files.file.path;
    var file_split = file_path.split('\/');
    var file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if (file_ext == 'mp3' || file_ext == 'ogg' || file_ext == 'm4a') {
      Song.update({ file: file_name }, {
        where: { external_id: req.body.external }
      }).then((result) => {
        if (result == 0) {
          req.flash('message', "No se ha podido actualizar la canción");
        } else {
          req.flash('success', "Se ha subido el fichero de audio con éxito");
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
 * @api {get} /song/get-song-file  presenta el fichero de audio de una canción con una ruta
 * @apiName getSongFile
 * @apiGroup Song
 * @apiDescription El método presenta el fichero de audio de una canción con una ruta en la base de datos
 * @apiParam {String}           external_id            id de canción
 * 
 * 
 *  @apiParamExample {json} Request-Example:
 *      {
 *         external_id: "443434"
 *      }
 * 
 * @apiSuccess {flashNotification} pop up 'Se ha subido el fichero de audio con éxito'
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