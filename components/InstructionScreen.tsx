
import React from 'react';
import { Play, ClipboardList, Timer, Calculator } from 'lucide-react';

interface InstructionScreenProps {
  onStartPractice: () => void;
  onStartTest: () => void;
}

export const InstructionScreen: React.FC<InstructionScreenProps> = ({ onStartPractice, onStartTest }) => {
  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col max-h-full">
        <div className="bg-blue-600 p-6 md:p-8 text-center shrink-0">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Petunjuk Pengerjaan</h1>
            <p className="text-blue-100 text-sm md:text-base">Harap baca dengan teliti sebelum memulai</p>
        </div>
        
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
            <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-lg">
                        <Calculator className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-base md:text-lg">Penjumlahan Angka</h3>
                        <p className="text-sm md:text-base text-gray-600">Jumlahkan dua angka yang tampil di layar (angka atas dan angka bawah).</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-lg">
                        <span className="text-lg md:text-xl">1..9</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-base md:text-lg">Input Satuan</h3>
                        <p className="text-sm md:text-base text-gray-600">
                            Ketik <strong>hanya digit terakhir</strong> dari hasil penjumlahan.<br/>
                            <span className="text-xs md:text-sm bg-gray-100 px-2 py-1 rounded mt-1 inline-block">Contoh: 8 + 7 = 15, maka ketik <strong>5</strong></span>
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-lg">
                        <Timer className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-base md:text-lg">Waktu Terbatas</h3>
                        <p className="text-sm md:text-base text-gray-600">
                            Setiap baris memiliki waktu <strong>15 detik</strong>. Jika waktu habis, soal akan otomatis berpindah ke baris berikutnya.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 border-t border-gray-100">
                <button 
                    onClick={onStartPractice}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 md:py-4 px-6 rounded-xl transition duration-200 transform active:scale-[0.98]"
                >
                    <ClipboardList className="w-5 h-5" />
                    Latihan
                </button>
                <button 
                    onClick={onStartTest}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 font-bold py-3 md:py-4 px-6 rounded-xl transition duration-200 shadow-lg shadow-blue-200 transform active:scale-[0.98]"
                >
                    <Play className="w-5 h-5 fill-current" />
                    Mulai Tes
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
