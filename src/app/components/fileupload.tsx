"use client"
import { useDropzone } from "react-dropzone";
import { useState } from "react";

export const ImageUpload = () => {
    const [image, setImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");
    
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        maxFiles: 1,
        maxSize: 5000000,
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                setFileName(file.name);
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                    setImage(e.target.result as string);
                
                }};
                reader.readAsDataURL(file);
            }
        }
    });

    const downloadImage = () => {
        if (image) {
            const link = document.createElement('a');
            link.href = image;
            link.download = fileName || 'downloaded-image';
            link.click();
        }
    };
    
    return (
        <div className="p-6">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed p-8 text-center cursor-pointer rounded-lg
                    ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
                `}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the image here...</p>
                ) : (
                    <p>Drag & drop an image here, or click to select</p>
                )}
            </div>

            {image && (
                <div className="mt-4 text-center">
                    <img src={image} alt="Uploaded" className="max-w-xs mx-auto mb-4" />
                        <div className="space-y-2">
                        <p className="text-sm text-gray-600">File: {fileName}</p>
                        <button onClick={downloadImage}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Download Image
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};