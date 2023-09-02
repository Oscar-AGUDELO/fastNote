import React, { useContext, useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Button,
  Modal,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { MainContext } from "../../MainContexts";
import { useMutation } from "@apollo/client";
import { deleteReservation, updateReservation } from "../../graphql/cart";
import { IReservation } from "../../interfaces";
const { width, height } = Dimensions.get("window");
import { Notification } from "..//Notification";
import { me } from "../../graphql/connection";

export function Cart({
  onValidateCart,
  navigation,
}: {
  onValidateCart: Function | undefined;
  navigation: any;
}): JSX.Element {
  const [notification, setNotification] = useState(false);
  function addDays(date, days) {
    const copyDate = new Date(Number(date));
    copyDate.setDate(date.getDate() + days);
    return copyDate;
  }
  const Main = useContext(MainContext);
  const today = new Date();
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [reservationIdToUpdate, setReservationIdToUpdate] = useState<number>();
  const [totalCart, setTotalCart] = useState<number>();
  const [doUpdateReservation] = useMutation(updateReservation);
  const onChangeReservation = async (
    reservation: IReservation,
    newData: { newQuantity?: number; newStartDate?: Date; newEndDate?: Date }
  ) => {
    try {
      const { data } = await doUpdateReservation({
        variables: {
          data: {
            productId: reservation.product.id,
            quantity: newData.newQuantity
              ? newData.newQuantity
              : reservation.quantity,
            startDate: newData.newStartDate
              ? newData.newStartDate
              : reservation.startDate,
            endDate: newData.newEndDate
              ? newData.newEndDate
              : reservation.endDate,
          },
          id: reservation.id,
        },
      });
      if (data) {
        if (showStartDate) {
          setShowStartDate(false);
          setReservationIdToUpdate(undefined);
        }
        if (showEndDate) {
          setReservationIdToUpdate(undefined);
          setShowEndDate(false);
        }
        console.log("update revervated");
      } else {
        console.log("update reservaton problem");
      }
    } catch {
      console.log("error update reservation");
    }
  };
  const onChangeReservationStartDate = async (
    event: DateTimePickerEvent,
    selectedDate,
    reservation
  ) => {
    setShowStartDate(false);
    setReservationIdToUpdate(undefined);
    if (event.type === "set") {
      const newData = { newStartDate: selectedDate };
      await onChangeReservation(reservation, newData);
      setShowStartDate(false);
      await Main.refetch();
    }
  };
  const onChangeReservationEndDate = async (
    event,
    selectedDate,
    reservation
  ) => {
    setReservationIdToUpdate(undefined);
    setShowEndDate(false);
    if (event.type === "set") {
      const newData = { newEndDate: selectedDate };
      await onChangeReservation(reservation, newData);
      setShowEndDate(false);
      await Main.refetch();
    }
  };
  const convertoFrDate = (date: Date) => {
    const yyyy = String(date.getFullYear());
    let mm = String(date.getMonth() + 1); // Months start at 0!
    if (Number(mm) < 10) mm = "0" + mm;
    let dd = String(date.getDate());
    if (Number(dd) < 10) dd = "0" + dd;
    const formattedDate = dd + "/" + mm + "/" + yyyy;
    return formattedDate;
  };
  useEffect(() => {
    const totalOfReservations = Main?.user?.cart?.reservations.map(
      (reservation) =>
        reservation.product.price *
        reservation.quantity *
        Math.ceil(
          (new Date(reservation.endDate).getTime() -
            new Date(reservation.startDate).getTime()) /
            (1000 * 3600 * 24)
        )
    );
    if (totalOfReservations) {
      const addReservations = totalOfReservations.reduce((a, b) => {
        return a + b;
      }, 0);
      if (addReservations) {
        setTotalCart(addReservations);
      }
    }
  });
  const [doDeleteReservation, { loading, error }] =
    useMutation(deleteReservation);

  const deleteResa = async (idReservation) => {
    await doDeleteReservation({
      variables: {
        id: idReservation,
      },
    });
    await Main.refetch();
    setNotification(false);
  };
  return (
    <View
    // className="addressContainer"
    >
      {Main?.user?.cart?.reservations.length > 0 ? (
        Main?.user?.cart?.reservations
          .sort((a, b) => a.id - b.id)
          .map((reservation) => (
            <View key={reservation.id} style={styles.containerCard}>
              {notification && (
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={notification}
                >
                  <Notification
                    icon="error"
                    type="validation"
                    message={"Voulez‑vous vraiment supprimer cet article ?"}
                    textButton={"Supprimer"}
                    onValidate={() => {
                      deleteResa(reservation.id);
                    }}
                    onClose={() => {
                      setNotification(false);
                    }}
                    textButton2={"Annuler"}
                  />
                </Modal>
              )}
              <Image
                style={styles.tinyLogo}
                source={{ uri: reservation.product.image }}
              />
              <View style={styles.containerInfo}>
                <Text style={styles.containerInfoName}>
                  {reservation.product.name}
                </Text>
                <View style={styles.containerInfo2}>
                  <Text>Prix : </Text>
                  <Text style={styles.price}>
                    {reservation.product.price} € / jour
                  </Text>
                </View>
                <View style={styles.containerInfo2}>
                  <Text>Quantité : </Text>
                  <Button
                    onPress={async () => {
                      if (reservation.quantity > 1) {
                        const newData = {
                          newQuantity: reservation.quantity - 1,
                        };
                        await onChangeReservation(reservation, newData);
                        await Main.refetch();
                      }
                      if (reservation.quantity === 1) {
                        setNotification(true);
                      }
                    }}
                    title="-"
                    color="#343A55"
                  />
                  <Text style={styles.quantity}>{reservation.quantity}</Text>
                  <Button
                    onPress={async () => {
                      if (reservation.quantity < reservation.product.quantity) {
                        const newData = {
                          newQuantity: reservation.quantity + 1,
                        };
                        await onChangeReservation(reservation, newData);
                        await Main.refetch();
                      }
                    }}
                    title="+"
                    color="#343A55"
                  />
                </View>
                <View style={styles.containerInfo2}>
                  <Text>Du : </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setReservationIdToUpdate(reservation.id);
                      setShowStartDate(true);
                    }}
                    style={styles.addButton}
                  >
                    <Text style={styles.addIcon}>
                      {reservation.startDate &&
                        convertoFrDate(new Date(reservation.startDate))}
                    </Text>
                  </TouchableOpacity>
                  {showStartDate &&
                    reservationIdToUpdate === reservation.id && (
                      <DateTimePicker
                        dateFormat="day month year"
                        testID="dateTimePicker"
                        value={new Date(reservation.startDate)}
                        mode="date"
                        locale={"fr"}
                        is24Hour={true}
                        minimumDate={today}
                        maximumDate={new Date(reservation.endDate)}
                        onChange={(event, date) => {
                          onChangeReservationStartDate(
                            event,
                            date,
                            reservation
                          );
                        }}
                      />
                    )}
                </View>
                <View style={styles.containerInfo2}>
                  <Text>Au : </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setReservationIdToUpdate(reservation.id);
                      setShowEndDate(true);
                    }}
                    style={styles.addButton}
                  >
                    <Text style={styles.addIcon}>
                      {reservation.endDate &&
                        convertoFrDate(new Date(reservation.endDate))}
                    </Text>
                  </TouchableOpacity>
                  {showEndDate && reservationIdToUpdate === reservation.id && (
                    <DateTimePicker
                      dateFormat="day month year"
                      testID="dateTimePicker"
                      value={new Date(reservation.endDate)}
                      mode="date"
                      is24Hour={true}
                      locale={"fr"}
                      minimumDate={addDays(new Date(reservation.startDate), 1)}
                      onChange={(event, date) => {
                        onChangeReservationEndDate(event, date, reservation);
                      }}
                    />
                  )}
                </View>
                <View style={styles.containerInfo2}>
                  <Text>Subtotal : </Text>
                  <Text style={styles.price}>
                    {reservation.product.price *
                      reservation.quantity *
                      Math.ceil(
                        (new Date(reservation.endDate).getTime() -
                          new Date(reservation.startDate).getTime()) /
                          (1000 * 3600 * 24)
                      )}
                    €
                  </Text>
                </View>
              </View>
            </View>
          ))
      ) : (
        <View style={styles.containerInfo3}>
          <Text style={styles.title2}>Panier vide</Text>
          <TouchableOpacity
            style={styles.purchaseProcesButtonsNext}
            // className="addressFormFieldAddress"
            // type="button"
            onPress={() => {
              navigation.navigate("Produits");
            }}
          >
            <Text style={styles.purchaseProcesButtonsNextText}>Réserver</Text>
          </TouchableOpacity>
        </View>
      )}
      {!Main?.user?.id && (
        <View style={styles.containerInfo3}>
          <Text style={styles.title2}>Connectez-vous !</Text>
          <TouchableOpacity
            style={styles.purchaseProcesButtonsNext}
            onPress={() => {
              navigation.navigate("Connexion");
            }}
          >
            <Text style={styles.purchaseProcesButtonsNextText}>
              Aller à la page de connexion
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {onValidateCart && (
        <View style={styles.purchaseProcesButtonsContainerCenter}>
          <View style={styles.containerCard}>
            <Text>Total : </Text>
            <Text>{totalCart ? totalCart : 0}€</Text>
          </View>
          <TouchableOpacity
            style={styles.purchaseProcesButtonsNext}
            // className="addressFormFieldAddress"
            // type="button"
            onPress={() => {
              onValidateCart();
            }}
          >
            <Text style={styles.purchaseProcesButtonsNextText}>
              Valider panier
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const white = "#ffffff";
const styles = StyleSheet.create({
  containerCard: {
    borderRadius: 15,
    backgroundColor: "#FFFBFE",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
  },
  tinyLogo: {
    borderRadius: 8,
    width: "40%",
    height: "100%",
    marginRight: 10,
  },
  containerInfo: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
  containerInfoName: {
    fontSize: 15,
    width: "60%",
    display: "flex",
    textAlign: "center",
    height: 23,
    fontWeight: "500",
    marginTop: 5,
    marginBottom: 0,
    paddingRight: 10,
  },
  price: {
    fontSize: 15,
  },
  containerInfo2: {
    flexDirection: "row",
    width: "60%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingRight: 10,
  },
  quantity: {
    fontSize: 15,
    alignItems: "center",
    textAlignVertical: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    height: "100%",
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: 5,
  },
  addIcon: {
    borderRadius: 50,
    color: white,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#343A55",
  },
  containerInfo3: {
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    paddingRight: 10,
  },
  purchaseProcesButtonsContainerCenter: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    marginBottom: 100,
  },
  purchaseProcesButtonsNext: {
    backgroundColor: "#343A55",
    padding: 10,
    borderRadius: 50,
  },
  purchaseProcesButtonsNextText: {
    color: white,
  },
  title: {
    color: "#343A55",
  },
  title2: {
    color: "#343A55",
    marginBottom: 10,
  },
});
