import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MainContext } from "../MainContexts";
import { ICategory } from "../interfaces";
import { ScrollView } from "react-native-gesture-handler";
const { width, height } = Dimensions.get("window");
export function Home({ navigation }) {
  const Main = useContext(MainContext);
  useEffect(() => {
    Main.refetch();
  }, []);

  return (
    <ScrollView>
      <View style={styles.containerCategories}>
        <View style={styles.containerInfo}>
          <Text style={styles.title}>
            Louer votre matériel de sport, c'est aussi ça l'esprit d'équipe.
          </Text>
        </View>
        {Main?.categories.length > 0 &&
          Main?.categories.map((categorie: ICategory) => (
            <View key={categorie.id} style={styles.containerCard}>
              <TouchableOpacity
                onPress={() => {
                  Main.setCategorie(categorie.name);
                  navigation.navigate("Produits");
                }}
                style={styles.addButton}
              >
                <Image
                  style={styles.tinyLogo}
                  source={{
                    uri: categorie.image,
                  }}
                />
                <View style={styles.containerInfo}>
                  <Text style={styles.title2}>{categorie.name}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const white = "#ffffff";
const styles = StyleSheet.create({
  containerCategories: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: width,
    marginBottom: 50,
  },
  containerCard: {
    width: width / 2 - 20,
    borderRadius: 15,
    backgroundColor: "#FFFBFE",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
  },
  addButton: {},
  tinyLogo: {
    borderRadius: 15,
    width: "100%",
    height: 200,
  },
  containerInfo: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  title: {
    color: "#343A55",
    marginBottom: 10,
  },
  title2: {
    color: "#343A55",
  },
});
