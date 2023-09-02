import "react-native-gesture-handler";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  useMutation,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainProvider } from "./MainContexts";
import Router from "./Router";
import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { useEffect, useState } from "react";
import { saveTokenNotificationPush } from "./graphql/connection";

const httpLink = createHttpLink({
  // uri: "http://localhost:5000/",
  uri: "http://192.168.0.26:5000",
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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice || 1 + 1 == 2) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

function App() {
  const [expoPushToken, setExpoPushToken] = useState("");


  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    Notifications.addNotificationReceivedListener((notification) => {
      console.log("New Notification");
      console.log(JSON.stringify(notification.request.content, null, 4));
      // navigate('Post', { id: ... })
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("User cliked on new notification");
      console.log(
        JSON.stringify(response.notification.request.content, null, 4)
      );
      // navigate('Post', { id: ... })
    });
  }, []);
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <MainProvider expoPushToken={expoPushToken}>
          <Router />
        </MainProvider>
      </NavigationContainer>
    </ApolloProvider>
  );
}

export default App;
