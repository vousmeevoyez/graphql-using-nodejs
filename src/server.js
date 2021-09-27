const apollo = require("apollo-server");
const { ApolloServer, gql } = apollo;

// this is fake representation of database pizza topping record
// on the production environment you probably want real data from database
const pizzaToppings = [
  {id: 1, topping: "Cheesy"}
]

// this is fake representation of database record
// on the production environment you probably want real data from database
const pizzas = [
  {id: 1, pizza: "Neapolitan Pizza", toppings: pizzaToppings},
  {id: 2, pizza: "Chicago Pizza", toppings: pizzaToppings},
  {id: 3, pizza: "New York-Style Pizza", toppings: pizzaToppings},
  {id: 4, pizza: "Sicilian Pizza", toppings: pizzaToppings},
  {id: 5, pizza: "Greek Pizza", toppings: pizzaToppings},
  {id: 6, pizza: "California Pizza", toppings: pizzaToppings},
  {id: 7, pizza: "Detroit Pizza", toppings: pizzaToppings},
  {id: 8, pizza: "St. Louis Pizza", toppings: pizzaToppings},
]

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
      pizzas(name: String): [Pizza]
      pizza(id: Int): Pizza!
    }
  `,
  resolvers: {
    Query: {
      pizzas: (parent, args, context) => {
        const { name } = args;
        if(name){
          // this is fake implementation of simple string matching
          // on production environment you would want to query from real database!
          return [pizzas.find(({pizza})=> pizza === name)];
        }
        return pizzas
      },
      pizza: (parent, args, context) => {
        const { id } = args;
        if(id){
          // this is fake implementation of simple id matching
          // on production environment you would want to query from real database!
          return pizzas.find(({id: pizzaId})=> pizzaId === id);
        }
        return undefined
      },
    },
  },
});

server.listen({ port: 3000 }).then(({ url }) => {
  console.log(`Server running at ${url}`);
});
