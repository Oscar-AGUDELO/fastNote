import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { signin } from "../../graphql/connection";
import { Notification } from "../Notification";
import indexTexts from "../../assets/indexTexts.json";
const eye = require("../../assets/images/oeil.png");
const vue = require("../../assets/images/vue.png");
import { IConnection } from "../../interfaces";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
const { width, height } = Dimensions.get("window");

export function Login({
  setView,
  navigation,
  onTokenChange,
}: IConnection): JSX.Element {
  const [notification, setNotification] = useState(false);
  const [notificationError, setNotificationError] = useState(false);
  const [seePassword, setSeePassword] = useState(false);
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("12345678");
  const [token, setToken] = useState("");

  const [doLoginMutation, { loading, error }] = useMutation(signin);
  async function doLogin() {
    try {
      const { data } = await doLoginMutation({
        variables: {
          email,
          password,
        },
      });
      // data.signin = "uijbsdgbsdogjuvb";
      if (
        data.signin &&
        data.signin !== "user not found" &&
        data.signin !== "verify problem" &&
        data.signin !== "problem"
      ) {
        setNotification(true);
        setToken(data.signin);
      } else {
        setEmail("");
        setPassword("");
        setToken("");
        setNotificationError(true);
      }
    } catch {}
  }
  return (
    <View style={styles.loginContainer}>
      {notificationError && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={notificationError}
        >
          <Notification
            message={indexTexts.loginNotificationErrorMessage}
            textButton={indexTexts.loginNotificationTextErrorButton}
            icon="error"
            type="validation"
            onValidate={() => {
              setNotificationError(false);
            }}
          />
        </Modal>
      )}
      {notification && (
        <Modal animationType="slide" transparent={true} visible={notification}>
          <Notification
            message={indexTexts.loginNotificationMessage}
            textButton={indexTexts.loginNotificationTextButton}
            icon="succes"
            type="validation"
            onValidate={() => {
              onTokenChange(token);
              navigation.navigate("Accueil");
            }}
          />
        </Modal>
      )}
      <View style={styles.loginForm}>
        <View style={styles.loginInputContainer}>
          <View style={styles.loginInputContainer1}>
            <Text style={styles.loginInputTitle}>E-mail*</Text>
            <TextInput
              style={styles.loginInputField}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
        </View>
        <View style={styles.loginInputContainer}>
          <View style={styles.loginInputContainer1}>
            <Text style={styles.loginInputTitle}>Mot de passe*</Text>

            <View style={styles.loginInputPasswordContainer}>
              <TextInput
                style={styles.loginInputField}
                secureTextEntry={seePassword ? false : true}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity onPress={() => setSeePassword(!seePassword)}>
                <Image
                  style={styles.loginFormEyeIcon}
                  source={seePassword ? vue : eye}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.loginQuestionContainer}>
        <Text style={styles.loginQuestion}>Pas encore de compte ?</Text>
        <Text style={styles.loginResponse} onPress={() => setView(false)}>
          S'inscrire
        </Text>
      </View>
      <View style={styles.loginFormValidateContainer}>
        <TouchableOpacity onPress={() => doLogin()}>
          <Text style={styles.loginFormValidateText}>Valider</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const white = "#ffffff";
const styles = StyleSheet.create({
  loginContainer: {
    backgroundColor: "transparent",
    width: width - 40,
    margin: 20,
    alignItems: "center",
  },
  loginForm: {
    width: "100%",
  },
  loginInputContainer: {
    backgroundColor: white,
    height: 55,
    marginTop: 5,
  },
  loginInputContainer1: {
    marginTop: 10,
    backgroundColor: white,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#B7B8B6",
    height: 45,
  },
  loginInputPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginInputTitle: {
    marginLeft: 10,
    color: "#B7B8B6",
    backgroundColor: white,
    paddingHorizontal: 5,
    marginTop: -10,
    alignSelf: "flex-start",
  },
  loginInputField: {
    marginLeft: 10,
    color: "#343A55",
    flex: 1,
  },
  loginFormEyeIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 10,
  },
  loginFormValidateContainer: {
    marginTop: 60,
    backgroundColor: "#343A55",
    color: "#ffffff",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  loginFormValidateText: {
    color: "#ffffff",
  },
  loginQuestionContainer: {
    marginTop: 20,
    flexDirection: "row",
  },
  loginQuestion: {
    color: "#343A55",
  },
  loginResponse: {
    marginLeft: 10,
    fontWeight: "900",
    color: "#343A55",
  },
});
