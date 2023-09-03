import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Index } from "./screens/Index";
import { DATAProvider } from "./DATAContexts";

const httpLink = createHttpLink({
  // uri: "http://localhost:5000/",
  uri: "https://api.dev.fastnote.website",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await AsyncStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


function App() {
  return (
    <ApolloProvider client={client}>
      <DATAProvider>
        <Index />
      </DATAProvider>
    </ApolloProvider>
  );
}

export default App;
