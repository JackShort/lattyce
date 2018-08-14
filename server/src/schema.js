import {
    makeExecutableSchema,
    addMockFunctionsToSchema,
} from 'graphql-tools';
import { resolver, createNodeInterface } from 'graphql-sequelize';
import { GraphQLSchema, GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLList, GraphQLInt, GraphQLFloat } from 'graphql';
import { User, Entity, EntityLinks, Graph, Nodes, Links } from './models';

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A user',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The id of the user',
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The email of the user',
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The password of the user',
    }
  }
});

const entityType = new GraphQLObjectType({
  name: 'Entity',
  description: 'An entity',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The id of the entity',
    },
    value: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The value of the entity',
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The entity type',
    },
    fields: {
      type: new GraphQLList(GraphQLString),
      description: 'Extra fields on the entity'
    },
    values: {
      type: new GraphQLList(GraphQLString),
      description: 'Extra values for fields on the entity'
    },
    links: {
      type: new GraphQLList(entityLinksType),
      resolve: resolver(Entity.EntityLinks, { seperate: true }),
    }
  })
});

const nodesType = new GraphQLObjectType({
  name: 'Nodes',
  description: 'A node',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the id of the node',
    },
    entityId: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the id of the entity linked'
    },
    x: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'x coordinate of the node',
    },
    y: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'y coordinate of the node',
    },
    type: {
      type: GraphQLString,
      description: 'the type of node it is'
    },
    value: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the entity',
    },
    fields: {
      type: GraphQLList(GraphQLString),
      description: 'fields of node'
    },
    values: {
      type: GraphQLList(GraphQLString),
      description: 'fields of node'
    },
    links: {
      type: new GraphQLList(linksType),
      resolve: resolver(Nodes.Links, { seperate: true }),
    }
  })
});

const nodesInput = new GraphQLInputObjectType({
  name: 'NodesInput',
  description: 'the nodes',
  fields: {
    entityId: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The id linked to the entity'
    },
    x: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'the x coordinate of the node',
    },
    y: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'the y coordinate of the node',
    },
    type: {
      type: GraphQLString,
      description: 'the type of node it is'
    },
    fields: {
      type: GraphQLList(GraphQLString),
      description: 'the fields of the node'
    },
    values: {
      type: GraphQLList(GraphQLString),
      description: 'the values of the node'
    },
    value: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The value of the entity',
    },
  },
});

const linksType = new GraphQLObjectType({
  name: 'Links',
  description: 'A link between two nodes',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'the id of the link',
    },
    value: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The label of the link',
    },
    source: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The source id in graph'
    },
    target: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The target id in graph'
    }
  },
});

const linksInput = new GraphQLInputObjectType({
  name: 'LinksInput',
  description: 'the links',
  fields: {
    value: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The label of the link',
    },
    source: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The source id in graph'
    },
    target: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The target id in graph'
    }
  },
});

const entityLinksType = new GraphQLObjectType({
  name: 'EntityLinks',
  description: 'A link between two entities',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'the id of the link',
    },
    value: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The label of the link',
    },
    source: {
      type: entityType,
      resolve: resolver(EntityLinks.Source, { seperate: true }),
    },
    target: {
      type: nodesType,
      resolve: resolver(EntityLinks.Target, { seperate: true }),
    }
  },
});

const entityInput = new GraphQLInputObjectType({
  name: 'EntityInput',
  description: 'the entity',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the id of the entity',
    }
  }
})

