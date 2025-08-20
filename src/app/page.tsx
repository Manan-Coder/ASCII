import Image from "next/image";
import { ImageUpload } from "./components/fileupload";

export default function Home() {
  return (
    <div className="min-h-screen w-scree">
      <div className="flex flex-col justify-center items-center h-screen text-2xl">
        <p className="text-4xl font-bold mb-8">
          Convert Images to ASCII art
        </p>
        <ImageUpload />
      </div>
      <div className="w-full bg-white border-t-2 border-gray-300">
        <div className="max-w-6xl mx-auto p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">ASCII Art Result</h2>
          <div className="bg-gray-900 text-green-400 p-6 rounded-lg min-h-96 font-mono text-xs overflow-auto">
            <div className="text-center text-gray-500 py-20">
              <p className="text-lg">Your ASCII art will appear here...</p>
              <p className="text-sm mt-2">Upload an image above to get started</p>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button 
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              disabled
            >
              Copy ascii Art
            </button>
            <button 
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
              disabled
            >
              Download as Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}