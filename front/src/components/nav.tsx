import { useContext } from "react";
import { Link } from "react-router-dom";
import { DATAContext } from "../DATAContexts";
export default function Nav({ children }: { children?: React.ReactNode }) {
  const { screenMode, setBurger, burger, user, refetchUser } =
    useContext(DATAContext);
  return user ? (
    <div>
      {screenMode === "vertical" && (
        <div>
          <button
            style={{
              paddingTop: "1px",
              paddingBottom: "10px",
              rotate: "90deg",
              paddingLeft: "5px",
              paddingRight: "5px",
            }}
            onClick={() => setBurger(!burger)}
          >
            |||
          </button>
        </div>
      )}
      {((burger && screenMode === "vertical") ||
        (!burger && screenMode === "horizontal")) && (
        <div>
          <h1>
            <p>
              <Link onClick={() => setBurger(false)} to="/">
                Home
              </Link>
            </p>
          </h1>
          <p>
            <Link onClick={() => setBurger(false)} to="/new">
              New
            </Link>
          </p>
          <p>
            <Link onClick={() => setBurger(false)} to="/notes">
              Notes
            </Link>
          </p>
          <p>
            <Link onClick={() => setBurger(false)} to="/trash">
              Trash
            </Link>
          </p>
          <p>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                refetchUser();
              }}
            >
              Logout
            </button>
          </p>
        </div>
      )}
      {!burger && <div>{children}</div>}
    </div>
  ) : (
    <div>{children}</div>
  );
}
