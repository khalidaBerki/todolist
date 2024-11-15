import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

//instance Apollo Client pour se connecter à l' API GraphQL (mon back)
const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:8000/graphql', 
  }),
  cache: new InMemoryCache(),
});

export default client;
