import { useState } from 'react';
import { INote, INoteInput, IStyles } from '../interfaces';
import trashGrey2 from '../assets/images/trashGrey2.svg';
import editGrey from '../assets/images/editGrey.svg';
import restoreGrey from '../assets/images/restoreGrey.svg';
import arrowLeftRed from '../assets/images/arrowLeftRed.svg';

export const NoteForm = ({
  screenMode,
  saved,
  note,
  noteForm,
  setNoteForm,
  onRestore,
  onDelete,
  fromHome
}: {
  screenMode: 'horizontal' | 'vertical';
  saved: boolean;
  note: INote;
  noteForm: INoteInput;
  setNoteForm: Function;
  onRestore: Function;
  onDelete: Function;
  fromHome?: boolean;
}) => {
  const [editNote, setEditNote] = useState(false);
  return (
    note && (
      <div style={style.container}>
        {saved && <span style={style.saved}>Sauvegarder...</span>}
        {!fromHome && screenMode === 'horizontal' && (
          <div style={style.header}>
            <h1 data-testid="note.title" style={style.title}>
              {note.deleted ? 'Corbeille >' : 'Toutes les notes >'} {note.title}
            </h1>
            {!editNote && !note.deleted && (
              <button
                style={style.button}
                title="Modifier"
                onClick={async () => {
                  setEditNote(true);
                }}
              >
                <img style={style.icon} src={editGrey} />
              </button>
            )}
            {note.deleted ? (
              <button
                style={style.button}
                title="Restorer"
                onClick={async () => {
                  onRestore(note.id);
                }}
              >
                <img style={style.icon} src={restoreGrey} />
              </button>
            ) : (
              <button
                style={style.button}
                title="Supprimer"
                data-testid="note.delete"
                onClick={async () => {
                  onDelete(note.id);
                }}
              >
                <img style={style.icon} src={trashGrey2} />
              </button>
            )}
          </div>
        )}
        {screenMode === 'vertical' && (
          <div style={style.titleMobileContainer}>
            <img style={style.icon} src={arrowLeftRed} />
            <h1 data-testid="note.title" style={style.titleMobile}>
              {note.title}
            </h1>
          </div>
        )}
        <form
          style={screenMode === 'horizontal' ? style.form : style.formMobile}
        >
          {editNote && (
            <input
              style={
                screenMode === 'horizontal'
                  ? style.inputTitle
                  : style.inputTitleMobile
              }
              readOnly={!editNote}
              placeholder="Titre"
              disabled={note.deleted ? true : false}
              type="text"
              value={noteForm.title}
              onChange={(e) =>
                setNoteForm({ ...noteForm, title: e.target.value })
              }
            />
          )}
          <textarea
            style={
              screenMode === 'horizontal'
                ? style.inputContent
                : style.inputContentMobile
            }
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
        {!fromHome && screenMode === 'vertical' && (
          <div style={style.footer}>
            {!editNote && !note.deleted && (
              <button
                style={style.button}
                title="Modifier"
                onClick={async () => {
                  setEditNote(true);
                }}
              >
                <img style={style.icon} src={editGrey} />
              </button>
            )}
            {note.deleted ? (
              <button
                style={style.button}
                title="Restorer"
                onClick={async () => {
                  onRestore(note.id);
                }}
              >
                <img style={style.icon} src={restoreGrey} />
              </button>
            ) : (
              <button
                style={style.button}
                title="Supprimer"
                data-testid="note.delete"
                onClick={async () => {
                  onDelete(note.id);
                }}
              >
                <img style={style.icon} src={trashGrey2} />
              </button>
            )}
          </div>
        )}
      </div>
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
  saved: {
    position: 'absolute',
    bottom: '0.9rem',
    right: '2rem'
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
    marginTop: '2rem'
  },
  title: {
    flex: '1',
    fontSize: '2rem',
    marginTop: '0',
    marginBottom: '0'
  },
  titleMobileContainer: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '2rem',
    gap: '3rem',
    alignItems: 'center'
  },
  titleMobile: {
    fontSize: '1.5rem',
    marginTop: '0',
    marginBottom: '0',
    width: '230px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
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
  formMobile: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    height: '100%',
    marginBottom: '2rem',
    marginTop: '2rem'
  },
  inputTitle: {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px var(--grey) solid'
  },
  inputContent: {
    flex: '1',
    height: '100%',
    resize: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    boxSizing: 'content-box'
  },
  inputTitleMobile: {
    backgroundColor: 'var(--grey)',
    border: 'none',
    borderBottom: '1px var(--grey) solid'
  },
  inputContentMobile: {
    flex: '1',
    resize: 'none',
    backgroundColor: 'var(--grey)',
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
  footer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: '1rem',
    marginBottom: '3rem'
  }
};
