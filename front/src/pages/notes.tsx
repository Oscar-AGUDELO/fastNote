import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { doDeleteNote } from "../graphql/gql";
import { useContext, useEffect, useState } from "react";
import { DATAContext } from "../DATAContexts";
import { IStyles } from "../interfaces";
import trashGrey from '../assets/images/trashGrey.svg';

export const Notes = () => {
  const { user, refetchUser } = useContext(DATAContext);
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
      <div style={style.container}>
        <h1 style={style.title}>Toutes les notes</h1>
        <div style={style.content}>
          {notes.map((note) => (
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
    height: '100%',
    marginLeft: '2rem',
    marginRight: '2rem'
  },
  title: {
    fontSize: '2rem',
    marginTop: '2rem'
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
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
};