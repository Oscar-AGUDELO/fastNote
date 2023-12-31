import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { doRestoreNote } from "../graphql/gql";
import { useContext, useState } from "react";
import { DATAContext } from "../DATAContexts";
import restoreGrey from '../assets/images/restoreGrey.svg';
import { IStyles } from "../interfaces";

export const Trash = () => {
  const { user, refetchUser, screenMode } = useContext(DATAContext);
  const notes = user?.notes.filter((x) => x.deleted);

  const [restoreNote] = useMutation(doRestoreNote);
  const onRestore = async (id: string) => {
    try {
      const { data } = await restoreNote({
        variables: {
          id,
        },
      });
      if (data) {
        console.log("Restored");
        refetchUser();
      } else {
        console.log("No Data");
      }
    } catch {
      console.log("Catch");
    }
  };

  const [onHover, setOnHover] = useState('')
  return (
    notes && (
      <div style={screenMode === 'horizontal' ? style.container : style.containerMobile}>
        <h1 style={style.title}>Corbeille</h1>
        <div style={style.content}>
          {screenMode === 'horizontal' && notes.map((note) => (
            <div style={onHover === note.id ? style.noteHover : style.note} key={note.id} onMouseEnter={() => setOnHover(note.id)} onMouseLeave={() => setOnHover('')}>
              <Link
                style={style.link} to={`/note/${note.id}`}>
                {note.title}{note.deleted && <p style={style.date} >Note supprimée le {String(new Date(note.deleted as Date).toLocaleDateString())}</p>}
              </Link>
              {
                onHover === note.id &&
                < button
                  style={style.delete}
                  title="Restorer"
                  onClick={async () => {
                    onRestore(note.id);
                  }}
                >
                  <img style={style.icon} src={restoreGrey} />
                </button>
              }
            </div>
          ))
          }
          {screenMode === 'vertical' && notes.map((note) => (
            <div style={style.noteMobile} key={note.id} >
              <Link
                style={style.link} to={`/note/${note.id}`}>
                {note.title}
              </Link>
            </div>
          ))
          }
        </div>
      </div >
    )
  );
};

const style: IStyles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  containerMobile: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%'
  },
  title: {
    fontSize: '2rem',
    marginTop: '2rem'
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  note: {
    width: '100%',
    height: '35px',
    display: 'flex',
    alignItems: 'center'
  },
  noteMobile: {
    width: '100%',
    height: '35px',
    display: 'flex',
    alignItems: 'center'
  },
  noteHover: {
    width: '100%',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--grey)'
  },
  link: {
    width: '100%',
    display: 'flex',
    paddingLeft: '1rem',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  date: { color: 'var(--grey)' },
  delete: {
    backgroundColor: 'transparent', border: 'none',
    display: 'flex',
    alignItems: 'center',
    cursor: 'help'
  },
  icon: { width: '15px' },
};