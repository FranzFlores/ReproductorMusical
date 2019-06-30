const Sequelize = require('sequelize')
const UserModel = require('./models/user.model')
const AlbumModel = require('./models/album.model')
const ArtistModel = require('./models/artist.model')
const PlayListModel = require('./models/PlayList')
const SongModel = require('./models/Song')
const RoleModel = require('./models/role.model')

//Conexion a la base de datos
const sequelize = new Sequelize('reproductor', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false
});

const User = UserModel(sequelize, Sequelize);
const Album = AlbumModel(sequelize, Sequelize);
const Artist = ArtistModel(sequelize, Sequelize);
const PlayList = PlayListModel(sequelize, Sequelize);
const Role = RoleModel(sequelize, Sequelize);
const Song = SongModel(sequelize, Sequelize);
const SongPlayList = sequelize.define('songPlayList', {});


Role.hasMany(User);
User.belongsTo(Role);

User.hasMany(PlayList);
PlayList.belongsTo(User);

PlayList.belongsToMany(Song, { through: SongPlayList, unique: false});
Song.belongsToMany(PlayList, { through: SongPlayList, unique: false});

Album.hasMany(Song);
Song.belongsTo(Album);

Artist.hasMany(Album);
Album.belongsTo(Artist);

sequelize.sync()
  .then(() => {
    console.log(`La base de Datos y las tablas han sido creadas`);
  });

module.exports = {
  Role,
  Artist,
  User,
  Album,
  Song,
  PlayList,
  SongPlayList
}
