import { useState } from 'react';
import { INote, INoteInput, IStyles } from '../interfaces';
import trashGrey2 from '../assets/images/trashGrey2.svg';
import editGrey from '../assets/images/editGrey.svg';
import restoreGrey from '../assets/images/restoreGrey.svg';

export const NoteForm = ({
  saved,
  note,
  noteForm,
  setNoteForm,
  onRestore,
  onDelete
}: {
  saved: boolean;
  note: INote;
  noteForm: INoteInput;
  setNoteForm: Function;
  onRestore: Function;
  onDelete: Function;
}) => {
  const [editNote, setEditNote] = useState(false)
  return (
    note && (

      <div style={style.container}>
        {saved && <span style={style.saved}>Sauvegarder...</span>}

        <div style={style.header}><h1 style={style.title}>{note.deleted ? 'Corbeille >' : 'Toutes les notes >'}{' '}{note.title}</h1>
          {!editNote && !note.deleted &&
            <button style={style.button} title='Modifier'
              onClick={async () => {
                setEditNote(true)
              }}
            >
              <img style={style.icon} src={editGrey} />
            </button>}
          {note.deleted ? (
            <button style={style.button} title='Restorer'
              onClick={async () => {
                onRestore(note.id);
              }}
            >
              <img style={style.icon} src={restoreGrey} />
            </button>
          ) : (
            <button style={style.button} title='Supprimer'
              data-testid="note.delete"
              onClick={async () => {
                onDelete(note.id);
              }}
            >
              <img style={style.icon} src={trashGrey2} />
            </button>
          )}</div>
        <form style={style.form}>
          {editNote && <input style={style.inputTitle}
            readOnly={!editNote}
            placeholder="Titre"
            data-testid="note.title"
            disabled={note.deleted ? true : false}
            type="text"
            value={noteForm.title}
            onChange={(e) =>
              setNoteForm({ ...noteForm, title: e.target.value })
            }
          />}
          <textarea style={style.inputContent}
            readOnly={!editNote}
            placeholder="Lance - toi !"
            data-testid="note.content"
            disabled={note.deleted ? true : false}
            value={noteForm.content}
            onChange={(e) =>
              setNoteForm({ ...noteForm, content: e.target.value })
            }
          />
        </form>
      </div>
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
  saved: {
    position: 'absolute',
    bottom: '0.9rem',
    right: '2rem'
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '2rem',
    gap: '1rem',
    marginTop: '2rem',
    marginRight: '2rem'
  },
  title: {
    flex: '1',
    fontSize: '2rem',
    marginTop: '0',
    marginBottom: '0'
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    height: '100%',
    marginBottom: '2rem',
    marginTop: '2rem'
  },
  inputTitle: {
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px var(--grey) solid'
  },
  inputContent: {
    flex: '1',
    width: '100%',
    height: '100%',
    resize: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    boxSizing: 'content-box'
  },
  button: {
    backgroundColor: 'transparent',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    cursor: 'help'
  },
  icon: { width: '20px' },
};