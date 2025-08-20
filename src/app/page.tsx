"use client"
import { useState } from "react";
import { ImageUpload } from "./components/fileupload";

export default function Home() {
  const [asciiArt, setAsciiArt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = async () => {
  if (asciiArt) {
      try {
        await navigator.clipboard.writeText(asciiArt);
        alert("copied!");} 
        catch (err) {
        console.error('Failed to copy to clipboard:', err);}}
      };

  const downloadAsText = () => {
    if (asciiArt) {
      const blob = new Blob([asciiArt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
       link.href = url;
      link.download = 'ascii-art.txt';
      link.click();
      URL.revokeObjectURL(url);
    }};

  return (
    <div className="min-h-screen w-screen">
      <div className="flex flex-col justify-center items-center h-screen text-2xl">
        <p className="text-4xl font-bold mb-8">
          Convert Images to ASCII art
        </p>
        <ImageUpload onAsciiGenerated={setAsciiArt} onLoadingChange={setIsLoading}/>
        {isLoading && (
          <p className="text-lg text-gray-600 mt-4">Converting to ASCII...</p>)}
      </div>
      <div className="w-full bg-white border-t-2 border-gray-300">
        <div className="max-w-6xl mx-auto p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">ASCII Art Result</h2>
          <div className="bg-gray-900 text-green-400 p-6 rounded-lg min-h-96 font-mono text-xs overflow-auto">
            {asciiArt ? (
              <pre className="whitespace-pre-wrap">{asciiArt}</pre>
            ) : ( <div className="text-center text-gray-500 py-20">
                <p className="text-lg">Your ASCII art will appear here...</p>
                <p className="text-sm mt-2">Upload an image above to get started</p></div>)}
          </div>
           <div className="flex justify-center gap-4 mt-6">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400" 
            disabled={!asciiArt} onClick={copyToClipboard}>
              Copy ASCII Art
            </button>
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400" disabled={!asciiArt}onClick={downloadAsText}>
              Download as Text
            </button>
          </div>
    </div>
   </div>
    </div>
  );
}