import { create } from 'zustand';

const API = "https://689efc1f3fed484cf878a4ca.mockapi.io/users";

interface Todo {
  id: number | string;
  name: string;
  age: number;
  status: boolean;
}

interface TodoState {
  todos: Todo[];
  infoUser: Todo | null;
  getTodos: () => Promise<void>;
  getInfo: (id: string) => Promise<void>;
  postTodo: (elem: { name: string; age: number; status: boolean }) => Promise<void>;
  deleteTodo: (id: number | string) => Promise<void>;
  putTodo: (id: number | string, elem: Partial<Todo>) => Promise<void> 
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  infoUser: null,
  getInfo: async (id: string) => {
    try {
      const res = await fetch(`${API}/${id}`);
      const data = await res.json();
      set({ infoUser: data });
    } catch (error) {
      console.error("Error loading user info:", error);
    }
  },
  getTodos: async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      set({ todos: data });
    } catch (error) {
      console.error( error);
    }
  },

  postTodo: async (elem) => {
    try {
       await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(elem),
      });
      get().getTodos();
    } catch (error) {
      console.error( error);
    }
  },
  putTodo: async (id, elem) => {
    try {
      await fetch(`${API}/${id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(elem),
      });
      get().getTodos(); 
    } catch (error) {
      console.error(error);
    }
  },

  deleteTodo: async (id) => {
    try {
      await fetch(`${API}/${id}`, 
        { method: 'DELETE' });
      await get().getTodos();
    } catch (error) {
      console.error(error);
    }
  }
}));