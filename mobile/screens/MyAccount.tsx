/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { DATAContext } from "../DATAContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");

export function MyAccount() {
  const DATA = useContext(DATAContext);
  useEffect(() => {
    DATA.refetchUser();
  }, []);
  const logout = () => {
    // DATA?.setUser(undefined);
    AsyncStorage.removeItem("token");
    DATA?.refetchUser();
  };
  const lastNote = DATA.user?.notes.findLast((note) => note)
  return (
    <View style={styles.connectionContainContainer}>
      <View style={styles.connectionContainContainer}>
        <Text>Last Note</Text>
        <Text>{lastNote?.title}</Text>
        <Text>{lastNote?.content}</Text>
        <Text>{lastNote?.createdAt && String(lastNote?.createdAt)}</Text>
      </View>
      <TouchableOpacity onPress={() => logout()}>
        <Text>Go Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  connectionContainContainer: {
    height: height,
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
