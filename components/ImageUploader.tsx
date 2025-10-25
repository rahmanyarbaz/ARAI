import React from 'react';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageUpload: (file: File | null) => void;
  previewUrl: string | null;
  // FIX: Use React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactElement;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageUpload, previewUrl, icon }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    onImageUpload(file);
  };

  return (
    <div className="w-full md:w-1/2 p-2">
      <label htmlFor={id} className="block text-lg font-medium text-pink-100 mb-2">{label}</label>
      <div className="relative w-full h-64 border-2 border-dashed border-pink-200 rounded-lg flex items-center justify-center bg-white/10 hover:border-pink-300 transition-colors duration-300 cursor-pointer">
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="object-cover w-full h-full rounded-lg" />
        ) : (
          <div className="text-center text-pink-200">
            {icon}
            <p className="mt-2">Click to upload photo</p>
          </div>
        )}
        <input
          id={id}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageUploader;