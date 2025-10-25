
import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import { UserIcon } from './components/icons';
import { generateHugImage, type ImageData } from './services/geminiService';
import { fileToBase64, applyWatermark } from './utils/imageUtils';

interface UploadedImage {
  file: File | null;
  previewUrl: string | null;
  mimeType: string | null;
}

const App: React.FC = () => {
  const [boyImage, setBoyImage] = useState<UploadedImage>({ file: null, previewUrl: null, mimeType: null });
  const [girlImage, setGirlImage] = useState<UploadedImage>({ file: null, previewUrl: null, mimeType: null });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File | null, setter: React.Dispatch<React.SetStateAction<UploadedImage>>) => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setter({ file, previewUrl: preview, mimeType: file.type });
    } else {
      setter({ file: null, previewUrl: null, mimeType: null });
    }
  }, []);

  const handleGenerateClick = async () => {
    if (!boyImage.file || !girlImage.file || !boyImage.mimeType || !girlImage.mimeType) {
      setError("Please upload both photos before generating.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const boyBase64 = await fileToBase64(boyImage.file);
      const girlBase64 = await fileToBase64(girlImage.file);

      const boyImageData: ImageData = { base64: boyBase64, mimeType: boyImage.mimeType };
      const girlImageData: ImageData = { base64: girlBase64, mimeType: girlImage.mimeType };

      const resultBase64 = await generateHugImage(boyImageData, girlImageData);
      const watermarkedImage = await applyWatermark(resultBase64, 'ARAI');
      
      setGeneratedImage(watermarkedImage);

    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
    
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'ARAI_moment.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white font-sans flex flex-col items-center p-4 sm:p-6">
      <header className="text-center my-8 animate-fade-in-down">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">ARAI</h1>
        <p className="text-lg md:text-xl text-pink-200 mt-2">Create beautiful moments, powered by AI.</p>
      </header>
      
      <main className="w-full max-w-4xl flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row mb-6">
          <ImageUploader id="boy-photo" label="1. Upload Photo of Boy" onImageUpload={(file) => handleImageUpload(file, setBoyImage)} previewUrl={boyImage.previewUrl} icon={<UserIcon />} />
          <ImageUploader id="girl-photo" label="2. Upload Photo of Girl" onImageUpload={(file) => handleImageUpload(file, setGirlImage)} previewUrl={girlImage.previewUrl} icon={<UserIcon />} />
        </div>
        
        {error && <div className="bg-red-500/50 text-white p-3 rounded-lg mb-4 animate-shake">{error}</div>}
        
        <button
          onClick={handleGenerateClick}
          disabled={!boyImage.file || !girlImage.file || isLoading}
          className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-pink-400/50"
        >
          {isLoading ? 'Generating...' : 'Create Magic!'}
        </button>

        <div className="w-full flex justify-center mt-6">
            <ResultDisplay imageUrl={generatedImage} isLoading={isLoading} onDownload={handleDownload} />
        </div>
      </main>

      <footer className="text-center text-pink-300/50 text-sm mt-auto py-4">
        <p>ARAI Photo Editor &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;
