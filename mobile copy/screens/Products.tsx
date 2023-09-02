import { useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  SafeAreaView,
  FlatList,
  ScrollView,
  Button,
  Keyboard,
} from "react-native";
import { Notification } from "../components/Notification";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ICategory, IProduct } from "../interfaces";
import { products } from "../graphql/productQueries";
import { ProductCard } from "../components/products/ProductCard";
import { ProductDetails } from "../components/products/ProductDetails";
import { MainContext } from "../MainContexts";
import { NewReservation } from "../components/products/NewReservation";
const { width, height } = Dimensions.get("window");
export function Products({ navigation }) {
  const Main = useContext(MainContext);
  useEffect(() => {
    Main.refetch();
  }, []);
  const { categorie, setCategorie, categories } = Main;
  const [openModalProduct, setOpenModalProduct] = useState(false);
  const [notification, setNotification] = useState(false);
  const [openModalNewReservation, setOpenModalNewReservation] = useState(false);
  const [newReservationProductData, setNewReservationProductData] =
    useState<IProduct>();
  const [openCategories, setOpenCategories] = useState(false);
  const [researchInput, setResearchInput] = useState("");
  const [researchOn, setResearchOn] = useState(false);
  const [researchResult, setResearchResult] = useState<IProduct[]>([]);
  const [productToOpen, setProductToOpen] = useState<IProduct>();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  const { loading, data, refetch } = useQuery<{ products: IProduct[] }>(
    products
  );
  const productsAvailables = data
    ? data.products.filter((item) => item.disponibility)
    : null;
  useEffect(() => {
    if (researchInput.length >= 3) {
      const inputUpperCase = researchInput.toUpperCase();
      const productSorted = productsAvailables.filter(
        (item) =>
          item.name.toUpperCase().includes(inputUpperCase) &&
          (categorie.length >= 1 ? item.category.name === categorie : item)
      );
      setResearchResult(productSorted);
    }
    if (
      productsAvailables &&
      categorie.length >= 1 &&
      researchInput.length === 0
    ) {
      const productSorted = productsAvailables.filter(
        (item) => item.category.name === categorie
      );
      setResearchResult(productSorted);
    }
    if (
      productsAvailables &&
      categorie.length === 0 &&
      researchInput.length === 0
    ) {
      setResearchResult(productsAvailables);
    }
  }, [researchInput, categorie, data]);

  const addOnBasket = (productDATA: IProduct) => {
    if (Main?.user?.id) {
      setOpenModalNewReservation(true);
      setNewReservationProductData(productDATA);
    } else {
      setNotification(true);
      setProductToOpen(undefined);
      setOpenModalProduct(false);
      setNewReservationProductData(undefined);
      setOpenModalNewReservation(false);
    }
  };

  return (
    <View>
      {notification && (
        <Modal animationType="slide" transparent={true} visible={notification}>
          <Notification
            icon="error"
            type="validation"
            message={"Connectez vous ou créez un compte !"}
            textButton={"Aller à la page de connexion"}
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
      {productToOpen && openModalProduct && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModalProduct}
          onRequestClose={() => {
            setProductToOpen(undefined);
            setOpenModalProduct(false);
          }}
        >
          <ProductDetails
            addOnBasket={(productDATA) => {
              addOnBasket(productDATA);
            }}
            closeProductDetails={() => {
              setProductToOpen(undefined);
              setOpenModalProduct(false);
            }}
            product={productToOpen}
          />
        </Modal>
      )}
      {newReservationProductData && openModalNewReservation && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModalNewReservation}
          onRequestClose={() => {
            setNewReservationProductData(undefined);
            setOpenModalNewReservation(false);
          }}
        >
          <NewReservation
            navigation={navigation}
            closeProductDetails={async () => {
              setNewReservationProductData(undefined);
              setOpenModalNewReservation(false);
              await Main.refetch();
            }}
            product={newReservationProductData}
          />
        </Modal>
      )}
      {openCategories && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openCategories}
          onRequestClose={() => {
            setOpenCategories(false);
            setCategorie("");
          }}
        >
          <View style={styles.productsModalCategoriesContainer}>
            <View style={styles.productsModalCategoriesContainer0} />
            <View style={styles.productsModalCategories}>
              <SafeAreaView>
                <View style={styles.productsModalCategorieButtonContainerFirst}>
                  <Button
                    onPress={() => {
                      setOpenCategories(false);
                      setCategorie("");
                    }}
                    title="Tout"
                    color="grey"
                  />
                </View>
                <FlatList
                  data={categories}
                  scrollEnabled
                  renderItem={({ item }) => (
                    <View style={styles.productsModalCategorieButtonContainer}>
                      <Button
                        onPress={() => {
                          setOpenCategories(false);
                          setCategorie(item.name);
                        }}
                        title={item.name}
                        color="grey"
                      />
                    </View>
                  )}
                  keyExtractor={(item) => String(item.id)}
                />
              </SafeAreaView>
            </View>
          </View>
        </Modal>
      )}
      <View
        style={
          researchOn
            ? styles.productsResearchContainerOpen
            : styles.productsResearchContainerClose
        }
      >
        <Ionicons name="search-outline" style={styles.productsResearchIcon} />
        <TextInput
          placeholder="Rechercher"
          style={styles.productsResearchInput}
          value={researchInput}
          onChangeText={(text) => setResearchInput(text)}
          onFocus={(text) => setResearchOn(true)}
          onEndEditing={(e) => setResearchOn(false)}
          cursorColor="black"
          autoFocus
        />
        <View style={styles.productsCategories}>
          <Button
            onPress={() => {
              setOpenCategories(true);
            }}
            title={categorie.length === 0 ? "Categories" : categorie}
            color="grey"
          />
        </View>
      </View>
      <SafeAreaView
        style={
          researchOn
            ? styles.productsListContainerResearchOpen
            : styles.productsListContainerResearchClose
        }
      >
        <FlatList
          style={
            researchResult.length > 1
              ? styles.productsListContainerSomeProducts
              : isKeyboardVisible
              ? styles.productsListContainerOneProductKeyboard
              : styles.productsListContainerOneProduct
          }
          data={researchResult}
          numColumns={2}
          scrollEnabled
          onScroll={() => setResearchOn(false)}
          renderItem={({ item }) => (
            <ProductCard
              addOnBasket={(productDATA: IProduct) => {
                addOnBasket(productDATA);
              }}
              openProduct={(productDATA) => {
                setProductToOpen(productDATA);
                setOpenModalProduct(true);
              }}
              product={item}
            />
          )}
          keyExtractor={(item) => String(item.id)}
        />
      </SafeAreaView>
    </View>
  );
}
const white = "#ffffff";
const styles = StyleSheet.create({
  productsResearchContainerOpen: {
    backgroundColor: "#EFF0ED",
    paddingTop: 20,
    borderTopWidth: 0.5,
    borderTopColor: "#D9D9D9",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  productsResearchContainerClose: {
    backgroundColor: "#EFF0ED",
    borderTopWidth: 0.5,
    paddingTop: 5,
    borderTopColor: "#D9D9D9",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  productsResearchIcon: { fontSize: 25, marginHorizontal: 5 },
  productsResearchInput: { flex: 1 },
  productsModalCategoriesContainer0: {
    backgroundColor: "black",
    opacity: 0.2,
    position: "absolute",
    height: "100%",
    width: width,
    alignItems: "flex-end",
  },
  productsModalCategoriesContainer: {
    width: width,
    marginTop: 56,
    alignItems: "flex-end",
    height: "100%",
  },
  productsModalCategories: {
    width: 170,
    paddingHorizontal: 5,
    backgroundColor: "#EFF0ED",
  },
  productsModalCategorieButtonContainerFirst: {
    marginBottom: 0,
    height: 40,
    backgroundColor: "#EFF0ED",
  },
  productsModalCategorieButtonContainer: {
    marginBottom: 5,
    maxHeight: 50,
    backgroundColor: "#EFF0ED",
  },
  productsCategories: { marginRight: 5 },
  productsListContainerResearchOpen: {
    width: width,
    backgroundColor: "#EFF0ED",
    paddingBottom: 120,
    paddingTop: 10,
    borderTopmWidth: 0.5,
    borderTopColor: "#D9D9D9",
  },
  productsListContainerResearchClose: {
    width: width,
    backgroundColor: "#EFF0ED",
    paddingBottom: 80,
    paddingTop: 10,
    borderTopmWidth: 0.5,
    borderTopColor: "#D9D9D9",
  },
  productsListContainerOneProductKeyboard: {
    flexDirection: "column",
    flexWrap: "wrap",
    width: "200%",
  },
  productsListContainerOneProduct: {
    flexDirection: "column",
    flexWrap: "wrap",
    width: "200%",
  },
  productsListContainerSomeProducts: {
    flexDirection: "column",
    flexWrap: "wrap",
    width: "100%",
  },
});
