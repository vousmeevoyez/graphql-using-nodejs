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
  {id: 1, pizza: "Neapolitan Pizza", toppings: pizzaToppings, status: "AVAILABLE"},
  {id: 2, pizza: "Chicago Pizza", toppings: pizzaToppings, status: "COOKING"},
  {id: 3, pizza: "New York-Style Pizza", toppings: pizzaToppings, status: "UNAVAILABLE"},
  {id: 4, pizza: "Sicilian Pizza", toppings: pizzaToppings, status: "AVAILABLE"},
  {id: 5, pizza: "Greek Pizza", toppings: pizzaToppings, status: "COOKING"},
  {id: 6, pizza: "California Pizza", toppings: pizzaToppings, status: "UNAVAILABLE"},
  {id: 7, pizza: "Detroit Pizza", toppings: pizzaToppings, status: "COOKING"},
  {id: 8, pizza: "St. Louis Pizza", toppings: pizzaToppings, status: "AVAILABLE"},
]

const server = new ApolloServer({
  playground: true,
  typeDefs: gql`
    enum PizzaStatus {
      AVAILABLE,
      COOKING
      UNAVAILABLE
    }

    # Schema Type
    type Pizza {
      id: Int!
      pizza: String!
      stock: Int!
      toppings: [Topping!]!
      status: PizzaStatus!
    }

    type Topping {
      id: Int!
      topping: String!
    }

    input ToppingInput {
      id: Int!
    }


    type Query {
      pizzas(pizza: String): [Pizza]
      pizza(id: Int): Pizza!
    }

    type Mutation {
      createPizza(pizza: String, toppings: [ToppingInput!]!): Pizza!
      updatePizza(id: Int!, pizza: String, toppings: [ToppingInput]): Pizza!
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
    Mutation: {
      createPizza: (parent, args, context) => {
        // this is fake implementation of increment id of database
        // on production environment you would want to insert from real database!
        let { id } = pizzas.reduce((prev, curr) => prev.id > curr.id ? prev: curr)
        id = id + 1

        // get pizza topping using pizza id
        const { toppings, pizza } = args;
        // treate topping as another table so you also need to get topping using current topping id!
        const toppingRecords = toppings.map(({id})=> pizzaToppings.find(({id: pizzaToppingId})=> pizzaToppingId === id))
        const data = {id, toppings: toppingRecords, pizza}
        pizzas.push(data)
        return data;
      },
      updatePizza: (parent, args, context) => {
        // get current pizza record using pizza id
        const { id, pizza, toppings } = args;

        const index = pizzas.findIndex((pizza) => pizza.id === id)

        // treate topping as another table so you also need to get topping using current topping id!
        const toppingRecords = toppings.map(({id})=> pizzaToppings.find(({id: pizzaToppingId})=> pizzaToppingId === id))

        pizzas[index] = { id, toppings: toppingRecords, pizza}
        return pizzas[index];
      },
    },
  },
});

server.listen({ port: 3000 }).then(({ url }) => {
  console.log(`Server running at ${url}`);
});
