import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NoteForm } from "../components/noteForm";

test("render and display note", async () => {
  render(
    <NoteForm
      onDelete={() => { }}
      note={{
        title: "Title Test",
        content: "Content Test",
        id: "Id Test",
        user: { id: "user.id Test" },
        deleted: null,
        createdAt: new Date(),
      }}
      noteForm={{
        title: "Title Test",
        content: "Content Test",
      }}
      setNoteForm={() => { }}
      onRestore={() => { }}
    />
  );

  expect(screen.getByTestId("note.title")).toHaveValue("Title Test");
  expect(screen.getByTestId("note.content")).toHaveValue("Content Test");
});

test("render a deletable comment", async () => {
  // ARRANGE
  const onDelete = jest.fn();
  render(
    <NoteForm
      onDelete={onDelete}
      note={{
        title: "Title Test",
        content: "Content Test",
        id: "Id Test",
        user: { id: "user.id Test" },
        deleted: null,
        createdAt: new Date(),
      }}
      noteForm={{
        title: "",
        content: "",
      }}
      setNoteForm={() => { }}
      onRestore={() => { }}
    />
  );

  expect(onDelete.mock.calls.length).toBe(0);
  screen.getByTestId("note.delete").click();
  expect(onDelete.mock.calls.length).toBe(1);
});