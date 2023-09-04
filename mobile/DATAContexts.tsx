import { useQuery } from "@apollo/client";
import React, { createContext, useEffect, useState } from "react";
import { me } from "./graphql/gql";
import { IDATA, IUser } from "./interfaces";
interface IDATAProvider {
  children?: React.ReactNode;
}

export const DATAContext = createContext<IDATA>({
  user: null,
  refetchUser: () => { },
});

export const DATAProvider: React.FunctionComponent<IDATAProvider> = ({
  children,
}: IDATAProvider): JSX.Element => {
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
        user,
        refetchUser,
      }}
    >
      {children}
    </DATAContext.Provider>
  );
};
