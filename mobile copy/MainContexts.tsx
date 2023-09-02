import { useMutation, useQuery } from "@apollo/client";
import React, { createContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { me, saveTokenNotificationPush } from "./graphql/connection";
import { ICategory, INotificationPush, IUser } from "./interfaces";
import { getCategories } from "./graphql/Category";
interface IMainProvider {
  expoPushToken?: string;
  children?: React.ReactNode;
}
export interface IMainContexts {
  user: IUser | null | undefined;
  setUser: Function;
  refetch: Function;
  categorie: string;
  setCategorie: Function;
  categories: ICategory[] | [];
  notificationPush: INotificationPush | {};
  setNotificationPush: Function;
}

export const MainContext = createContext<IMainContexts | null>(null);

export const MainProvider: React.FunctionComponent<IMainProvider> = ({
  expoPushToken,
  children,
}: IMainProvider): JSX.Element => {
  const [categorie, setCategorie] = useState("");
  const [user, setUser] = useState<IUser | null | undefined>(undefined);
  const { data, refetch, error } = useQuery(me, {
    fetchPolicy: "network-only",
    errorPolicy: "ignore",
  });

  useEffect(() => {
    if (error) {
      setUser(undefined);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      if (data.me) {
        setUser(data.me);
        console.log("User connected");
      }
    }
  }, [data]);
  console.log(user);

  const [categories, setCategories] = useState<ICategory[] | []>([]);
  const categoriesData = useQuery(getCategories, {});

  useEffect(() => {
    if (error) {
      setUser(undefined);
    }
  }, [categoriesData.error]);

  useEffect(() => {
    if (categoriesData.data) {
      if (categoriesData.data) {
        setCategories(categoriesData.data.categories);
        console.log("Categories getted");
      }
    }
  }, [categoriesData.data]);
  const [doSaveTokenNotificationPush] = useMutation(saveTokenNotificationPush);
  const newSaveTokenNotificationPush = async (tokenNotificationPush) => {
    try {
      const { data } = await doSaveTokenNotificationPush({
        variables: {
          token: tokenNotificationPush,
          userId: user?.id ? user?.id : "",
        },
      });
      if (data) {
        console.log(data);
      }
    } catch {
      console.log("error save notification push");
    }
  };
  useEffect(() => {
    if (expoPushToken) {
      console.log(expoPushToken);
      newSaveTokenNotificationPush(expoPushToken);
    }
  }, [expoPushToken, user]);

  const [notificationPush, setNotificationPush] = useState<
    INotificationPush | {}
  >();
  return (
    <MainContext.Provider
      value={{
        user,
        setUser,
        refetch,
        categorie,
        setCategorie,
        categories,
        notificationPush,
        setNotificationPush,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
