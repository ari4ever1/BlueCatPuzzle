import React, { useState, useRef } from 'react';
import { useCatGame } from '../../lib/stores/useCatGame';
import { useAudio } from '../../lib/stores/useAudio';
import { defaultCatIcons, defaultPowerUps } from '../../assets/cats';

const Settings = () => {
  const toggleSettings = useCatGame(state => state.toggleSettings);
  const customCatImages = useCatGame(state => state.customCatImages);
  const setCustomCatImage = useCatGame(state => state.setCustomCatImage);
  const resetCustomImages = useCatGame(state => state.resetCustomImages);
  
  const isMuted = useAudio(state => state.isMuted);
  const toggleMute = useAudio(state => state.toggleMute);
  
  const [selectedCat, setSelectedCat] = useState(null);
  const fileInputRef = useRef(null);
  
  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file || !selectedCat) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    // Create object URL for the file
    const imageUrl = URL.createObjectURL(file);
    setCustomCatImage(selectedCat, imageUrl);
    
    // Reset selected cat after upload
    setSelectedCat(null);
  };
  
  // Handle cat selection for upload
  const handleCatSelect = (catId) => {
    setSelectedCat(catId);
    // Trigger file input click
    fileInputRef.current.click();
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-800">Settings</h2>
            <button 
              onClick={toggleSettings}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {/* Sound toggle */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Sound</h3>
            <button 
              onClick={toggleMute}
              className={`px-4 py-2 rounded-md ${isMuted ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
            >
              {isMuted ? 'Sound Off' : 'Sound On'}
            </button>
          </div>
          
          {/* Custom cat images */}
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Custom Cat Images</h3>
            <p className="text-sm text-gray-600 mb-3">
              Select a cat type below to upload your own custom image. Images should be square and preferably transparent PNG.
            </p>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              {defaultCatIcons.map(cat => (
                <div 
                  key={cat.id}
                  onClick={() => handleCatSelect(cat.id)}
                  className="relative cursor-pointer border rounded-lg p-1 hover:bg-blue-100 transition-colors"
                >
                  <div 
                    className="w-full aspect-square rounded-md"
                    style={{ background: cat.color }}
                    dangerouslySetInnerHTML={{ __html: cat.svg }}
                  />
                  <div className="text-xs text-center mt-1 truncate">{cat.name}</div>
                  
                  {/* Show indicator if custom image is set */}
                  {customCatImages[cat.id] && (
                    <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Custom Power-up Images</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {defaultPowerUps.map(powerUp => (
                <div 
                  key={powerUp.id}
                  onClick={() => handleCatSelect(powerUp.id)}
                  className="relative cursor-pointer border rounded-lg p-1 hover:bg-blue-100 transition-colors"
                >
                  <div 
                    className="w-full aspect-square rounded-md"
                    style={{ background: typeof powerUp.color === 'string' ? powerUp.color : 'gray' }}
                    dangerouslySetInnerHTML={{ __html: powerUp.svg }}
                  />
                  <div className="text-xs text-center mt-1 truncate">{powerUp.name}</div>
                  
                  {/* Show indicator if custom image is set */}
                  {customCatImages[powerUp.id] && (
                    <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Hidden file input */}
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            {/* Reset button */}
            <button
              onClick={resetCustomImages}
              className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Reset All Custom Images
            </button>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={toggleSettings}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
