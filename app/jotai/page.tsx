"use client";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Button, Input, Space, Modal } from "antd";
import {
  todosAtom,
  fetchTodosAtom,
  addTodoAtom,
  deleteTodoAtom,
  editTodoAtom,
} from "../atoms/atom";
export default function TodoListJotai() {
  const router = useRouter();
  const [todos] = useAtom(todosAtom);
  const [, fetchTodos] = useAtom(fetchTodosAtom);
  const [, addTodo] = useAtom(addTodoAtom);
  const [, deleteTodo] = useAtom(deleteTodoAtom);
  const [, editTodo] = useAtom(editTodoAtom);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      await fetchTodos();
      if (mounted) setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [fetchTodos]);

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (name: string) => {
    if (!name || name.trim() === "") return;
    setName("");
    try {
      await addTodo(name);
    } catch (error) {
      console.error(error);
    }
  };

  const openEdit = (id: number, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
    setIsModalOpen(true);
  };

  const handleEditOk = async () => {
    if (editingId == null) return;
    try {
      await editTodo({ id: editingId, name: editName });
    } catch (error) {
      console.error(error);
    } finally {
      setIsModalOpen(false);
      setEditingId(null);
      setEditName("");
    }
  };

  const handleEditCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setEditName("");
  };

  function goToPageId(id: number | string) {
    router.push(`/about/${id}`);
  }

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    handleDelete(id);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white text-black">
      <Space>
        <Input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="primary" onClick={() => handleAdd(name)}>
          Add
        </Button>
      </Space>
      <div className="flex items-center mb-6 justify-between ">
        <h1 className="text-3xl m-4 font-bold ">Todo List (Jotai)</h1>
        <button
          className="bg-blue-600 rounded-2xl px-4 py-2"
          onClick={() => fetchTodos()}
        >
          Refetch
        </button>
      </div>
      {loading ? (
        <div className="p-4">Loading ...</div>
      ) : todos && todos.length > 0 ? (
        <ul className="space-y-3">
          {todos.map((e) => (
            <li
              onClick={() => goToPageId(e.id)}
              key={e.id}
              className="flex items-center justify-between bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition cursor-pointer"
            >
              <span className="text-lg">{e.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    openEdit(e.id, e.name);
                  }}
                  className="bg-yellow-400 text-black px-4 py-2 rounded hover:brightness-95 transition"
                >
                  Edit
                </button>
                <button
                  onClick={(event) => handleDeleteClick(event, e.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 py-8">No todos yet</div>
      )}
      <Modal
        title="Edit Todo"
        open={isModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Save"
      >
        <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
      </Modal>
    </div>
  );
}
