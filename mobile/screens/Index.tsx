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
import { Login } from "../components/connection/Login";
import { Signup } from "../components/connection/Signup";
import { DATAContext } from "../DATAContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyAccount } from "./MyAccount";
const { width, height } = Dimensions.get("window");

export function Index() {
  const DATA = useContext(DATAContext);
  useEffect(() => {
    DATA.refetchUser();
  }, []);
  const [view, setView] = useState(true); // true = login, false = signup

  function onTokenChange(token: string) {
    if (token) {
      AsyncStorage.setItem("token", token);
      DATA.refetchUser();
    }
  }

  return (
    <ScrollView style={styles.connectionContainer}>
      {DATA.user ? <MyAccount /> : <View>
        {view ? (
          <View style={styles.connectionContainContainer}>
            <Text style={styles.connectionSubTitle}>Se Connecter</Text>
            <Login
              setView={setView}
              onTokenChange={onTokenChange}
            />
          </View>
        ) : (
          <View style={styles.connectionContainContainer}>
            <Text style={styles.connectionSubTitle}>S'inscrire</Text>
            <Signup
              setView={setView}
              onTokenChange={onTokenChange}
            />
          </View>
        )}
      </View>}
    </ScrollView>
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
