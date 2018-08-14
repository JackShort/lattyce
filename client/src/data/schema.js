export const typeDefs = `
type User {
   id: ID!
   email: String!
   password: String!
}

type Query {
   users: [User]
}
`;