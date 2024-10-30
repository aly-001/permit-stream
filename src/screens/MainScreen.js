import React from 'react';
import TabBar from '../components/TabBar';
import ContactsNav from '../components/ContactsNav';
import DisplayScreen from "../components/DisplayScreen";
import { colors } from '../config/colors';

function MainScreen() {
  React.useEffect(() => {
    // Set dark background on body and html elements
    document.body.style.backgroundColor = colors.primary;
    document.documentElement.style.backgroundColor = colors.primary;
    
    // Cleanup when component unmounts
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  const styles = {
    mainContainer: {
      display: 'flex',
      height: '100%',
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      backgroundColor: colors.primary,
    },
  };

  return (
    <div style={styles.mainContainer}>
      <TabBar />
      <ContactsNav />
      <DisplayScreen />
    </div>
  );
}

export default MainScreen;
