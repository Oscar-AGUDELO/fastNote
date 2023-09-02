import React, { useContext, useEffect, useState } from "react";
import { Address } from "../components/purchaseProces/Address";
import { MainContext } from "../MainContexts";
import { Notification } from "../components/Notification";
import { IAddressOrder, IPurchaseProces } from "../interfaces";
import { Payment } from "../components/purchaseProces/Payment";
import { Confirmation } from "../components/purchaseProces/Confirmation";
import { Cart } from "../components/purchaseProces/Cart";
import { useMutation } from "@apollo/client";
import {
  createOrder,
  updateCart,
  verifyReservationsList,
} from "../graphql/cart";
import indexTexts from "../assets/indexTexts.json";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
const { width, height } = Dimensions.get("window");

export function PurchaseProces({ navigation }) {
  const Main = useContext(MainContext);
  useEffect(() => {
    Main.refetch();
  }, []);
  const [notification, setNotification] = useState(false);
  const [orderId, setOrderId] = useState<number | undefined>();
  const [view, setView] = useState<IPurchaseProces>({
    cart: true,
    address: false,
    payment: false,
    confirmation: false,
  });
  // un useeffect si view.cart o view.payment true, update cart avec les infos de address
  const [address, setAddress] = useState<IAddressOrder>({
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

  const [doSaveReservations] = useMutation(verifyReservationsList);
  const verifyReservations = async () => {
    await Main?.refetch();
    try {
      const { data } = await doSaveReservations({
        variables: {
          id: Main?.user?.cart.id,
        },
      });
      if (data.verifyReservationsList) {
        setView({
          cart: false,
          address: true,
          payment: false,
          confirmation: false,
        });
        console.log("Alls reservations are availables");
      } else {
        console.log("A reservaton is not available");
        setNotification(true);
      }
    } catch {
      console.log("error updateCart");
      setNotification(true);
    }
  };

  const [doUpdateCart] = useMutation(updateCart);
  const saveAddress = async () => {
    await Main?.refetch();
    try {
      const { data } = await doUpdateCart({
        variables: {
          data: {
            billingfirstname: address.billing?.firstname,
            billingLastname: address.billing?.lastname,
            billingAdress: address.billing?.address,
            deliveryfirstname: address.delivery?.firstname,
            deliveryLastname: address.delivery?.lastname,
            deliveryAdress: address.delivery?.address,
          },
          id: Main?.user?.cart.id,
        },
      });
      if (data) {
        console.log("Cart Modified");
      } else {
        console.log("Cart Not Modified");
        setNotification(true);
      }
    } catch {
      console.log("error updateCart");
      setNotification(true);
    }
  };
  const [doCreateOrder] = useMutation(createOrder);
  const toPay = async () => {
    try {
      const { data } = await doCreateOrder();
      if (data) {
        console.log("Je paie");
        setOrderId(data.createOrder.id);
      } else {
        console.log("Je peux pas payer");
        setNotification(true);
      }
    } catch {
      console.log("error createOrder");
      setNotification(true);
    }
    // Ici post api createOrder, next setOrderId avec res => id new order
  };
  const resetBasket = async () => {
    await Main?.refetch();
    setView({
      cart: true,
      address: false,
      payment: false,
      confirmation: false,
    });
  };
  console.log(Main.user?.cart);
  return (
    <ScrollView style={styles.purchaseProcesContainer}>
      {notification && (
        <Modal animationType="slide" transparent={true} visible={notification}>
          <Notification
            icon="error"
            type="validation"
            message={
              Main?.user
                ? indexTexts.purchaseProcesNotificationMessage
                : "Connectez vous ou créez un compte !"
            }
            textButton={
              Main?.user
                ? indexTexts.purchaseProcesNotificationTextButton
                : "Aller à la page de connexion"
            }
            onValidate={() => {
              if (!Main?.user) {
                setNotification(false);
                navigation.navigate("Connexion");
              } else {
                setNotification(false);
                Main.refetch();
              }
            }}
          />
        </Modal>
      )}
      <View style={styles.purchaseProcesBarStatusContainer}>
        <Text
          style={[
            view.cart
              ? styles.purchaseProcesBarStatusItemOn
              : styles.purchaseProcesBarStatusItemOff,
            { borderBottomLeftRadius: 15, borderTopLeftRadius: 15 },
          ]}
        >
          Panier
        </Text>
        <Text
          style={
            view.address
              ? styles.purchaseProcesBarStatusItemOn
              : styles.purchaseProcesBarStatusItemOff
          }
        >
          Adresse
        </Text>
        <Text
          style={
            view.payment
              ? styles.purchaseProcesBarStatusItemOn
              : styles.purchaseProcesBarStatusItemOff
          }
        >
          Paiment
        </Text>
        <Text
          style={[
            view.confirmation
              ? styles.purchaseProcesBarStatusItemOn
              : styles.purchaseProcesBarStatusItemOff,
            { borderTopRightRadius: 15, borderBottomRightRadius: 15 },
          ]}
        >
          Confirmation
        </Text>
      </View>
      <View style={styles.purchaseProcesContainContainer}>
        {view.cart && (
          <Cart
            navigation={navigation}
            onValidateCart={
              Main?.user?.cart?.reservations.length > 0
                ? () => verifyReservations()
                : undefined
            }
          />
        )}
        {view.address && <Address address={address} setAddress={setAddress} />}
        {view.payment && <Payment />}
        {view.confirmation && <Confirmation orderId={orderId} />}
      </View>
      {!view.cart && !view.confirmation && (
        <View style={styles.purchaseProcesButtonsContainer}>
          <TouchableOpacity
            style={styles.purchaseProcesButtonsBack}
            onPress={async () => {
              if (view.address) {
                await saveAddress();
                await Main?.refetch();
                setView({
                  cart: true,
                  address: false,
                  payment: false,
                  confirmation: false,
                });
              }
              if (view.payment) {
                setView({
                  cart: false,
                  address: true,
                  payment: false,
                  confirmation: false,
                });
              }
            }}
          >
            <Text style={styles.purchaseProcesButtonsBackText}>Précédent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.purchaseProcesButtonsNext}
            onPress={async () => {
              if (view.address) {
                await saveAddress();
                await Main?.refetch();
                setView({
                  cart: false,
                  address: false,
                  payment: true,
                  confirmation: false,
                });
              }
              if (view.payment) {
                await toPay();
                setView({
                  cart: false,
                  address: false,
                  payment: false,
                  confirmation: true,
                });
                setTimeout(() => {
                  resetBasket();
                }, 5000);
              }
            }}
          >
            <Text style={styles.purchaseProcesButtonsNextText}>
              {view.payment ? "Payer ma commande" : "Continuer"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {view.confirmation && (
        <View style={styles.purchaseProcesButtonsContainer2}>
          <TouchableOpacity
            style={styles.purchaseProcesButtonsNext}
            onPress={() => {
              resetBasket();
              navigation.navigate("Accueil");
            }}
          >
            <Text style={styles.purchaseProcesButtonsNextText}>
              Revenir à la page d'acceuil
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
const white = "#ffffff";
const styles = StyleSheet.create({
  purchaseProcesContainer: {
    backgroundColor: white,
    padding: 10,
  },
  purchaseProcesBarStatusContainer: {
    width: width - 20, // padding: 10x2 purchaseProcesContainer
    alignItems: "center",
    flexDirection: "row",
    height: 30,
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 30,
  },
  purchaseProcesContainContainer: {},
  purchaseProcesBarStatusItemOn: {
    backgroundColor: "#AEF3DA",
    paddingHorizontal: 9,
    paddingVertical: 5,
    fontWeight: "500",
    color: "#343A55",
  },
  purchaseProcesBarStatusItemOff: {
    backgroundColor: "#343A55",
    paddingHorizontal: 9,
    paddingVertical: 5,
    fontWeight: "400",
    color: white,
  },
  purchaseProcesButtonsContainer: {
    width: width - 40, // marginHorizontal: 10x2 + padding: 10x2 (at purchaseProcesContainer)
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 60,
    marginHorizontal: 10,
  },
  purchaseProcesButtonsContainer2: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 60,
  },
  purchaseProcesButtonsBack: {
    backgroundColor: "#AEF3DA",
    padding: 10,
    borderRadius: 50,
  },
  purchaseProcesButtonsBackText: {
    color: "#343A55",
  },
  purchaseProcesButtonsNext: {
    backgroundColor: "#343A55",
    padding: 10,
    borderRadius: 50,
  },
  purchaseProcesButtonsNextText: {
    color: white,
  },
});
