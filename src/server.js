// we use node 12 and doesn't support es module import unless we turn
// "type": "module" and --experimental-module but for some reason it still doesn't work
// so we just use require syntax
const apollo = require("apollo-server");
const { ApolloServer, gql } = apollo;

const server = new ApolloServer({
  playground: true,
  typeDefs: gql`
    # Schema Type
    type Pizza {
      id: Int!
      pizza: String!
      toppings: [Topping!]!
    }

    type Topping {
      id: Int!
      topping: String!
    }

    type Query {
      pizzas: [Pizza!]!
    }
  `,
  resolvers: {
    Query: {
      pizzas: (parent, args, context) => {
        const pizzas = [{id: 1, pizza: "Detroit Pizza", toppings: [{id: 1, topping: "Cheesy"}]}]
        return pizzas
      },
    },
  },
});

server.listen({ port: 3000 }).then(({ url }) => {
  console.log(`Server running at ${url}`);
});
