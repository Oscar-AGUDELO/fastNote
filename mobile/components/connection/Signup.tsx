import React, { useState } from "react";
import { useMutation } from "@apollo/client";
const eye = require("../../assets/images/oeil.png");
const vue = require("../../assets/images/vue.png");
import indexTexts from "../../assets/indexTexts.json";
import { IConnection } from "../../interfaces";
import { createUser } from "../../graphql/gql";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");

export function Signup({
  setView,
  onTokenChange,
}: IConnection): JSX.Element {
  const [seePassword, setSeePassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [doSignupMutation, { loading, error }] = useMutation(createUser);

  async function doSignup() {
    try {
      const { data } = await doSignupMutation({
        variables: {
          data: {
            email,
            password
          },
        },
      });
      if (data.createUser) {
        onTokenChange(data.createUser);
      } else {
        setEmail("");
        setPassword("");
      }
    } catch {
      console.log("errorr rr r");
    }
  }

  return (
    <View style={styles.signupContainer}>
      <View style={styles.signupForm}>
        <View style={styles.signupInputContainer}>
          <View style={styles.signupInputContainer1}>
            <Text style={styles.signupInputTitle}>E-mail*</Text>
            <TextInput
              style={styles.signupInputField}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
        </View>
        <View style={styles.signupInputContainer}>
          <View style={styles.signupInputContainer1}>
            <Text style={styles.signupInputTitle}>Mot de passe*</Text>

            <View style={styles.signupInputPasswordContainer}>
              <TextInput
                style={styles.signupInputField}
                secureTextEntry={seePassword ? false : true}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity onPress={() => setSeePassword(!seePassword)}>
                <Image
                  style={styles.signupFormEyeIcon}
                  source={seePassword ? vue : eye}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.signupQuestionContainer}>
        <Text style={styles.signupQuestion}> Déjà un compte ?</Text>
        <Text style={styles.signupResponse} onPress={() => setView(true)}>
          Se Connecter
        </Text>
      </View>

      <View style={styles.signupFormValidateContainer}>
        <TouchableOpacity onPress={() => doSignup()}>
          <Text style={styles.signupFormValidateText}>Valider</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const color = "#ffffff";
const styles = StyleSheet.create({
  signupContainer: {
    backgroundColor: "transparent",
    width: width - 40,
    margin: 20,
    alignItems: "center",
  },
  signupForm: {
    width: "100%",
  },
  signupInputContainer: {
    backgroundColor: color,
    height: 55,
    marginTop: 5,
  },
  signupInputContainer1: {
    marginTop: 10,
    backgroundColor: color,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#B7B8B6",
    height: 45,
  },
  signupInputPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  signupInputTitle: {
    marginLeft: 10,
    color: "#B7B8B6",
    backgroundColor: color,
    paddingHorizontal: 5,
    marginTop: -10,
    alignSelf: "flex-start",
  },
  signupInputField: {
    marginLeft: 10,
    color: "#343A55",
    flex: 1,
  },
  signupFormEyeIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 10,
  },
  signupFormValidateContainer: {
    marginTop: 60,
    backgroundColor: "#343A55",
    color: "#ffffff",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  signupFormValidateText: {
    color: "#ffffff",
  },
  signupQuestionContainer: {
    marginTop: 20,
    flexDirection: "row",
  },
  signupQuestion: {
    color: "#343A55",
  },
  signupResponse: {
    marginLeft: 10,
    fontWeight: "900",
    color: "#343A55",
  },
});
