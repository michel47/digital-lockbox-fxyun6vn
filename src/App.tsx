import React, { useState } from 'react';
import { Eye, EyeOff, SquareAsterisk } from 'lucide-react';
import { SeedDropzone } from './components/SeedDropzone';
import { LockBox } from './components/LockBox';
import * as crypto from './lib/crypto';
import * as storage from './lib/storage';


console.log(crypto);

function App() {
  const [seed, setSeed] = useState<string | null>(null);
  const [boxId, setBoxId] = useState('');
  const [secret, setSecret] = useState('');
  const [keyCode, setKeyCode] = useState('');
  const [maxTrials, setMaxTrials] = useState(3);
  const [showKeyCode, setShowKeyCode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seed) return;
    
    setIsUnlocking(true);
    
    try {
      const salt = await crypto.generateSalt();
      const derivedBoxId = crypto.deriveBoxId(salt);
      const finalBoxId = boxId || String(derivedBoxId);
      const finalKeyCode = keyCode || await crypto.generateKeyCode();
      console.log({finalBoxId,finalKeyCode});
      
      const key = await crypto.deriveKey(seed, salt, Number(finalBoxId), finalKeyCode);
      const { ciphertext, iv } = await crypto.encryptSecret(key, secret);
      
      storage.saveBox(finalBoxId, {
        ciphertext,
        iv,
        maxTrials,
        trialsLeft: maxTrials,
      });
      
      // Update URL with salt
      window.location.hash = crypto.base64.encode(salt);
      
      setIsOpen(true);
      alert(`Box created!\nBox ID: ${finalBoxId}\nKey Code: ${finalKeyCode}`);
    } catch (error) {
      console.error('Error creating box:', error);
      alert('Failed to create box');
    } finally {
      setIsUnlocking(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-md mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">Digital Lockbox</h1>
        
        {!seed ? (
          <SeedDropzone onSeedLoaded={setSeed} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-8">
              <LockBox isOpen={isOpen} isUnlocking={isUnlocking} />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Box ID (optional)</label>
              <input
                type="text"
                value={boxId}
                onChange={(e) => setBoxId(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="Box ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Secret</label>
              <textarea
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your secret..."
                required
              />
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium mb-2">Key Code (optional)</label>
              <input
                type={showKeyCode ? 'text' : 'password'}
                value={keyCode}
                onChange={(e) => setKeyCode(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="•••••• (your memorable passcode)"
              />
              <button
                type="button"
                onClick={() => setShowKeyCode(!showKeyCode)}
                className="absolute right-3 top-9"
              >
                {showKeyCode ? (
                  <SquareAsterisk className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Max Trials</label>
              <input
                type="number"
                value={maxTrials}
                onChange={(e) => setMaxTrials(Number(e.target.value))}
                min="1"
                max="10"
                className="w-full px-4 py-2 rounded bg-gray-700 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Create Lockbox
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
