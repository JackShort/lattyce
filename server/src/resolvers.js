const users = [{
    id: 1,
    email: 'jack',
    password: 'test',
}, {
    id: 2,
    email: 'bob',
    password: 'test',
}];

export const resolvers = {
    Query: {
        users: () => {
            return users;
        },

        entities: () => {
            return entities;
        },
    },

    Mutation: {
        addUser: (root, args) => {
            const newUser = {id: 3, email: args.email, password: args.password};
            users.push(newUser);
            return newUser;
        },
    },
};