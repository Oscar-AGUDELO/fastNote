import { useContext, useState } from "react";
import { createUser, signin } from "../graphql/gql";
import { useMutation } from "@apollo/client";
import { DATAContext } from "../DATAContexts";
import eye from "../assets/images/oeil.png";

export const Account = () => {
  const { refetchUser } = useContext(DATAContext);
  const [view, setView] = useState(true); // true = login, false = signup

  const onTokenChange = async (token: string) => {
    if (token) {
      localStorage.setItem("token", token);
      await refetchUser();
    }
  };
  const [seePassword, setSeePassword] = useState(false);
  const [email, setEmail] = useState("oscar.agudelo.pro@gmail.com");
  const [password, setPassword] = useState("23042015");

  const [doLoginMutation] = useMutation(signin);
  async function doLogin(event: { preventDefault: () => void }) {
    event.preventDefault();
    try {
      const { data } = await doLoginMutation({
        variables: {
          data: {
            email: email,
            password: password,
          },
        },
      });
      if (data.signin) {
        await onTokenChange(data.signin);
      } else {
        setEmail("");
        setPassword("");
      }
    } catch {
      console.log("catch");
    }
  }

  const [doSignupMutation] = useMutation(createUser);
  async function doSignup(event: { preventDefault: () => void }) {
    event.preventDefault();
    try {
      const { data } = await doSignupMutation({
        variables: {
          data: {
            email: email,
            password: password,
          },
        },
      });
      if (data.createUser) {
        await onTokenChange(data.createUser);
      } else {
        setEmail("");
        setPassword("");
      }
    } catch {
      console.log("catch");
    }
  }

  return (
    <div>
      <h1>{view ? "Login" : "Signup"}</h1>
      <div className="loginContainer">
        <form onSubmit={view ? doLogin : doSignup} className="loginForm">
          <p>E-mail*</p>
          <input
            className="loginFormField"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p>Mot de passe*</p>
          <div className="loginFormPasswordContainer">
            <input
              className="loginFormField"
              type={seePassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              className="loginFormEyeIcon"
              onMouseEnter={() => setSeePassword(true)}
              onMouseLeave={() => setSeePassword(false)}
              src={eye}
              alt="eye"
            />
          </div>
          <div className="loginFormSubmitContainer">
            <input
              className="loginFormSubmit"
              type="submit"
              value={view ? "Se connecter" : "Créer mon compte"}
            />
          </div>
        </form>
        <div>
          <p>Pas encore de compte ?</p>
          {view ? (
            <button onClick={() => setView(false)}>S'inscrire</button>
          ) : (
            <button onClick={() => setView(true)}>Se Connecter</button>
          )}
        </div>
      </div>
    </div>
  );
};
