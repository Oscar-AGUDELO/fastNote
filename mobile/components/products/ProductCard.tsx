import React from "react";
import { Image, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IProduct } from "../../interfaces";
import Ionicons from "@expo/vector-icons/Ionicons";

interface IProductProps {
  product: IProduct | null;
  openProduct: Function;
  addOnBasket: Function;
}

export function ProductCard({
  product,
  openProduct,
  addOnBasket,
}: IProductProps) {
  if (product !== null && product.disponibility) {
    return (
      <View style={styles.container} key={product.id}>
        <View style={styles.containerCard}>
          <TouchableOpacity
            style={styles.containerTinyLogo}
            onPress={() => {
              openProduct(product);
            }}
          >
            <Image style={styles.tinyLogo} source={{ uri: product.image }} />
          </TouchableOpacity>
          <View style={styles.containerInfo}>
            <Text style={styles.containerInfoName}>{product.name}</Text>
            <View style={styles.containerInfoPrice}>
              <Text style={styles.price}>{product.price} € / jour</Text>
              <TouchableOpacity
                onPress={() => {
                  addOnBasket(product);
                }}
                style={styles.containerAddButton}
              >
                <Text style={styles.addIcon}>+</Text>
                <Ionicons name="basket-outline" style={styles.cartIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
}

const white = "#ffffff";
const styles = StyleSheet.create({
  container: {
    width: "50%",
    height: 240,
    paddingTop: 10,
    marginBottom: 10,
  },
  containerCard: {
    borderRadius: 15,
    backgroundColor: "#FFFBFE",
    flexDirection: "column",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    alignItems: "center",
    height: "100%",
    marginHorizontal: 10,
    padding: 15,
  },
  containerTinyLogo: {
    width: "100%",
    alignItems: "center",
    height: 150,
  },
  tinyLogo: {
    borderRadius: 8,
    width: "100%",
    height: "100%",
  },
  containerInfo: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
  containerInfoName: {
    fontSize: 15,
    width: "100%",
    height: 23,
    fontWeight: "500",
    marginTop: 5,
    marginBottom: 0,
  },
  containerInfoPrice: {
    width: "100%",
    flexDirection: "row",
    fontWeight: "500",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 15,
    flexDirection: "row",
  },
  containerAddButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  addIcon: {
    borderRadius: 500,
    backgroundColor: "black",
    color: white,
    height: 15,
    width: 15,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    lineHeight: 16,
  },
  cartIcon: {
    fontSize: 30,
  },
});
