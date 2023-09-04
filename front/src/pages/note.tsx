import { useParams, useNavigate } from 'react-router-dom';
import { INote, INoteInput } from '../interfaces';
import { useEffect, useState, useContext } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  doDeleteNote,
  doModifyNote,
  doRestoreNote,
  oneNote
} from '../graphql/gql';
import { DATAContext } from '../DATAContexts';
import { useDebounce } from '../services/useDebounce';
import { NoteForm } from '../components/noteForm';

export const Note = () => {
  const { refetchUser, screenMode } = useContext(DATAContext);
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [noteForm, setNoteForm] = useState<INoteInput>({
    title: '',
    content: ''
  });
  const [note, setnote] = useState<INote>({
    title: '',
    content: '',
    id: '',
    user: { id: '' },
    deleted: null,
    createdAt: null
  });

  const debouncedTitle = useDebounce(noteForm.title, 2000);
  const debouncedContent = useDebounce(noteForm.content!, 2000);
  const getNote = useQuery(oneNote, {
    variables: { id: `${noteId}` }
  });

  const getData = async () => {
    if (noteId) {
      const res = getNote.data.noteById;
      if (!res) {
        throw new Response('', { status: 404 });
      } else {
        setnote(res);
        setNoteForm({ content: res.content, title: res.title });
      }
    }
  };

  useEffect(() => {
    getData();
  }, [getNote.data]);

  const [deleteNote] = useMutation(doDeleteNote);

  const onDelete = async (id: string) => {
    try {
      const { data } = await deleteNote({
        variables: {
          id
        }
      });
      if (data) {
        console.log('Deleted');
        refetchUser();
        navigate(`/notes`);
      } else {
        console.log('No Data');
      }
    } catch {
      console.log('Catch');
    }
  };
  const [restoreNote] = useMutation(doRestoreNote);
  const onRestore = async (id: string) => {
    try {
      const { data } = await restoreNote({
        variables: {
          id
        }
      });
      if (data) {
        console.log('Restored');
        refetchUser();
        navigate(`/trash`);
      } else {
        console.log('No Data');
      }
    } catch {
      console.log('Catch');
    }
  };
  const [saved, setSaved] = useState(false);
  const [modifyNote] = useMutation(doModifyNote);
  const onSaveModifyNote = async () => {
    try {
      const { data } = await modifyNote({
        variables: {
          id: noteId,
          data: { title: noteForm.title, content: noteForm.content }
        }
      });
      if (data) {
        console.log('saved!');
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
        }, 1000);
      } else {
        console.log('No Data');
      }
    } catch {
      console.log('Catch');
    }
  };

  useEffect(() => {
    if (note.id && !note.deleted) {
      onSaveModifyNote();
    }
  }, [debouncedTitle, debouncedContent]);

  return (
    note && (
      <NoteForm
        screenMode={screenMode}
        saved={saved}
        note={note}
        noteForm={noteForm}
        setNoteForm={setNoteForm}
        onRestore={onRestore}
        onDelete={onDelete}
      />
    )
  );
};

// const style: IStyles = {
//   title: { color: "red" },
//   content: { color: "green" },
// };
