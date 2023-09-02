import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useContext } from "react";
import { MainContext } from "./MainContexts";
import { Connection } from "./screens/Connection";
import { Home } from "./screens/Home";
import { MyAccount } from "./screens/MyAccount";
import { Products } from "./screens/Products";
import { PurchaseProces } from "./screens/PurchaseProces";
const Tab = createBottomTabNavigator();

function Router() {
  const Main = useContext(MainContext);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Accueil") {
            iconName = focused ? "home-outline" : "home-outline";
          } else if (route.name === "Produits") {
            iconName = focused ? "basketball-outline" : "basketball-outline";
          } else if (route.name === "Panier") {
            iconName = focused ? "basket-outline" : "basket-outline";
          } else if (route.name === "Connexion") {
            iconName = focused
              ? "finger-print-outline"
              : "finger-print-outline";
          } else if (route.name === "Mon compte") {
            iconName = focused ? "person-outline" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Accueil" component={Home} />
      <Tab.Screen name="Produits" component={Products} />
      <Tab.Screen name="Panier" component={PurchaseProces} />
      <Tab.Screen
        name={!Main?.user?.id ? "Connexion" : "Mon compte"}
        component={!Main?.user?.id ? Connection : MyAccount}
      />
    </Tab.Navigator>
  );
}
export default Router;
