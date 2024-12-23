import React, { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';

interface LockBoxProps {
  isOpen: boolean;
  isUnlocking: boolean;
}

export function LockBox({ isOpen, isUnlocking }: LockBoxProps) {
  return (
    <div className="relative w-48 h-48">
      <div
        className={`absolute inset-0 transition-transform duration-1000 ${
          isOpen ? 'scale-110' : 'scale-100'
        }`}
      >
        <div className="relative w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg shadow-xl">
          <div
            className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg transform transition-opacity duration-500 ${
              isUnlocking ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {isOpen ? (
              <Unlock className="w-16 h-16 text-white" />
            ) : (
              <Lock className="w-16 h-16 text-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}