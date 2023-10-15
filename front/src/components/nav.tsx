import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DATAContext } from '../DATAContexts';
import { IStyles } from '../interfaces';
import logo from '../assets/logo.svg';
import notesIcon from '../assets/images/notesIcon.svg';
import trash from '../assets/images/trash.svg';
import plus from '../assets/images/plus.svg';
import cross from '../assets/images/cross.svg';
import burgerIcon from '../assets/images/burgerIcon.svg';

export default function Nav({ children }: { children?: React.ReactNode }) {
  const { screenMode, setBurger, burger, user, refetchUser } =
    useContext(DATAContext);
  return user ? (
    <div style={screenMode === 'horizontal' ? style.container : style.containerMobile}>
      {screenMode === 'vertical' && (
        <div style={style.headerNavMobile}>
          <Link style={style.link2} onClick={() => setBurger(false)} to="/">
            <img style={style.logo} src={logo} />
          </Link>
          <button style={style.button}
            onClick={() => setBurger(!burger)}
          >
            <img style={style.icon} src={burgerIcon} />
          </button>
        </div>
      )}
      {screenMode === 'horizontal' && (
        <div style={style.containerNav}>
          <div style={style.linkList}>
            <Link style={style.link} onClick={() => setBurger(false)} to="/">
              <img style={style.logo} src={logo} />
            </Link>
            <Link style={style.link} onClick={() => setBurger(false)} to="/notes">
              <img style={style.icon} src={notesIcon} />
              Toutes les notes
            </Link>
            <Link style={style.link} onClick={() => setBurger(false)} to="/new">
              <img style={style.icon} src={plus} />Nouvelle note
            </Link>
            <Link style={style.link} onClick={() => setBurger(false)} to="/trash">
              <img style={style.icon} src={trash} />Corbeille
            </Link>
          </div>
          <div style={style.logoutContainer}>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                refetchUser();
              }}
            >
              Déconnexion
            </button>
          </div>
        </div>
      )}
      {burger && screenMode === 'vertical' && (
        <div style={style.containerNavMobileBG}>
          <div style={style.containerNavMobile}>
            <button style={style.button}
              onClick={() => setBurger(!burger)}
            >
              <img style={style.icon} src={cross} />
            </button>
            <div style={style.linkListMobile}>
              <Link style={style.link} onClick={() => setBurger(false)} to="/notes">
                <img style={style.icon} src={notesIcon} />
                Toutes les notes
              </Link>
              <Link style={style.link} onClick={() => setBurger(false)} to="/new">
                <img style={style.icon} src={plus} />Nouvelle note
              </Link>
              <Link style={style.link} onClick={() => setBurger(false)} to="/trash">
                <img style={style.icon} src={trash} />Corbeille
              </Link>
            </div>
            <div style={style.logoutContainerMobile}>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  refetchUser();
                }}
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
      <div style={style.content} id='asa'>{children}</div>
    </div>
  ) : (
    children
  );
}

const style: IStyles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: '100%'
  },
  containerMobile: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  containerNav: {
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '0 2rem 0 2rem',
    borderRight: '2px var(--grey) solid'
  },
  containerNavMobileBG: {
    position: 'absolute',
    right: '0',
    backgroundColor: '#00000050',
    width: '100%',
    flexDirection: 'column',
    height: '100%',
  },
  containerNavMobile: {
    position: 'absolute',
    right: '0',
    backgroundColor: 'white',
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '0 2rem 0 2rem'
  },
  linkList: {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  linkListMobile: {
    marginTop: '7rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  headerNavMobile: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: '2rem'
  },
  link: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.5rem'
  },
  link2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '2rem',
    marginLeft: '2rem'
  },
  logo: { width: '150px', paddingBottom: '3rem', marginLeft: '-12px' },
  icon: { width: '25px' },
  logoutContainer: {
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    marginBottom: '2rem'
  },
  logoutContainerMobile: {
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: '2rem'
  },
  button: {
    backgroundColor: 'transparent',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    right: '10px',
    top: '2rem'
  },
  content: {
    width: '92vw',
    marginLeft: '4vw',
    marginRight: '4vw',
    height: '100%'
  },
};
