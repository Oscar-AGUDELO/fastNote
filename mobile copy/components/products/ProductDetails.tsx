import React from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { IProduct } from "../../interfaces";
import Ionicons from "@expo/vector-icons/Ionicons";
const { width, height } = Dimensions.get("window");

interface IProductDetailsProps {
  product: IProduct | null;
  closeProductDetails: Function;
  addOnBasket: Function;
}

export function ProductDetails({
  product,
  closeProductDetails,
  addOnBasket,
}: IProductDetailsProps) {
  if (product !== null && product.disponibility) {
    return (
      <View key={product.id} style={styles.container}>
        <View style={styles.backgroundF} />
        <TouchableOpacity
          onPress={() => {
            closeProductDetails();
          }}
          style={styles.closeButton}
        >
          <Text style={styles.closeText}>x</Text>
        </TouchableOpacity>
        <View style={styles.containerContain}>
          <View style={styles.containerContain1}>
            <Image style={styles.tinyLogo} source={{ uri: product.image }} />
            <View style={styles.containerContain2}>
              <Text style={styles.containerName}>{product.name}</Text>
              <Text style={styles.containerPrice}>{product.price}€ / jour</Text>
            </View>
          </View>
          <Text style={styles.description}>{product.description}</Text>
          <TouchableOpacity
            onPress={() => {
              addOnBasket(product);
            }}
            style={styles.addButton}
          >
            <Text style={styles.addIcon}>+</Text>
            <Ionicons name="basket-outline" style={styles.cartIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return null;
  }
}

const white = "#ffffff";
const styles = StyleSheet.create({
  backgroundF: {
    height: height,
    backgroundColor: "black",
    opacity: 0.3,
    zIndex: 0,
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
  },
  closeButton: {
    zIndex: 1,
    position: "absolute",
    right: 15,
    top: 15,
  },
  closeText: {
    fontSize: 30,
    borderRadius: 500,
    backgroundColor: white,
    color: "black",
    height: 35,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 35,
    lineHeight: 33,
  },
  container: {
    alignItems: "center",
    height: height,
    width: width,
    justifyContent: "center",
  },
  containerContain: {
    backgroundColor: "#FFFBFE",
    borderRadius: 15,
    height: 500,
    width: "80%",
    padding: 10,
  },
  containerContain1: {
    height: 370,
    alignIjustifyContenttems: "center",
  },
  tinyLogo: {
    width: "100%",
    height: 320,
  },
  containerContain2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  containerName: { fontSize: 15, fontWeight: "500" },
  containerPrice: { fontSize: 13, fontWeight: "500" },
  description: {
    height: 80,
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
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
