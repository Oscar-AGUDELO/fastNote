import React from "react";
import { Image, Text, View, StyleSheet } from "react-native";
const check = require("../../assets/images/check.svg");

export function Confirmation({
  orderId,
}: {
  orderId: number | undefined;
}): JSX.Element {
  return (
    <View style={styles.confirmationContainer}>
      <Image source={check} />
      <Text style={styles.confirmationTitle}>Paiment reçus !</Text>
      <View style={styles.confirmationMessageContainer}>
        <Text style={styles.paymentInfoContainText}>
          Votre commande{" "}
          <Text style={styles.confirmationStrong}>WR-{orderId}</Text> a bien été
          engeristré.
        </Text>
        <Text style={styles.paymentInfoContainText}>
          Vous receverez un e-mail de confirmation avec tous les détails de
          votre commande.
        </Text>
      </View>
    </View>
  );
}
const white = "#ffffff";
const styles = StyleSheet.create({
  confirmationContainer: {
    backgroundColor: white,
    padding: 10,
    alignItems: "center",
  },
  confirmationTitle: {
    color: "#343A55",
    fontWeight: "900",
    fontSize: 20,
  },
  confirmationMessageContainer: {
    paddingHorizontal: 80,
    paddingVertical: 20,
  },
  paymentInfoContainText: {
    color: "#343A55",
    textAlign: "center",
  },
  confirmationStrong: {
    fontWeight: "900",
  },
});
