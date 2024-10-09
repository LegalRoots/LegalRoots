// const { Article } = require('../models/articlesModel');
// const { Crops } = require('../models/cropsModel');
// const { Event } = require('../models/eventsModel');
// const { Garden } = require('../models/gardenModel');
// const { Partnership } = require('../models/partnershipModel');
// const { Plots } = require('../models/plotsModel');
// const { Resource } = require('../models/resourcesModel');
// const { User } = require('../models/userModel');

// User.hasMany(Garden, { foreignKey: 'owner_id' });
// Garden.belongsTo(User, { foreignKey: 'owner_id' });

// User.hasMany(Article, { foreignKey: 'Publisher_ID' });
// Article.belongsTo(User, { foreignKey: 'Publisher_ID' });

// User.hasMany(Resource, { foreignKey: 'OwnerID' });
// Resource.belongsTo(User, { foreignKey: 'OwnerID' });

// Event.hasMany(User, { foreignKey: { name: 'EventID', allowNull: true } });
// User.belongsTo(Event, { foreignKey: { name: 'EventID', allowNull: true } });

// Plots.belongsTo(Garden, {
//   foreignKey: { name: 'Garden_ID' },
// });
// Garden.hasMany(Plots, {
//   foreignKey: { name: 'Garden_ID' },
// });

// Plots.hasMany(Crops, { foreignKey: 'Plot_ID' });
// Crops.belongsTo(Plots, { foreignKey: 'Plot_ID' });

// Garden.hasMany(Event, { foreignKey: { name: 'Garden_ID', allowNull: true } });
// Event.belongsTo(Garden, { foreignKey: { name: 'Garden_ID', allowNull: true } });

// Garden.hasMany(Partnership, {
//   foreignKey: { name: 'Garden_ID', allowNull: true },
// });
// Partnership.belongsTo(Garden, {
//   foreignKey: { name: 'Garden_ID', allowNull: true },
// });
