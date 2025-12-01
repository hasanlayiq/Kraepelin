
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Hash, ArrowRight } from 'lucide-react';

interface BiodataFormProps {
  onComplete: (profile: UserProfile) => void;
}

export const BiodataForm: React.FC<BiodataFormProps> = ({ onComplete }) => {
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim() || !name.trim()) {
      setError('Mohon lengkapi semua data.');
      return;
    }
    onComplete({ number, name });
  };

  return (
    <div className="h-screen bg-gray-50 px-4 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 max-h-full overflow-y-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tes Kraepelin</h1>
          <p className="text-gray-500">Latihan Kecepatan & Ketelitian</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Peserta</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Contoh: 001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Masukkan nama anda"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform active:scale-[0.98]"
          >
            Berikutnya
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
