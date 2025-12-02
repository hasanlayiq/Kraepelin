
import React, { useState } from 'react';
import { BiodataForm } from './components/BiodataForm';
import { InstructionScreen } from './components/InstructionScreen';
import { PracticeSession } from './components/PracticeSession';
import { ResultSummary } from './components/ResultSummary';
import { AppStage, UserProfile, RowResult } from './types';
import { PRACTICE_ROWS, TEST_ROWS } from './constants';

function App() {
  const [stage, setStage] = useState<AppStage>(AppStage.INTRO);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [results, setResults] = useState<RowResult[]>([]);
  const [isSending, setIsSending] = useState(false);
  // Store test rows in state so they persist if we re-render but typically generated once per test
  const [testRows, setTestRows] = useState<number[][]>([]);

  const handleBiodataComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setStage(AppStage.INSTRUCTION);
  };

  const handleStartPractice = () => {
    setResults([]);
    setStage(AppStage.PRACTICE);
  };

  const handlePracticeComplete = (finalResults: RowResult[]) => {
    setResults(finalResults);
    setStage(AppStage.PRACTICE_RESULT);
  };

  const handleTestComplete = (finalResults: RowResult[]) => {
    setResults(finalResults);
    setStage(AppStage.TEST_RESULT);
  };

  const handleStartTest = () => {
    setResults([]);
    setTestRows(TEST_ROWS); // Use the provided 50 rows
    setStage(AppStage.TEST);
  };

  const handleGoHome = () => {
    setUserProfile(null);
    setResults([]);
    setStage(AppStage.INTRO);
  };

  const handleSendResults = async () => {
    if (!userProfile) return;

    setIsSending(true);

    // Prepare payload
    // Note: 'hasil' is an array of correct counts per row
    const payload = {
        nomorPeserta: userProfile.number,
        namaLengkap: userProfile.name,
        hasil: results.map(r => r.correctCount)
    };

    console.log("Sending payload:", payload);

    try {
        // Menggunakan mode: 'no-cors' adalah cara standar untuk mengirim data ke Google Apps Script dari browser client-side
        // tanpa memicu error CORS policy yang memblokir request.
        // Konsekuensinya: Kita tidak bisa membaca response dari server (opaque response).
        await fetch("https://script.google.com/macros/s/AKfycbye4oo7PBQlWSK2da38CJ50AIglGn1pbizWaNq1pOkmSdDtigdex1BuOi4NYtRJczfk/exec", {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain", // Sederhanakan header agar dianggap simple request
            },
            body: JSON.stringify(payload)
        });

        // Karena no-cors, fetch akan resolve meskipun server mengembalikan error logic (asalkan server bisa dijangkau).
        // Kita asumsikan sukses jika code sampai sini.
        alert("Hasil tes berhasil dikirim!");
        handleGoHome();
    } catch (error) {
        console.error("Error sending results:", error);
        alert("Gagal mengirim data. Pastikan koneksi internet lancar dan coba lagi.");
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="font-sans text-gray-900">
      {stage === AppStage.INTRO && (
        <BiodataForm onComplete={handleBiodataComplete} />
      )}
      
      {stage === AppStage.INSTRUCTION && (
        <InstructionScreen 
            onStartPractice={handleStartPractice}
            onStartTest={handleStartTest}
        />
      )}

      {stage === AppStage.PRACTICE && (
        <PracticeSession 
          title="Latihan"
          rows={PRACTICE_ROWS} 
          onComplete={handlePracticeComplete} 
        />
      )}

      {stage === AppStage.PRACTICE_RESULT && userProfile && (
        <ResultSummary 
            title="Latihan"
            user={userProfile} 
            results={results} 
            isPractice={true}
            onRetry={handleStartPractice}
            onStartTest={handleStartTest}
        />
      )}

      {stage === AppStage.TEST && (
         <PracticeSession 
            title="Tes Kraepelin"
            rows={testRows} 
            onComplete={handleTestComplete} 
        />
      )}

      {stage === AppStage.TEST_RESULT && userProfile && (
        <ResultSummary 
            title="Tes"
            user={userProfile} 
            results={results} 
            isPractice={false}
            onRetry={handleGoHome} // In test result, retry acts as "Home" based on button label logic in component
            onSend={handleSendResults}
            isSending={isSending}
        />
      )}
    </div>
  );
}

export default App;
