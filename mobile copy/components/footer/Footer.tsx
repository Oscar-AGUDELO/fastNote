import React from "react";
import { View, Image, Text, Dimensions, StyleSheet } from "react-native";
const logo = require("../../assets/images/logo3.png");
const { width, height } = Dimensions.get("window");

export const Footer = () => {
  return (
    <View style={styles.footerContainer}>
      <Image style={styles.footerImage} source={logo} />
      <Text style={styles.footerText}>
        Copyright © {new Date().getFullYear()} WildRent
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "#AEF3DA",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  footerImage: {
    width: 40,
    height: 40,
  },
  footerText: {
  },
});
