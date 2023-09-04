import { useContext } from 'react';
import { DATAContext } from '../DATAContexts';
import { IStyles } from '../interfaces';
import { NoteForm } from '../components/noteForm';
import { Link } from 'react-router-dom';
import plusWhite from '../assets/images/plusWhite.svg';

export const Home = () => {
  const { user, setBurger, screenMode } = useContext(DATAContext);
  const notes = user?.notes.filter((x) => !x.deleted);
  const lastNote = notes && notes[notes.length - 1];
  return (
    <div style={screenMode === 'horizontal' ? style.container : style.containerMobile}>
      <h1 style={style.title}>Heureux de te revoir !</h1>

      <div style={style.lastNoteTitle}>{lastNote?.title}</div>
      {lastNote && <NoteForm
        screenMode={screenMode}
        fromHome
        saved={false}
        note={lastNote}
        noteForm={{ title: lastNote.title, content: lastNote.content }}
        setNoteForm={() => { }}
        onRestore={() => { }}
        onDelete={() => { }}
      />}
      {screenMode === 'vertical' && <Link style={style.link} onClick={() => setBurger(false)} to="/new">
        Nouvelle note<img style={style.icon} src={plusWhite} />
      </Link>}
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
  containerMobile: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  title: {
    fontSize: '2rem',
    textAlign: 'center'
  },
  icon: { width: '25px' },
  link: {
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
