import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { doDeleteNote } from "../graphql/gql";
import { useContext, useEffect, useState } from "react";
import { DATAContext } from "../DATAContexts";
import { IStyles } from "../interfaces";
import trashGrey from '../assets/images/trashGrey.svg';
import plusWhite from '../assets/images/plusWhite.svg';

export const Notes = () => {
  const { user, refetchUser, screenMode, setBurger } = useContext(DATAContext);
  const notes = user?.notes.filter((x) => !x.deleted);
  useEffect(() => {
    refetchUser();
  }, []);

  const [deleteNote] = useMutation(doDeleteNote);
  const onDelete = async (id: string) => {
    try {
      const { data } = await deleteNote({
        variables: {
          id,
        },
      });
      if (data) {
        console.log("Deleted");
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
        <h1 style={style.title}>Toutes les notes</h1>
        <div style={screenMode === 'horizontal' ? style.content : style.contentMobile}>
          {screenMode === 'horizontal' && notes.map((note) => (
            <div style={onHover === note.id ? style.noteHover : style.note} key={note.id} onMouseEnter={() => setOnHover(note.id)} onMouseLeave={() => setOnHover('')}>
              <Link
                style={style.link} to={`/note/${note.id}`}>
                {note.title}
              </Link>
              {
                onHover === note.id &&
                < button
                  style={style.delete}
                  title="Supprimer"
                  onClick={async () => {
                    onDelete(note.id);
                  }}
                >
                  <img style={style.icon} src={trashGrey} />
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
        {screenMode === 'vertical' && <Link style={style.link2} onClick={() => setBurger(false)} to="/new">
          Nouvelle note<img style={style.icon2} src={plusWhite} />
        </Link>}
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
    height: '100%',
    alignItems: 'center'
  },
  title: {
    fontSize: '2rem',
    marginTop: '2rem'
  },
  contentMobile: {
    width: '100%',
    display: 'flex',
    flex: '1',
    alignItems: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  noteMobile: {
    width: '100%',
    height: '35px',
    display: 'flex',
    alignItems: 'center'
  },
  note: {
    width: '50%',
    height: '35px',
    display: 'flex',
    alignItems: 'center'
  },
  noteHover: {
    width: '50%',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--grey)'
  },
  link: {
    width: '100%',
    paddingLeft: '1rem'
  },
  delete: {
    backgroundColor: 'transparent', border: 'none',
    display: 'flex',
    alignItems: 'center',
    cursor: 'help'
  },
  icon: { width: '15px' },
  icon2: { width: '25px' },
  link2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.5rem',
    borderRadius: '4px',
    fontFamily: 'MuseoModerno',
    border: '1px solid transparent',
    backgroundColor: 'var(--red)',
    cursor: 'pointer',
    color: 'white',
    padding: '0.3rem 1rem',
    width: 'max-content',
    marginBottom: '2rem'
  },
};