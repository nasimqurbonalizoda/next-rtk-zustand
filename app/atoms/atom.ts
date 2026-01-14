import { atom } from "jotai";
export interface Todo {
  id: number;
  name: string;
}
export const todosAtom = atom<Todo[]>([]);
export const fetchTodosAtom = atom(null, async (get, set) => {
  try {
    const res = await fetch("https://689efc1f3fed484cf878a4ca.mockapi.io/users");
    const data: Todo[] = await res.json();
    set(todosAtom, data);
  } catch (error) {
    console.error("fetchTodosAtom", error);
  }
});
export const addTodoAtom = atom(null, async (get, set, name: string) => {
  try {
    await fetch("https://689efc1f3fed484cf878a4ca.mockapi.io/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    set(fetchTodosAtom);
  } catch (error) {
    console.error("addTodoAtom", error);
  }
});
export const deleteTodoAtom = atom(null, async (get, set, id: number) => {
  try {
    await fetch(`https://689efc1f3fed484cf878a4ca.mockapi.io/users/${id}`, { method: "DELETE" });
    set(fetchTodosAtom);
  } catch (error) {
    console.error("deleteTodoAtom", error);
  }
});
export const editTodoAtom = atom(null, async (get, set, { id, name }: { id: number; name: string }) => {
  try {
    await fetch(`https://689efc1f3fed484cf878a4ca.mockapi.io/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name:name }),
    });
    set(fetchTodosAtom);
  } catch (error) {
    console.error("editTodoAtom", error);
  }
});