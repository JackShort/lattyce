import Sequelize from 'sequelize';
import db from './db';
import { sequelizeConnection } from '../node_modules/graphql-sequelize/lib/relay';

const User = db.define('User', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
    },

    email: {
      type: Sequelize.STRING(255),
      unique: true,
      allowNull: false,
    },

    password: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
},{
    indexes: [{ fields: ['email'] }],
    instanceMethods: {
        generateHash(password) {
            return bcrypt.hash(password, bcrypt.genSaltSync(8));
        },
        validPassword(password) {
            return bcrypt.compare(password, this.password);
        },
    },
});

const Entity = db.define('Entity', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true
  },

  value: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },

  type: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },

  fields: { 
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true,
  },

  values: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true,
  }
});

const Nodes = db.define('Nodes', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    unique: true,
    primaryKey: true
  },

  entityId: {
    type: Sequelize.INTEGER,
  },

  x: Sequelize.FLOAT,

  y: Sequelize.FLOAT,

  type: Sequelize.STRING,

  value: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },

  fields: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true,
  },

  values: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true,
  }
});

const Links = db.define('Links', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    unique: true,
    primaryKey: true
  },

  value: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },

  source: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  target: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

const EntityLinks = db.define('EntityLinks', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    unique: true,
    primaryKey: true
  },

  value: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
});

const Graph = db.define('Graph', {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
});

Graph.Nodes = Graph.hasMany(Nodes, { as: 'nodes', resolver: { seperate: true }, onDelete: 'CASCADE' });
Graph.Links = Graph.hasMany(Links, { as: 'links', resolver: { seperate: true }, onDelete: 'CASCADE' });
EntityLinks.Source = EntityLinks.belongsTo(Entity, { as: 'source', foreignKey: 'source_id', resolver: { seperate: true }, onDelete: 'CASCADE' });
EntityLinks.Target = EntityLinks.belongsTo(Entity, { as: 'target', foreignKey: 'target_id', resolver: { seperate: true }, onDelete: 'CASCADE' });
Entity.EntityLinks = Entity.belongsToMany(EntityLinks, { as: 'entityLinks', constraints: false, resolver: { seperate: true }, through: "entity_links", onDelete: 'CASCADE' });

export { User, Entity, EntityLinks, Graph, Nodes, Links }