import { useNavigate } from "react-router-dom";
import { INoteInput } from "../interfaces";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { doCreateNote } from "../graphql/gql";

export const NewNote = () => {
  const navigate = useNavigate();
  const [form, setform] = useState<INoteInput>({
    title: "",
    content: "",
  });
  const [disable, setDisable] = useState(true);
useEffect(() => {
  if (form.content && form.title) {

    setDisable(false)
  }

}, [form])

  const [createNote] = useMutation(doCreateNote);
  const onSaveNewNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await createNote({
        variables: {
          data: { ...form },
        },
      });
      if (data) {
        console.log(data);
        navigate(`/note/${data.createNote.id}`);
      } else {
        setform({
          title: "",
          content: "",
        });
        console.log("No Data");
      }
    } catch {
      setform({
        title: "",
        content: "",
      });
      console.log("Catch");
    }
  };

  return (
    <form onSubmit={(e) => onSaveNewNote(e)}>
      <p>
        <label>
          Title
          <br />
          <input
            type="text"
            value={form.title}
            onChange={(e) => setform({ ...form, title: e.target.value })}
          />
        </label>
      </p>
      <p>
        <label>Content</label>
        <br />
        <textarea
          rows={10}
          cols={30}
          value={form.content}
          onChange={(e) => setform({ ...form, content: e.target.value })}
        />
      </p>
      <p>
        <button disabled={disable} type="submit" value="Submit">
          Save
        </button>
      </p>
    </form>
  );
};
