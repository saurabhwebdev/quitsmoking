'use client';

import { useSmokingData } from './hooks/useSmokingData';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';

export default function Home() {
  const { isInitialized, saveUserData } = useSmokingData();

  if (!isInitialized) {
    return <Onboarding onComplete={saveUserData} />;
  }

  return <Dashboard />;
}
