"use client";
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTodoStore } from '@/app/store/Zustandstore';

export default function UserInfoPage() {
  const params = useParams(); 
  const router = useRouter();
  const { infoUser, getInfo } = useTodoStore();

  useEffect(() => {
    if (params.id) {
      getInfo(params.id as string);
    }
  }, [params.id, getInfo]);

  if (!infoUser) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="mb-4 text-indigo-600 font-bold"
      >
        ← Back
      </button>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {infoUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">{infoUser.name}</h1>
            <p className="text-gray-500 font-medium text-lg">Age: {infoUser.age}</p>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-50">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Status</p>
          <p className={`text-xl font-bold ${infoUser.status ? "text-emerald-500" : "text-rose-500"}`}>
            {infoUser.status ? "● Active User" : "○ Inactive User"}
          </p>
        </div>
      </div>
    </div>
  );
}