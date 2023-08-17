import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { doDeleteNote } from "../graphql/gql";
import { useContext, useEffect } from "react";
import { DATAContext } from "../DATAContexts";

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

  return (
    notes && (
      <div>
        <h1>Notes</h1>
        {notes.map((note) => (
          <div key={note.id}>
            {note.title}
            <Link style={{ color: "red" }} to={`/note/${note.id}`}>
              open
            </Link>

            <button
              onClick={async () => {
                onDelete(note.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    )
  );
};
