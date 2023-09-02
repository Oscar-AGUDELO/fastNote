import React, { useContext, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { MainContext } from "../../MainContexts";
const { width, height } = Dimensions.get("window");

export function Payment(): JSX.Element {
  const Main = useContext(MainContext);

  useEffect(() => {
    Main?.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.addressContainer}>
      <View>
        <View>
          <Text style={styles.addressFormTitle1}>Adresse de facturation</Text>
          <View style={styles.paymentInfoContain}>
            <Text style={styles.paymentInfoContainText}>
              {Main?.user?.cart.billingLastname}{" "}
              {Main?.user?.cart.billingfirstname}
            </Text>

            <Text style={styles.paymentInfoContainText}>
              {Main?.user?.cart.billingAdress}
            </Text>
          </View>
          <Text style={styles.addressFormTitle}>Adresse de livraison</Text>
          <View style={styles.paymentInfoContain}>
            <Text style={styles.paymentInfoContainText}>
              {Main?.user?.cart.deliveryLastname}{" "}
              {Main?.user?.cart.deliveryfirstname}
            </Text>
            <Text style={styles.paymentInfoContainText}>
              {Main?.user?.cart.deliveryAdress}
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.addressFormContainer}>
            <Text style={styles.addressFormTitle1}>Mode de paiment</Text>
            <Dropdown
              style={{
                backgroundColor: "#DDDDDD",
                margin: 16,
                paddingHorizontal: 16,
                paddingVertical: 0,
                width: 150,
                borderRadius: 8,
              }}
              containerStyle={{
                marginTop: -45,
                borderRadius: 8,
                marginLeft: -30,
              }}
              backgroundColor={"rgba(0,0,0,0.2)"}
              data={[
                { name: "VISA", value: "VISA" },
                { name: "MasteCard", value: "MasteCard" },
                { name: "Visa Electron", value: "Visa Electron" },
                { name: "American Express", value: "American Express" },
              ]}
              labelField={"name"}
              valueField={"value"}
              onChange={(value) => {}}
            />
          </View>
          <View>
            <View style={styles.adressInputContainer}>
              <View style={styles.adressInputContainer1}>
                <Text style={styles.adressInputTitle}>Nº Carte*</Text>
                <TextInput
                  style={styles.adressInputField}
                  value={"4012 0010 3714 1112"}
                  onChangeText={() => {}}
                />
              </View>
            </View>
            <View style={styles.adressInputContainer}>
              <View style={styles.adressInputContainer1}>
                <Text style={styles.adressInputTitle}>Nom sur la carte*</Text>
                <TextInput
                  style={styles.adressInputField}
                  value={"Ana LOPEZ"}
                  onChangeText={() => {}}
                />
              </View>
            </View>
            <View style={styles.adressInputContainer}>
              <View style={styles.adressInputContainer1}>
                <Text style={styles.adressInputTitle}>Date d'expiration</Text>
                <TextInput
                  style={styles.adressInputField}
                  value={"2024-09-29"}
                  onChangeText={() => {}}
                />
              </View>
            </View>
            <View style={styles.adressInputContainer}>
              <View style={styles.adressInputContainer1}>
                <Text style={styles.adressInputTitle}>Code de sécurité</Text>
                <TextInput
                  style={styles.adressInputField}
                  value={"125"}
                  onChangeText={() => {}}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const white = "#ffffff";
const styles = StyleSheet.create({
  addressContainer: {
    backgroundColor: white,
    padding: 10,
  },
  addressFormTitle1: {
    color: "#343A55",
  },
  paymentInfoContain: {
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    borderColor: "#B7B8B6",
  },
  paymentInfoContainText: {
    color: "#B7B8B6",
  },
  addressFormTitle: {
    marginTop: 30,
    color: "#343A55",
  },
  addressFormContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "space-between",
    marginBottom: -15,
  },
  adressInputContainer: {
    backgroundColor: white,
    height: 55,
    marginTop: 5,
  },
  adressInputContainer1: {
    marginTop: 10,
    backgroundColor: white,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#B7B8B6",
    height: 45,
  },
  adressInputPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  adressInputTitle: {
    marginLeft: 10,
    color: "#B7B8B6",
    backgroundColor: white,
    paddingHorizontal: 5,
    marginTop: -10,
    alignSelf: "flex-start",
  },
  adressInputField: {
    marginLeft: 10,
    color: "#343A55",
    flex: 1,
  },
});
