import { IStyles } from "../interfaces";

export const Home = () => {
  return <div style={style.container}>Heureux de te revoir !</div>;
};

const style: IStyles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    fontSize: '2rem'
  },
};
