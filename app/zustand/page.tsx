"use client";
import { useEffect, useState } from 'react';
import { useTodoStore } from '../store/Zustandstore';
import Link from 'next/link';

export default function ZustandTodoPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [editname, seteditName] = useState("");
  const [editage, seteditAge] = useState("");
  const [editModal, seteditModal] = useState(false);
  const [editid, seteditid] = useState(null);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState("all");

  const { todos, getTodos, postTodo, deleteTodo, putTodo } = useTodoStore();

  const added = async () => {
    await postTodo({ name, age: Number(age), status: false });
    setName(""); setAge(""); setAddModal(false);
  };

  const edited = async () => {
    if (editid) {
      await putTodo(editid, { name: editname, age: Number(editage) });
      seteditModal(false);
      seteditid(null);
    }
  };

  function openEditModal(e: any) {
    seteditAge(e.age);
    seteditName(e.name);
    seteditid(e.id);
    seteditModal(true);
  }

  useEffect(() => {
    getTodos();
  }, [getTodos]);

  const filteredTodos = todos
    .filter((el) => el.name.toLowerCase().includes(search.toLowerCase()))
    .filter((el) => {
      if (filtered === "all") return true;
      return String(el.status) === filtered;
    });

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-slate-800">
      <div className="max-w-4xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Zustand State</h1>
          </div>
          <button
            onClick={() => setAddModal(true)}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <span className="text-xl">+</span> New
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="md:col-span-2 relative">
            <input
              type="search"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
            />
            <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
          </div>
          <select
            value={filtered}
            onChange={(e) => setFiltered(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
          >
            <option value="all">All </option>
            <option value="true">Active </option>
            <option value="false">Inactive </option>
          </select>
        </div>

        <div className="grid gap-4">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((elem) => (
              <div key={elem.id} className="group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                    {elem.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{elem.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">Age: {elem.age}</span>
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${elem.status ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        {elem.status ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(elem)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(elem.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                  <Link href={`/user/${elem.id}`} className="cursor-pointer group">
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      info
                    </h3>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">No users found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
      {(addModal || editModal) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm shadow-2xl space-y-6">
            <h2 className="text-2xl font-black text-slate-900">
              {addModal ? "Create User" : "Update User"}
            </h2>
            <div className="space-y-4">
              <input
                placeholder="Full Name"
                className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all"
                value={addModal ? name : editname}
                onChange={(e) => addModal ? setName(e.target.value) : seteditName(e.target.value)}
              />
              <input
                placeholder="Age"
                type="number"
                className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all"
                value={addModal ? age : editage}
                onChange={(e) => addModal ? setAge(e.target.value) : seteditAge(e.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setAddModal(false); seteditModal(false); }}
                className="flex-1 py-3 font-bold text-slate-400 hover:text-slate-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={addModal ? added : edited}
                className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition active:scale-95 ${addModal ? "bg-indigo-600 shadow-indigo-100" : "bg-blue-600 shadow-blue-100"}`}
              >
                {addModal ? "Confirm" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}