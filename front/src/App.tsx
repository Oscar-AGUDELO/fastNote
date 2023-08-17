import "./App.css";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Home } from "./pages/home";
import { Notes } from "./pages/notes";
import { NewNote } from "./pages/new";
import { Note } from "./pages/note";
import { Trash } from "./pages/trash";
import Nav from "./components/nav";
import { DATAContext } from "./DATAContexts";
import { useContext, useEffect, useState } from "react";
import { Account } from "./pages/account";
import { NotFound } from "./pages/notFound";

export const App = () => {
  return (
    <Router>
      <Nav>
        <Routes>
          <Route
            path="/"
            element={
              <Redirect>
                <Home />
              </Redirect>
            }
          />

          <Route
            path="/account"
            element={
              <Redirect>
                <Account />
              </Redirect>
            }
          />
          <Route
            path="/new"
            element={
              <Redirect>
                <NewNote />
              </Redirect>
            }
          />
          <Route
            path="/note/:noteId"
            element={
              <Redirect>
                <Note />
              </Redirect>
            }
          />
          <Route
            path="/notes"
            element={
              <Redirect>
                <Notes />
              </Redirect>
            }
          />
          <Route
            path="/trash"
            element={
              <Redirect>
                <Trash />
              </Redirect>
            }
          />
          <Route
            path="/*"
            element={
              <Redirect>
                <NotFound />
              </Redirect>
            }
          />
        </Routes>
      </Nav>
    </Router>
  );
};

export const Redirect = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(DATAContext);
  const [redirectTo, setRedirectTo] = useState<string>();
  const location = useLocation();

  const getCookie = (cName: string): string => {
    const name = `${cName}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };
  const setCookie = (cName: string, cValue: string, expDays: number): void => {
    const date = new Date();
    date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${cName}=${cValue}; ${expires}; path=/`;
  };
  useEffect(() => {
    const redirectToCookie = getCookie("redirectTo");
    if (!user && location.pathname !== "/account") {
      setCookie("redirectTo", location.pathname, 0.053);
      setRedirectTo("/account");
    }
    if (!user && location.pathname === "/account") {
      setRedirectTo(undefined);
    }
    if (user && location.pathname === "/account") {
      if (redirectToCookie) {
        setRedirectTo(redirectToCookie);
      } else {
        setRedirectTo("/");
      }
    }
    if (user && location.pathname !== "/account") {
      setCookie("redirectTo", "", -1);
      setRedirectTo(undefined);
    }
  }, [location, user]);
  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  } else {
    return children;
  }
};
