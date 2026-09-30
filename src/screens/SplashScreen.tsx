import React, { useEffect } from 'react';
import { BartrTextLogoFull } from '../components/BartrComponents';

interface SplashScreenProps {
  onSplashFinished: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onSplashFinished }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSplashFinished();
    }, 1100);

    return () => clearTimeout(timer);
  }, [onSplashFinished]);

  return (
    <div
      onClick={onSplashFinished}
      className="fixed inset-0 bg-[#0067F5] flex items-center justify-center cursor-pointer select-none z-50 animate-in fade-in duration-300"
    >
      <BartrTextLogoFull
        textColor="text-white"
        className="transform transition-transform scale-100 animate-in zoom-in-95 duration-500"
      />
    </div>
  );
};
