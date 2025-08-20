"use client"
import { useDropzone } from "react-dropzone";
import { useState } from "react";

interface ImageUploadProps {
  onAsciiGenerated: (ascii: string) => void;
  onLoadingChange: (loading: boolean) => void;
}
const convertImageToAscii = (
  img: HTMLImageElement, 
  options: { width: number; charset: string; invert: boolean }
): string => {
  const { width, charset, invert } = options;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  const aspectRatio = img.height / img.width;
  const height = Math.floor(width * aspectRatio * 0.5);
  
  canvas.width = width;
  canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
const pixels = imageData.data;
    
  let ascii = '';
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * 4;
      const r = pixels[pixelIndex];
      const g = pixels[pixelIndex + 1];
      const b = pixels[pixelIndex + 2];
      const brightness = (r + g + b) / 3;
      const normalized = brightness / 255;
      const charIndex = Math.floor(
        (invert ? normalized : 1 - normalized) * (charset.length - 1)
      );
      
      ascii += charset[Math.min(charIndex, charset.length - 1)];
    }
    ascii += '\n';
  }
  
  return ascii;
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  })
}

export const ImageUpload = ({ onAsciiGenerated, onLoadingChange }: ImageUploadProps) => {
    const [image, setImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [asciiOptions, setAsciiOptions] = useState({
        width: 80,
        charset: "@%#*+=-:. ",
        invert: false
    })
    
    const characterSets = {
        standard: "@%#*+=-:. ",
        dense: "█▉▊▋▌▍▎▏ ",
        simple: "# .",
        detailed: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. "
    }
    
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']},
        maxFiles: 1,
        maxSize: 5000000,
    onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                setFileName(file.name);
                const reader = new FileReader();
                reader.onload = async (e) => {
                    if (e.target?.result) {
                        const dataUrl = e.target.result as string; 
                    setImage(dataUrl);
            await generateAscii(dataUrl);}};
              reader.readAsDataURL(file);}}});

    const generateAscii = async (imageData: string) => {
        try {
            onLoadingChange(true);
            const img = await loadImage(imageData);
             const ascii = convertImageToAscii(img, asciiOptions);
            onAsciiGenerated(ascii);} 
        catch (error) {
            console.error('Error generating ASCII art:', error);} 
            finally {
            onLoadingChange(false);}};

    const regenerateAscii = async () => {
        if (image) {
            await generateAscii(image);
        }
    };

    const downloadImage = () => {
        if (image) 
            {const link = document.createElement('a'); 
                link.href = image; 
            link.download = fileName || 'downloaded-image'; 
            link.click();}};
    
    return (
        <div className="p-6 max-w-md">
            <div {...getRootProps()} className={`border-2 border-dashed p-8 text-center cursor-pointer rounded-lg ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`}>
                <input {...getInputProps()} />
                {isDragActive ? (
                <p>Drop the image here...</p>):(<p>Drag & drop an image here, or click to select</p>)}
            </div>

            {image && (
                <div className="mt-4 text-center">
                    <img src={image} alt="Uploaded" className="max-w-xs mx-auto mb-4 rounded" />
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">File: {fileName}</p>
                        <div className="space-y-3 text-left">
                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Width: {asciiOptions.width} characters
                                </label>
                                <input type="range" min="40" max="150" value={asciiOptions.width}
                                    onChange={(e) => setAsciiOptions(prev => ({...prev,width: Number(e.target.value)}))} className="w-full"/>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                Character Set:
                                </label>
                                <select
                                    value={Object.entries(characterSets).find(([_, charset]) => charset === asciiOptions.charset)?.[0] || 'standard'}
                                    onChange={(e) => setAsciiOptions(prev => ({...prev,
                                          charset: characterSets[e.target.value as keyof typeof characterSets]}))}
                                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm">
                                    <option value="standard">Standard (@#*&$. )</option>
                                    <option value="dense">Dense Blocks (█▉▊▋▌▍▎▏ )</option>
                                     <option value="simple">Simple (# .)</option>
                                    <option value="detailed">Detailed (70+ chars)</option>
                                 </select>
                              </div>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="invertMode" checked={asciiOptions.invert}
                                    onChange={(e) => setAsciiOptions(prev => 
                                    ({...prev,invert: e.target.checked }))}className="rounded"/>
                                <label htmlFor="invertMode" className="text-sm font-medium text-gray-700">
                                    Invert (light/dark swap)
                                </label>
                            </div>
                            
                            <button onClick={regenerateAscii}className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 w-full">
                                Regenerate ASCII
                               </button>
                        </div>
                        
                        <button onClick={downloadImage} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">
                            Download Original Image
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};