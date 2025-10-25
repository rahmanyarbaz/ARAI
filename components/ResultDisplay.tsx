
import React from 'react';
import { DownloadIcon } from './icons';

interface ResultDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  onDownload: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-white p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-300 mb-4"></div>
        <p className="text-lg font-semibold">ARAI is creating your moment...</p>
        <p className="text-sm text-pink-200 mt-2">This can take a minute or two.</p>
    </div>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, isLoading, onDownload }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="mt-8 w-full max-w-2xl flex flex-col items-center animate-fade-in">
        <h2 className="text-2xl font-bold text-pink-100 mb-4">Your Masterpiece!</h2>
        <div className="relative group w-full">
            <img src={imageUrl} alt="Generated" className="rounded-lg shadow-2xl w-full" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-lg">
                <button
                    onClick={onDownload}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center"
                >
                    <DownloadIcon />
                    Download
                </button>
            </div>
        </div>
    </div>
  );
};

export default ResultDisplay;
