import { useContext, useState } from 'react';
import { createUser, signin } from '../graphql/gql';
import { useMutation } from '@apollo/client';
import { DATAContext } from '../DATAContexts';
import eye from '../assets/images/oeil.png';
import logo from '../assets/logo.svg';
import { IStyles } from '../interfaces';

export const Account = () => {
  const { refetchUser, screenMode } = useContext(DATAContext);
  const [view, setView] = useState(true); // true = login, false = signup

  const onTokenChange = async (token: string) => {
    if (token) {
      localStorage.setItem('token', token);
      await refetchUser();
    }
  };
  const [seePassword, setSeePassword] = useState(false);
  const [email, setEmail] = useState('oscar.agudelo.pro@gmail.com');
  const [password, setPassword] = useState('23042015');

  const [doLoginMutation] = useMutation(signin);
  async function doLogin(event: { preventDefault: () => void }) {
    event.preventDefault();
    try {
      const { data } = await doLoginMutation({
        variables: {
          data: {
            email: email,
            password: password
          }
        }
      });
      if (data.signin) {
        await onTokenChange(data.signin);
      } else {
        setEmail('');
        setPassword('');
      }
    } catch {
      console.log('catch');
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
            password: password
          }
        }
      });
      if (data.createUser) {
        await onTokenChange(data.createUser);
      } else {
        setEmail('');
        setPassword('');
      }
    } catch {
      console.log('catch');
    }
  }

  return (
    <div style={style.container}>
      <img style={style.logo} src={logo} />
      <div style={screenMode === 'horizontal' ? style.content : style.contentMobile}>
        {view && (
          <div style={style.titleContainer}>
            <h1 style={style.title}>Nouveau fast</h1>
            <h1 style={style.title2}>Compte</h1>
          </div>
        )}
        <form style={style.formContainer} onSubmit={view ? doSignup : doLogin}>
          <p style={style.labelForm}>E-mail</p>
          <div style={style.inputContainer}>
            <input
              style={style.inputForm}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <p style={style.labelForm}>Mot de passe</p>
          <div style={style.inputContainer}>
            <input
              style={style.inputForm}
              type={seePassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              style={style.passwordIcon}
              onMouseEnter={() => setSeePassword(true)}
              onMouseLeave={() => setSeePassword(false)}
              src={eye}
              alt="eye"
            />
          </div>
          <div style={style.buttonContainer}>
            <input
              style={style.containerContain}
              type="submit"
              value={view ? 'Créer mon compte' : 'Se connecter'}
            />
          </div>
        </form>
        <div style={style.buttonContainer}>
          {view ? (
            <button style={style.changeButton} onClick={() => setView(false)}>
              <h1 style={style.title}>Déjà un fast</h1>
              <h1 style={style.title2}>Compte</h1>
              <h1 style={style.title}>{' '}?</h1>
            </button>
          ) : (
            <button style={style.changeButton} onClick={() => setView(true)}>
              <h1 style={style.title}>Créer un fast</h1>
              <h1 style={style.title2}>Compte</h1>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const style: IStyles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  logo: { width: 'initial', paddingBottom: '5rem' },
  content: {
    width: '320px',
    borderRadius: '4px',
    border: '1px var(--grey) solid',
    padding: '2rem',
    boxShadow: '0px 0px 8px 1px rgba(0,0,0,0.44)'
  },
  contentMobile: {
    minWidth: '320px',
    padding: '1rem'
  },
  titleContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '1.5rem',
    margin: '0'
  },
  title2: {
    margin: '0',
    fontSize: '1.5rem',
    fontFamily: 'Pacifico',
    color: 'var(--red)'
  },
  formContainer: {
    width: '100%'
  },
  labelForm: {
    margin: '0'
  },
  inputForm: {
    margin: '0 0 2rem 0'
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative'
  },
  passwordIcon: {
    width: '30px',
    height: '30px',
    position: 'absolute',
    right: '10px',
    top: '5px',
    backgroundColor: 'var(--grey)',
    cursor: 'pointer'
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  changeButton: {
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    marginTop: '2rem'
  }
};
