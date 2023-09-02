import { INote, INoteInput } from '../interfaces';

export const NoteForm = ({
  note,
  noteForm,
  setNoteForm,
  onRestore,
  onDelete
}: {
  note: INote;
  noteForm: INoteInput;
  setNoteForm: Function;
  onRestore: Function;
  onDelete: Function;
}) => {
  return (
    note && (
      <div>
        <form>
          <p>
            <label>
              Title
              <br />
              <input
                data-testid="note.title"
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
              data-testid="note.content"
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
            data-testid="note.delete"
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
