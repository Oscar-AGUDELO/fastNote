import { useNavigate } from "react-router-dom";
import { INoteInput, IStyles } from "../interfaces";
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
        navigate(`/notes`);
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
    <div style={style.container}>
      <h1 style={style.title}>Nouvelle note</h1>
      <form style={style.form} onSubmit={(e) => onSaveNewNote(e)}>
        <input style={style.inputTitle}
          placeholder="Titre"
          type="text"
          value={form.title}
          onChange={(e) => setform({ ...form, title: e.target.value })}
        />
        <textarea style={style.inputContent}
          placeholder="Lance - toi !"
          value={form.content}
          onChange={(e) => setform({ ...form, content: e.target.value })}
        />
        <div style={style.submitContainer}>
          <button style={style.submit} disabled={disable} type="submit" value="Submit">
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
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
    marginTop: '2rem',
    marginBottom: '0'
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    height: '100%'
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
  submitContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: '2rem'
  }
};