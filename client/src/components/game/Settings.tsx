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
                  >
                    <svg viewBox="0 0 24 24" className="w-full h-full" fill="white">
                      <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M7.77,9.25l3.12-1.56C11.18,7.53,11.59,7.5,12,7.5s0.82,0.03,1.11,0.19l3.12,1.56c0.76,0.38,1.12,1.26,0.9,2.04l-0.84,2.93c-0.53,1.85-2.28,3.18-4.29,3.18s-3.76-1.33-4.29-3.18l-0.84-2.93C6.65,10.51,7.01,9.63,7.77,9.25z M8.5,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S9.05,11,8.5,11z M15.5,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S16.05,11,15.5,11z" />
                      <path d="M13.95,15.5c-0.55,0.34-1.26,0.34-1.81,0c-0.27-0.17-0.62-0.08-0.79,0.19c-0.17,0.27-0.08,0.62,0.19,0.79c0.45,0.28,0.97,0.42,1.49,0.42s1.04-0.14,1.49-0.42c0.27-0.17,0.35-0.52,0.19-0.79S14.22,15.33,13.95,15.5z" />
                    </svg>
                  </div>
                  
                  <div className="text-xs text-center mt-1 font-bold" style={{ color: cat.color }}>
                    {cat.name}
                  </div>
                  
                  {/* Preview of custom image if set */}
                  {customCatImages[cat.id] && (
                    <div className="absolute inset-0 p-1 bg-white bg-opacity-90 rounded-lg flex flex-col items-center justify-center">
                      <img 
                        src={customCatImages[cat.id]} 
                        alt={cat.name} 
                        className="w-full h-3/4 object-contain"
                      />
                      <div className="text-xs font-bold mt-1" style={{ color: cat.color }}>
                        {cat.name}
                      </div>
                      <div className="absolute top-0 right-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
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
                    className="w-full aspect-square rounded-md flex items-center justify-center"
                    style={{ 
                      background: powerUp.id === 'rainbow' 
                        ? 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)' 
                        : (powerUp.id === 'bomb' ? '#2d3748' : 'gray') 
                    }}
                  >
                    {powerUp.id === 'rainbow' && (
                      <svg viewBox="0 0 24 24" className="w-full h-full" fill="white">
                        <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M7.77,9.25l3.12-1.56C11.18,7.53,11.59,7.5,12,7.5s0.82,0.03,1.11,0.19l3.12,1.56c0.76,0.38,1.12,1.26,0.9,2.04l-0.84,2.93c-0.53,1.85-2.28,3.18-4.29,3.18s-3.76-1.33-4.29-3.18l-0.84-2.93C6.65,10.51,7.01,9.63,7.77,9.25z M8.5,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S9.05,11,8.5,11z M15.5,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S16.05,11,15.5,11z" />
                        <path d="M13.95,15.5c-0.55,0.34-1.26,0.34-1.81,0c-0.27-0.17-0.62-0.08-0.79,0.19c-0.17,0.27-0.08,0.62,0.19,0.79c0.45,0.28,0.97,0.42,1.49,0.42s1.04-0.14,1.49-0.42c0.27-0.17,0.35-0.52,0.19-0.79S14.22,15.33,13.95,15.5z" />
                        <circle cx="12" cy="12" r="9" fill="none" stroke="white" strokeWidth="1" strokeDasharray="1,1"/>
                      </svg>
                    )}
                    {powerUp.id === 'bomb' && (
                      <svg viewBox="0 0 24 24" className="w-full h-full" fill="white">
                        <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M7.77,9.25l3.12-1.56C11.18,7.53,11.59,7.5,12,7.5s0.82,0.03,1.11,0.19l3.12,1.56c0.76,0.38,1.12,1.26,0.9,2.04l-0.84,2.93c-0.53,1.85-2.28,3.18-4.29,3.18s-3.76-1.33-4.29-3.18l-0.84-2.93C6.65,10.51,7.01,9.63,7.77,9.25z M8.5,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S9.05,11,8.5,11z M15.5,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S16.05,11,15.5,11z" />
                        <path d="M13.95,15.5c-0.55,0.34-1.26,0.34-1.81,0c-0.27-0.17-0.62-0.08-0.79,0.19c-0.17,0.27-0.08,0.62,0.19,0.79c0.45,0.28,0.97,0.42,1.49,0.42s1.04-0.14,1.49-0.42c0.27-0.17,0.35-0.52,0.19-0.79S14.22,15.33,13.95,15.5z" />
                        <circle cx="12" cy="12" r="5" fill="#ff0000" stroke="white" strokeWidth="1" opacity="0.7"/>
                      </svg>
                    )}
                  </div>
                  
                  <div className="text-xs text-center mt-1 font-bold">
                    {powerUp.name}
                  </div>
                  
                  {/* Preview of custom image if set */}
                  {customCatImages[powerUp.id] && (
                    <div className="absolute inset-0 p-1 bg-white bg-opacity-90 rounded-lg flex flex-col items-center justify-center">
                      <img 
                        src={customCatImages[powerUp.id]} 
                        alt={powerUp.name} 
                        className="w-full h-3/4 object-contain"
                      />
                      <div className="text-xs font-bold mt-1">
                        {powerUp.name}
                      </div>
                      <div className="absolute top-0 right-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
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
