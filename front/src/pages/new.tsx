import { useNavigate } from "react-router-dom";
import { INoteInput, IStyles } from "../interfaces";
import { useContext, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { doCreateNote } from "../graphql/gql";
import { DATAContext } from "../DATAContexts";

export const NewNote = () => {
  const { screenMode } = useContext(DATAContext);
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
    <div style={screenMode === 'horizontal' ? style.container : style.containerMobile}>
      <h1 style={style.title}>Nouvelle note</h1>
      <form style={screenMode === 'horizontal' ? style.form : style.formMobile} onSubmit={(e) => onSaveNewNote(e)}>
        <input style={screenMode === 'horizontal' ? style.inputTitle : style.inputTitleMobile}
          placeholder="Titre"
          type="text"
          value={form.title}
          onChange={(e) => setform({ ...form, title: e.target.value })}
        />
        <textarea style={screenMode === 'horizontal' ? style.inputContent : style.inputContentMobile}
          placeholder="Lance - toi !"
          value={form.content}
          onChange={(e) => setform({ ...form, content: e.target.value })}
        />
        <div style={screenMode === 'horizontal' ? style.submitContainer : style.submitContainerMobile}>
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
    height: '100%'
  },
  containerMobile: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center'
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
  formMobile: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    height: '80%'
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
  submitContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: '2rem'
  },
  submitContainerMobile: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '2rem'
  }
};