const graphType = new GraphQLObjectType({
  name: 'Graph',
  description: 'A graph',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The id of the graph',
    },
    name: {
      type: GraphQLString,
      description: 'The name of the graph'
    },
    nodes: {
      type: new GraphQLList(nodesType),
      resolve: resolver(Graph.Nodes, { seperate: true }),
    },
    links: {
      type: new GraphQLList(linksType),
      resolve: resolver(Graph.Links, { seperate: true }),
    }
  }
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(userType),
        resolve: resolver(User),
      },
      user: {
        type: userType,
        resolve: resolver(User),
        args: {
          email: {
            description: 'email of user',
            type: new GraphQLNonNull(GraphQLString),
          }
        }
      },
      entity: {
        type: new GraphQLList(entityType),
        resolve: resolver(Entity),
        args: {
          id: {
            type: GraphQLInt,
            description: 'id of entity'
          },
          value: {
            type: GraphQLString,
            description: 'value of entity'
          },
          type: {
            type: GraphQLString,
            description: 'the type of the entity'
          }
        }
      },
      entities: {
        type: new GraphQLList(entityType),
        resolve: resolver(Entity),
      },
      nodes: {
        type: new GraphQLList(nodesType),
        resolve: resolver(Nodes),
      },
      links: {
        type: new GraphQLList(linksType),
        resolve: resolver(Links),
      },
      graphs: {
        type: new GraphQLList(graphType),
        resolve: resolver(Graph),
      },
      graph: {
        type: graphType,
        resolve: resolver(Graph),
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'id of graph',
          }
        }
      },
    },
  }),

  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: userType,
        args: {
          email: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The email of the user',
          },
          password: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The password of the user',
          }
        },
        resolve: (root, user, info) => {
          return User.create(user)
            .catch( err => {
              return Promise.reject(err)
            })
        }
      },
      createEntity: {
        type: entityType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The id of the entity',
          },
          value: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The value of the entity',
          },
          type: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The type of the entity',
          },
          fields: {
            type: new GraphQLList(GraphQLString),
            description: 'the fields of the entity',
          },
          values: {
            type: new GraphQLList(GraphQLString),
            description: 'the values of the fields of the entity',
          }
        },
        resolve: (root, entity, info) => {
          return Entity.create(entity)
            .catch( err => {
              return Promise.reject(err)
            })
        }
      },
      createEntityLink: {
        type: entityLinksType,
        args: {
          value: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The label of the link',
          },
          source: {
            type: new GraphQLNonNull(entityInput),
            description: 'the source entity',
            resolve: resolver(Entity)
          },
          target: {
            type: new GraphQLNonNull(entityInput),
            description: 'the target entity',
            resolve: resolver(Entity)
          },
        },
        resolve: (_, args) => {
          return EntityLinks.create(args)
            .then( link => {
              const idSource = args['source']['id'];
              const idTarget = args['target']['id'];

              link.setSource(idSource);
              link.setTarget(idTarget);

              Entity.findById(idSource).then(entity => {
                entity.addEntityLink(link);
              })

              Entity.findById(idTarget).then(entity => {
                entity.addEntityLink(link);
              })

              return(link)
            })
            .catch( err => {
              return Promise.reject(err)
            })
        }
      },
      createGraph: {
        type: graphType,
        args: {
          name: {
            type: GraphQLString,
            description: 'The name of the graph'
          },
          nodes: {
            type: new GraphQLList(nodesInput),
            description: 'The nodes in the graph',
            resolve: resolver(Nodes)
          },
          links: {
            type: new GraphQLList(linksInput),
            description: 'The links in the graph',
            resolve: resolver(Links)
          }
        },
        resolve: (_, args) => {
          return Graph.create(args, {
            include: [{
              model: Nodes,
              as: 'nodes'
            }, {
              model: Links,
              as: 'links'
            }
          ]
          })
            .catch( err => {
              return Promise.reject(err)
            })
        }
      },
      createLink: {
        type: linksType,
        args: {
          value: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The label of the link',
          },
          source: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The entity id of the source'
          },
          target: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The entity id of the target'
          }
        },
        resolve: (_, args) => {
          return Links.create(args)
            .catch( err => {
              return Promise.reject(err)
            })
        }
      },
      createNode: {
        type: nodesType,
        args: {
          entityId: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'the entity linked with the node'
          },
          x: {
            type: new GraphQLNonNull(GraphQLFloat),
            description: 'The x position of the node',
          },
          y: {
            type: new GraphQLNonNull(GraphQLFloat),
            description: 'The y position of the node',
          },
          type: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The type of node it is'
          },
          fields: {
            type: GraphQLList(GraphQLString),
            description: 'the fields of the node'
          },
          values: {
            type: GraphQLList(GraphQLString),
            description: 'the values of the node'
          },
          value: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The name of the node to be displayed'
          }
        },
        resolve: (_, args) => {
          return Nodes.create(args)
            .catch( err => {
              return Promise.reject(err)
            })
        }
      },
      addFieldsToEntity: {
        type: entityType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'the id of the entity'
          },
          name: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'the name of the field'
          },
          value: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'the value of the field'
          }
        },
        resolve: (_, args) => {
          return Entity.findById(args['id'])
            .then(entity => {
              const fields = entity.fields;
              const values = entity.values;
              fields.push(args['name']);
              values.push(args['value']);
              entity.fields = fields;
              entity.values = values;
              return entity.save();
            })
            .catch(err => {
              return Promise.reject(err);
            })
        }
      },
      addFieldsToNode: {
        type: nodesType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLID),
            description: 'the id of the node'
          },
          name: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'the name of the field'
          }
        },
        resolve: (_, args) => {
          return Nodes.findById(args['id'])
            .then(node => {
              const fields = node.fields;
              fields.push(args['name']);
              node.fields = fields;
              return node.save();
            })
            .catch(err => {
              return Promise.reject(err);
            })
        }
      }, 
      deleteGraph: {
        type: graphType,
        args: {
          id:  {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The id of the graph'
          }
        },
        resolve: (_, args) => {
          return Graph.destroy({
            where: {'id': args['id']}
          })
        }
      }
    }
  }),
});

export { schema };

//const typeDefs = `
//type User {
//   id: ID!
//   email: String!
//   password: String!
//}
//
//type Query {
//   users: [User]
//}
//
//type Mutation {
//  addUser(email: String!, password: String!): User
//}
//`;
//
//const schema = makeExecutableSchema({ typeDefs, resolvers });
//export { schema };