"use client";
import { useState } from "react";
import {
  useGetPokemonByNameQuery,
  useAddPokemonMutation,
  useEditPokemonMutation,
  useDeletePokemonMutation,
} from "../services/pokemon";
import Link from "next/link";

type Todo = {
  id?: number;
  name: string;
  age: number | string;
  status: boolean
};

export default function Home() {
  const { data = [], error, isLoading } = useGetPokemonByNameQuery();
  const [addPokemon] = useAddPokemonMutation();
  const [editPokemon] = useEditPokemonMutation();
  const [deletePokemon] = useDeletePokemonMutation();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addAge, setAddAge] = useState("");
  const [addStatus, setAddStatus] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editStatus, setEditStatus] = useState(false);
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState("all")

  const added = async () => {
    await addPokemon({
      name: addName,
      age: addAge,
      status: addStatus
    });
    setAddName("");
    setAddAge("");
    setAddStatus(false);
    setIsAddOpen(false);
  };

  const handleEditClick = (el: Todo) => {
    setEditId(el.id!);
    setEditName(el.name);
    setEditAge(String(el.age));
    setEditStatus(el.status);
    setIsEditOpen(true);
  };

  const edited = async () => {
    await editPokemon({
      id: editId!,
      name: editName,
      age: editAge,
      status: editStatus
    });
    setIsEditOpen(false);
  };

  if (isLoading) return <div className="p-5 text-center font-bold text-xl">Боргирӣ...</div>;
  if (error) return <div className="p-5 text-red-500 text-center">Хатогӣ рӯй дод!</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-black">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all active:scale-95" >
            + New
          </button>
          <div className="flex flex-col md:flex-row gap-4 mb-8 ">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input type="search"
                placeholder="Search users..."
                value={search}
                onChange={(le) => setSearch(le.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              />
            </div>
            <div className="relative w-full md:w-48">
              <select
                value={filtered}
                onChange={(e) => setFiltered(e.target.value)}
                className="block w-full pl-3 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer transition-all">
                <option value="all">All </option>
                <option value="true">Active </option>
                <option value="false">Inactive </option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {data
            ?.filter((el) => el.name.toLowerCase().includes(search.toLowerCase()))
            ?.filter((el) => {
              if (filtered === "all") return true
              if (filtered === "true") return el.status === true
              if (filtered === "false") return el.status === false
              return true
            })

            ?.map((el: Todo) => (
              <div key={el.id} className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition">
                <div>
                  <p className="font-bold text-lg text-gray-800">{el.name}</p>
                  <p className="text-sm text-gray-500 font-medium">{el.age}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className={` ${el.status ? "green" : "red"}`}></div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ color: el.status ? "green" : "red" }}>
                      {el.status ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(el)} className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition">
                    Edit
                  </button>
                  <button onClick={() => deletePokemon(el.id!)} className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-600 hover:text-white transition">
                    Delete
                  </button>
                  <Link href={`/user/${el.id}`} className="cursor-pointer group">
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      info
                    </h3>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm shadow-2xl space-y-5 border border-gray-100">
            <h2 className="text-2xl font-black text-gray-800">Add User</h2>
            <div className="space-y-3">
              <input
                placeholder="Full Name"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-500 outline-none transition-colors"
              />
              <input
                placeholder="Age" type="number"
                value={addAge}
                onChange={(e) => setAddAge(e.target.value)}
                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-500 outline-none transition-colors"
              />
              <label className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded-lg transition">
                <input type="checkbox" className="w-5 h-5 accent-green-600" checked={addStatus} onChange={(e) => setAddStatus(e.target.checked)} />
                <span className="text-sm font-bold text-gray-600">status</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsAddOpen(false)} className="flex-1 py-3 font-bold text-gray-400 hover:text-gray-600 transition">Cancel</button>
              <button onClick={added} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition">Create</button>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm shadow-2xl space-y-5 border-t-8 border-blue-500">
            <div className="space-y-3">
              <input
                placeholder="Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none transition-colors"
              />
              <input
                placeholder="Age" type="number"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none transition-colors"
              />
              <label className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded-lg transition">
                <input type="checkbox" className="w-5 h-5 accent-blue-600" checked={editStatus} onChange={(e) => setEditStatus(e.target.checked)} />
                <span className="text-sm font-bold text-gray-600">status</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsEditOpen(false)} className="flex-1 py-3 font-bold text-gray-400 hover:text-gray-600">Close</button>
              <button onClick={edited} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}