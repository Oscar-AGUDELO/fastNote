import { useContext, useState } from "react";
import { signin } from "../graphql/gql";
import { useMutation } from "@apollo/client";
import { DATAContext } from "../DATAContexts";
import eye from "../assets/images/oeil.png";

export const Account = () => {
  const { refetchUser } = useContext(DATAContext);

  const onTokenChange = async (token: string) => {
    if (token) {
      localStorage.setItem("token", token);
      await refetchUser();
    }
  };
  const [seePassword, setSeePassword] = useState(false);
  const [email, setEmail] = useState("oscar.agudelo.pro@gmail.com");
  const [password, setPassword] = useState("23042015");

  const [doLoginMutation, { loading }] = useMutation(signin);
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
      null;
    }
  }

  return (
    <div>
      <h1>Account</h1>
      <div className="loginContainer">
        <form onSubmit={doLogin} className="loginForm">
          <p>E-mail*</p>
          <input
            className="loginFormField"
            disabled={loading}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p>Mot de passe*</p>
          <div className="loginFormPasswordContainer">
            <input
              className="loginFormField"
              disabled={loading}
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
              disabled={loading}
              value="Envoyer"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
