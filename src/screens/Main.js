import React, { useState } from 'react';
import TabBar from '../components/TabBar';
import { colors } from '../config/colors';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';
import { ContactProvider } from '../contexts/ContactContext';

function MainScreen() {
  const [currentScreen, setCurrentScreen] = useState('home');

  React.useEffect(() => {
    document.body.style.backgroundColor = colors.primaryBackground;
    document.documentElement.style.backgroundColor = colors.primaryBackground;
    
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  return (
    <ContactProvider>
      <div style={{ display: 'flex' }}>
        <TabBar 
          currentScreen={currentScreen}
          onScreenChange={setCurrentScreen}
        />
        {currentScreen === 'home' ? <HomeScreen /> : <SettingsScreen />}
      </div>
    </ContactProvider>
  );
}

export default MainScreen;
