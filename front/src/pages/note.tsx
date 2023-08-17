import { useParams, useNavigate } from "react-router-dom";
import { INote, INoteInput } from "../interfaces";
import { useEffect, useState, useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  doDeleteNote,
  doModifyNote,
  doRestoreNote,
  oneNote,
} from "../graphql/gql";
import { DATAContext } from "../DATAContexts";
import { useDebounce } from "../services/useDebounce";

export const Note = () => {
  const { refetchUser } = useContext(DATAContext);
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [noteForm, setNoteForm] = useState<INoteInput>({
    title: "",
    content: "",
  });
  const [note, setnote] = useState<INote>({
    title: "",
    content: "",
    id: "",
    user: { id: "" },
    deleted: null,
    createdAt: null,
  });

  const debouncedTitle = useDebounce(noteForm.title, 2000);
  const debouncedContent = useDebounce(noteForm.content!, 2000);
  const getNote = useQuery(oneNote, {
    variables: { id: `${noteId}` },
  });

  const getData = async () => {
    if (noteId) {
      const res = getNote.data.noteById;
      if (!res) {
        throw new Response("", { status: 404 });
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
          id,
        },
      });
      if (data) {
        console.log("Deleted");
        refetchUser();
        navigate(`/notes`);
      } else {
        console.log("No Data");
      }
    } catch {
      console.log("Catch");
    }
  };
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
        navigate(`/trash`);
      } else {
        console.log("No Data");
      }
    } catch {
      console.log("Catch");
    }
  };

  const [modifyNote] = useMutation(doModifyNote);
  const onSaveModifyNote = async () => {
    try {
      const { data } = await modifyNote({
        variables: {
          id: noteId,
          data: { title: noteForm.title, content: noteForm.content },
        },
      });
      if (data) {
        console.log("saved!");
      } else {
        console.log("No Data");
      }
    } catch {
      console.log("Catch");
    }
  };

  useEffect(() => {
    if (note.id) {
      onSaveModifyNote();
    }
  }, [debouncedTitle, debouncedContent]);
  return (
    note && (
      <div>
        <form>
          <p>
            <label>
              Title
              <br />
              <input
                disabled={note.deleted ? true : false}
                type="text"
                value={noteForm.title}
                onChange={(e) =>
                  setNoteForm({ ...noteForm, title: e.target.value })
                }
              />
            </label>
          </p>
          <p>
            <label>Content</label>
            <br />
            <textarea
              disabled={note.deleted ? true : false}
              rows={10}
              cols={30}
              value={noteForm.content}
              onChange={(e) =>
                setNoteForm({ ...noteForm, content: e.target.value })
              }
            />
          </p>
        </form>
        {note.deleted ? (
          <button
            onClick={async () => {
              onRestore(note.id);
            }}
          >
            Restore
          </button>
        ) : (
          <button
            onClick={async () => {
              onDelete(note.id);
            }}
          >
            Delete
          </button>
        )}
      </div>
    )
  );
};

// const style: IStyles = {
//   title: { color: "red" },
//   content: { color: "green" },
// };
