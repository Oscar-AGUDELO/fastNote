/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { MainContext } from "../MainContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");

export function MyAccount({ navigation }) {
  const Main = useContext(MainContext);
  useEffect(() => {
    Main.refetch();
  }, []);
  const logout = () => {
    Main?.setUser(undefined);
    AsyncStorage.removeItem("token");
    Main?.refetch();
  };

  return (
    <View style={styles.connectionContainContainer}>
      <TouchableOpacity onPress={() => logout()}>
        <Text>Go Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  connectionContainer: {
    backgroundColor: "#ffffff",
    width: width,
    height: height,
    display: "flex",
  },

  connectionContainContainer: {
    marginTop: 43,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  connectionSubTitle: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
