import React, { useEffect, useState } from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Button,
  Modal,
  SafeAreaView,
  FlatList,
} from "react-native";
import { IProduct } from "../../interfaces";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation } from "@apollo/client";
import { createReservation } from "../../graphql/cart";
const { width, height } = Dimensions.get("window");

interface IProductDetailsProps {
  product: IProduct | null;
  closeProductDetails: Function;
  navigation: any;
}

export function NewReservation({
  navigation,
  product,
  closeProductDetails,
}: IProductDetailsProps) {
  function addDays(date, days) {
    const copyDate = new Date(Number(date));
    copyDate.setDate(date.getDate() + days);
    return copyDate;
  }
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [showStartDate, setShowStartDate] = useState(false);
  const [endDate, setEndDate] = useState(addDays(today, 1));
  const [showEndDate, setShowEndDate] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [doCreateReservation] = useMutation(createReservation);
  const onReservate = async () => {
    try {
      const { data } = await doCreateReservation({
        variables: {
          data: {
            productId: product.id,
            quantity,
            startDate,
            endDate,
          },
        },
      });
      if (data) {
        navigation.navigate("Panier");
        closeProductDetails();
        console.log("revervated");
      } else {
        console.log("reservaton problem");
      }
    } catch {
      console.log("error");
    }
  };
  const onChangeStartDate = (event: DateTimePickerEvent, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate;
      setStartDate(currentDate);
      setShowStartDate(false);
    }
    setShowStartDate(false);
  };
  const onChangeEndDate = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate;
      setShowEndDate(false);
      setEndDate(currentDate);
    }
    setShowEndDate(false);
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

  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
  );
  const totalPrice = quantity * product.price * totalDays;

  if (product !== null && product.disponibility) {
    return (
      <View key={product.id} style={styles.container}>
        <View style={styles.backgroundF} />
        <TouchableOpacity
          onPress={() => {
            closeProductDetails();
          }}
          style={styles.closeButton}
        >
          <Text style={styles.closeText}>x</Text>
        </TouchableOpacity>
        <View style={styles.containerContain}>
          <View style={styles.containerContain1}>
            <View>
              <Text>Date de début</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowStartDate(true);
                }}
                style={styles.addButton}
              >
                <Text style={styles.addIcon}>{convertoFrDate(startDate)}</Text>
              </TouchableOpacity>
              {showStartDate && (
                <DateTimePicker
                  dateFormat="day month year"
                  testID="dateTimePicker"
                  value={startDate}
                  mode="date"
                  locale={"fr"}
                  is24Hour={true}
                  minimumDate={today}
                  maximumDate={endDate}
                  onChange={(event, date) => onChangeStartDate(event, date)}
                />
              )}
            </View>
            <View>
              <Text>Date de fin</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowEndDate(true);
                }}
                style={styles.addButton}
              >
                <Text style={styles.addIcon}>{convertoFrDate(endDate)}</Text>
              </TouchableOpacity>
              {showEndDate && (
                <DateTimePicker
                  dateFormat="day month year"
                  testID="dateTimePicker"
                  value={endDate}
                  mode="date"
                  is24Hour={true}
                  locale={"fr"}
                  minimumDate={addDays(startDate, 1)}
                  onChange={(event, date) => onChangeEndDate(event, date)}
                />
              )}
            </View>

            <View>
              <Text>Quantité</Text>
              <Button
                onPress={() => {
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                  }
                }}
                title="-"
                color="grey"
              />
              <Text>{quantity}</Text>
              <Button
                onPress={() => {
                  if (quantity < product.quantity) {
                    setQuantity(quantity + 1);
                  }
                }}
                title="+"
                color="grey"
              />
            </View>
            <View style={styles.containerContain2}>
              <Text style={styles.containerName}>{product.name}</Text>
              <Text style={styles.containerPrice}>{product.price}€ / jour</Text>
            </View>
            <Text>{totalPrice} €</Text>
            <Text>
              {totalDays} {totalDays <= 1 ? "jour" : "jours"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                onReservate();
              }}
              style={styles.addButton}
            >
              <Text style={styles.addIcon}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
}

const white = "#ffffff";
const styles = StyleSheet.create({
  backgroundF: {
    height: height,
    backgroundColor: "black",
    opacity: 0.3,
    zIndex: 0,
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
  },
  closeButton: {
    zIndex: 1,
    position: "absolute",
    right: 15,
    top: 15,
  },
  closeText: {
    fontSize: 30,
    borderRadius: 500,
    backgroundColor: white,
    color: "black",
    height: 35,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 35,
    lineHeight: 33,
  },
  container: {
    alignItems: "center",
    height: height,
    width: width,
    justifyContent: "center",
  },
  containerContain: {
    backgroundColor: "#FFFBFE",
    borderRadius: 15,
    height: 500,
    width: "80%",
    padding: 10,
  },
  containerContain1: {
    height: 370,
    alignItems: "center",
  },
  tinyLogo: {
    width: "100%",
    height: 320,
  },
  containerContain2: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  containerName: { fontSize: 15, fontWeight: "500" },
  containerPrice: { fontSize: 13, fontWeight: "500" },
  description: {
    height: 80,
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
  cartIcon: {
    fontSize: 30,
  },
});
