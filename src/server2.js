const apollo = require("apollo-server");
const { ApolloServer, gql } = apollo;

// this is fake representation of database pizza topping record
// on the production environment you probably want real data from database
const pizzaToppings = [
  {id: 1, topping: "Cheesy"}
]

// this is fake representation of database record
// on the production environment you probably want real data from database
const chicagoPizzas = [
  {id: 2, pizza: "Chicago Pizza", toppings: pizzaToppings, status: "available", dough: "thin"}
]

const dominoPizzas = [
  {id: 9, pizza: "Domino Pizza", toppings: pizzaToppings, status: "available", sauce: "thick & rich"}
]

const pizzas = [
  {id: 1, pizza: "Neapolitan Pizza", toppings: pizzaToppings, status: "available"},
  {id: 3, pizza: "New York-Style Pizza", toppings: pizzaToppings, status: "unavailable"},
  {id: 4, pizza: "Sicilian Pizza", toppings: pizzaToppings, status: "cooking"},
  {id: 5, pizza: "Greek Pizza", toppings: pizzaToppings, status: "available"},
  {id: 6, pizza: "California Pizza", toppings: pizzaToppings, status: "available"},
  {id: 7, pizza: "Detroit Pizza", toppings: pizzaToppings, status: "cooking"},
  {id: 8, pizza: "St. Louis Pizza", toppings: pizzaToppings, status: "unavailable"},
  ...chicagoPizzas,
  ...dominoPizzas
]
const typeDefs = gql`
  enum PizzaStatus {
    AVAILABLE,
    COOKING
    UNAVAILABLE
  }

  interface IPizza {
    id: Int!
    pizza: String!
    toppings: [Topping!]!
    status: PizzaStatus!
  }


  type Pizza implements IPizza{
    id: Int!
    pizza: String!
    toppings: [Topping!]!
    status: PizzaStatus!
  }

  type ChicagoPizza implements IPizza{
    id: Int!
    pizza: String!
    toppings: [Topping!]!
    status: PizzaStatus!
    dough: String!
  }

  type DominoPizza implements IPizza{
    id: Int!
    pizza: String!
    toppings: [Topping!]!
    status: PizzaStatus!
    sauce: String!
  }

  type Topping {
    id: Int!
    topping: String!
  }

  input ToppingInput {
    id: Int!
  }

  union VariousPizza = Pizza | ChicagoPizza | DominoPizza

  type Query {
    pizzas(pizza: String): [VariousPizza]
    pizza(id: Int): Pizza!
  }

  type Mutation {
    createPizza(pizza: String, toppings: [ToppingInput!]!): Pizza!
    updatePizza(id: Int!, pizza: String, toppings: [ToppingInput]): Pizza!
  }
`;

const resolvers = {
  PizzaStatus: {
    AVAILABLE: 'available',
    COOKING: 'cooking',
    UNAVAILABLE: 'unavailable',
  },
  VariousPizza: {
    __resolveType(obj, context, info){
      // if Pizza have a dough then it mean it is ChicagoPizza
      if(obj.dough){
        return 'ChicagoPizza';
      }else if(obj.sauce){
        // if Pizza have a dough then it mean it is ChicagoPizza
        return 'DominoPizza';
      } else{
        return 'Pizza';
      }
    },
  },
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
};



const server = new ApolloServer({
  playground: true,
  typeDefs,
  resolvers
});

server.listen({ port: 3000 }).then(({ url }) => {
  console.log(`Server running at ${url}`);
});


