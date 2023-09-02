import React, { useContext, useEffect } from "react";
import { IAddressComponent } from "../../interfaces";
import { MainContext } from "../../MainContexts";
import { TextInput, View, Text, StyleSheet } from "react-native";

export function Address({
  address,
  setAddress,
}: IAddressComponent): JSX.Element {
  const Main = useContext(MainContext);
  useEffect(() => {
    const start = async () => {
      await Main?.refetch();
      if (Main?.user) {
        setAddress({
          delivery: {
            lastname: Main?.user?.cart.deliveryLastname
              ? Main?.user?.cart.deliveryLastname
              : Main?.user?.lastname
              ? Main?.user?.lastname
              : "",
            firstname: Main?.user?.cart.deliveryfirstname
              ? Main?.user?.cart.deliveryfirstname
              : Main?.user?.firstname
              ? Main?.user?.firstname
              : "",
            address: Main?.user?.cart.deliveryAdress
              ? Main?.user?.cart.deliveryAdress
              : Main?.user?.deliveryAdress
              ? Main?.user?.deliveryAdress
              : "",
          },
          billing: {
            lastname: Main?.user?.cart.billingLastname
              ? Main?.user?.cart.billingLastname
              : Main?.user?.lastname
              ? Main?.user?.lastname
              : "",
            firstname: Main?.user?.cart.billingfirstname
              ? Main?.user?.cart.billingfirstname
              : Main?.user?.firstname
              ? Main?.user?.firstname
              : "",
            address: Main?.user?.cart.billingAdress
              ? Main?.user?.cart.billingAdress
              : Main?.user?.deliveryAdress
              ? Main?.user?.deliveryAdress
              : "",
          },
        });
      }
    };
    start();
  }, []);
  return (
    <View style={styles.addressContainer}>
      <View>
        <Text style={styles.addressFormTitle1}>Adresse de facturation</Text>
        <View>
          <View style={styles.adressInputContainer}>
            <View style={styles.adressInputContainer1}>
              <Text style={styles.adressInputTitle}>Nom</Text>
              <TextInput
                style={styles.adressInputField}
                value={address.billing?.lastname}
                onChangeText={(text) =>
                  setAddress({
                    ...address,
                    billing: { ...address.billing, lastname: text },
                  })
                }
              />
            </View>
          </View>
          <View style={styles.adressInputContainer}>
            <View style={styles.adressInputContainer1}>
              <Text style={styles.adressInputTitle}>Prénom</Text>
              <TextInput
                style={styles.adressInputField}
                value={address.billing?.firstname}
                onChangeText={(text) =>
                  setAddress({
                    ...address,
                    billing: { ...address.billing, firstname: text },
                  })
                }
              />
            </View>
          </View>
          <View style={styles.adressInputContainer}>
            <View style={styles.adressInputContainer1}>
              <Text style={styles.adressInputTitle}>Adresse</Text>
              <TextInput
                style={styles.adressInputField}
                value={address.billing?.address}
                onChangeText={(text) =>
                  setAddress({
                    ...address,
                    billing: { ...address.billing, address: text },
                  })
                }
              />
            </View>
          </View>
        </View>
        <Text style={styles.addressFormTitle}>Adresse de livraison</Text>
        <View>
          <View style={styles.adressInputContainer}>
            <View style={styles.adressInputContainer1}>
              <Text style={styles.adressInputTitle}>Nom*</Text>
              <TextInput
                style={styles.adressInputField}
                value={address.delivery?.lastname}
                onChangeText={(text) => {
                  setAddress({
                    ...address,
                    delivery: { ...address.delivery, lastname: text },
                  });
                }}
              />
            </View>
          </View>
          <View style={styles.adressInputContainer}>
            <View style={styles.adressInputContainer1}>
              <Text style={styles.adressInputTitle}>Prénom*</Text>
              <TextInput
                style={styles.adressInputField}
                value={address.delivery?.firstname}
                onChangeText={(text) =>
                  setAddress({
                    ...address,
                    delivery: { ...address.delivery, firstname: text },
                  })
                }
              />
            </View>
          </View>
          <View style={styles.adressInputContainer}>
            <View style={styles.adressInputContainer1}>
              <Text style={styles.adressInputTitle}>Adresse*</Text>
              <TextInput
                style={styles.adressInputField}
                value={address.delivery?.address}
                onChangeText={(text) =>
                  setAddress({
                    ...address,
                    delivery: { ...address.delivery, address: text },
                  })
                }
              />
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
  addressFormTitle: {
    marginTop: 30,
    color: "#343A55",
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
