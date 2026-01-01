import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { OnboardingFlow } from '../onboarding/OnboardingFlow';
import { GlobalChat } from './GlobalChat';
import { motion } from 'framer-motion';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding (mock logic)
    const hasOnboarded = localStorage.getItem('startupos_onboarded');
    if (!hasOnboarded) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('startupos_onboarded', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="flex min-h-screen bg-black text-neutral-200 font-sans selection:bg-primary-900 selection:text-white relative overflow-hidden">
      {showOnboarding && <OnboardingFlow onComplete={handleOnboardingComplete} />}
      
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-neutral-950/50">
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>

      <GlobalChat />
    </div>
  );
};