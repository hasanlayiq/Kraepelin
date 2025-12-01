
import React from 'react';
import { RowResult, UserProfile } from '../types';
import { CheckCircle, RotateCcw, BarChart2, Play, Home, Send, Loader2 } from 'lucide-react';

interface ResultSummaryProps {
  user: UserProfile;
  results: RowResult[];
  title: string;
  isPractice?: boolean;
  onRetry: () => void;
  onStartTest?: () => void;
  onSend?: () => void;
  isSending?: boolean;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ 
  user, 
  results, 
  title,
  isPractice = false,
  onRetry,
  onStartTest,
  onSend,
  isSending = false
}) => {
  const totalCorrect = results.reduce((acc, curr) => acc + curr.correctCount, 0);
  const totalFilled = results.reduce((acc, curr) => acc + curr.totalFilled, 0);
  
  // Calculate average speed (filled per row)
  const avgSpeed = (totalFilled / results.length).toFixed(1);
  // Calculate accuracy percentage
  const accuracy = totalFilled > 0 ? ((totalCorrect / totalFilled) * 100).toFixed(1) : '0';

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col max-h-full">
        <div className="bg-blue-600 p-6 md:p-8 text-center shrink-0">
          <div className="mx-auto bg-white/20 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 md:mb-4 backdrop-blur-sm">
            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">{title} Selesai!</h1>
          <p className="text-blue-100 text-sm md:text-base">Terima kasih, {user.name} ({user.number})</p>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="bg-blue-50 p-2 md:p-4 rounded-xl text-center">
               <span className="block text-xs md:text-sm text-blue-600 font-semibold mb-1">Total Diisi</span>
               <span className="text-xl md:text-3xl font-bold text-gray-800">{totalFilled}</span>
            </div>
            <div className="bg-green-50 p-2 md:p-4 rounded-xl text-center">
               <span className="block text-xs md:text-sm text-green-600 font-semibold mb-1">Akurasi</span>
               <span className="text-xl md:text-3xl font-bold text-gray-800">{accuracy}%</span>
            </div>
            <div className="bg-purple-50 p-2 md:p-4 rounded-xl text-center">
               <span className="block text-xs md:text-sm text-purple-600 font-semibold mb-1">Rata/Baris</span>
               <span className="text-xl md:text-3xl font-bold text-gray-800">{avgSpeed}</span>
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <h3 className="flex items-center gap-2 text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">
                <BarChart2 className="w-5 h-5 text-gray-500" />
                Detail Per Baris
            </h3>
            <div className="overflow-hidden rounded-xl border border-gray-200 max-h-48 md:max-h-64 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-4 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Baris</th>
                            <th className="px-4 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Diisi</th>
                            <th className="px-4 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Benar</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {results.map((res) => (
                            <tr key={res.rowIndex}>
                                <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                                    Baris {res.rowIndex + 1}
                                </td>
                                <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                                    {res.totalFilled}
                                </td>
                                <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-green-600 font-semibold">
                                    {res.correctCount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {isPractice && onStartTest && (
                <button
                    onClick={onStartTest}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 md:py-4 px-6 rounded-xl transition duration-200 shadow-lg shadow-blue-200 transform active:scale-[0.99]"
                >
                    <Play className="w-5 h-5 fill-current" />
                    Mulai Tes
                </button>
            )}

            {!isPractice && onSend && (
                 <button
                 onClick={onSend}
                 disabled={isSending}
                 className={`w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 md:py-4 px-6 rounded-xl transition duration-200 shadow-lg shadow-green-200 transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
             >
                 {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                 {isSending ? 'Mengirim...' : 'Kirim Hasil'}
             </button>
            )}

            <button
                onClick={onRetry}
                disabled={isSending}
                className={`w-full flex items-center justify-center gap-2 font-semibold py-3 md:py-4 px-6 rounded-xl transition duration-200 border-2 
                    ${isPractice 
                        ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {isPractice ? <RotateCcw className="w-5 h-5" /> : <Home className="w-5 h-5" />}
                {isPractice ? 'Ulangi Latihan' : 'Kembali ke Awal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
