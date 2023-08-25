import { useQuery } from "@apollo/client";
import React, { createContext, useEffect, useState } from "react";
import { me } from "./graphql/gql";
import { IDATA, IUser } from "./interfaces";
interface IDATAProvider {
  children?: React.ReactNode;
}

export const DATAContext = createContext<IDATA>({
  screenMode: "horizontal",
  burger: false,
  setBurger: () => {},
  user: null,
  refetchUser: () => {},
});

export const DATAProvider: React.FunctionComponent<IDATAProvider> = ({
  children,
}: IDATAProvider): JSX.Element => {
  // __________________________________________________________________________

  const [screen, setScreen] = useState(window.innerWidth);
  const [screenMode, setScreenMode] = useState<"horizontal" | "vertical">(
    "horizontal"
  );
  useEffect(() => {
    const changeWidth = (): void => {
      setScreen(window.innerWidth);
    };
    window.addEventListener("resize", changeWidth);

    return (): void => {
      window.removeEventListener("resize", changeWidth);
    };
  }, []);
  useEffect(() => {
    if (screen <= 805) {
      setScreenMode("vertical");
    }
    if (screen >= 806) {
      setScreenMode("horizontal");
    }
  }, [screen]);
  // __________________________________________________________________________

  const [burger, setBurger] = useState(false);

  // __________________________________________________________________________

  const [user, setUser] = useState<IUser | null>(null);
  const getUser = useQuery(me, {
    fetchPolicy: "network-only",
    errorPolicy: "ignore",
  });
  useEffect(() => {
    if (getUser.error) {
      setUser(null);
    }
  }, [getUser.error]);

  useEffect(() => {
    if (getUser.data) {
      if (getUser.data.me) {
        setUser(getUser.data.me);
      }
    } else {
      setUser(null);
    }
  }, [getUser.data]);
  const refetchUser = () => {
    getUser.refetch();
  };

  return (
    <DATAContext.Provider
      value={{
        screenMode,
        burger,
        setBurger,
        user,
        refetchUser,
      }}
    >
      {children}
    </DATAContext.Provider>
  );
};
