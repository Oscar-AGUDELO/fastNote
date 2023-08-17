import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { doRestoreNote } from "../graphql/gql";
import { useContext } from "react";
import { DATAContext } from "../DATAContexts";

export const Trash = () => {
  const { user, refetchUser } = useContext(DATAContext);
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
  return (
    notes && (
      <div>
        <h1>Notes Supprimées</h1>
        {notes.map((note) => (
          <div key={note.id}>
            {note.title}
            <Link style={{ color: "red" }} to={`/note/${note.id}`}>
              open
            </Link>

            <button
              onClick={async () => {
                onRestore(note.id);
              }}
            >
              Restorer
            </button>
          </div>
        ))}
      </div>
    )
  );
};
