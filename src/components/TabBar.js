import React from "react";
import { colors } from '../config/colors';
import ToggleButton from './ToggleButton';
import { FaHome, FaCog } from 'react-icons/fa';

function TabBar({ currentScreen, onScreenChange }) {
  const styles = {
    tabBar: {
      width: '60px',
      backgroundColor: colors.tertiaryBackground,
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    toggleContainer: {
      position: 'absolute',
      top: '45px',
      transform: 'translateY(-50%)',
    }
  };

  return (
    <div style={styles.tabBar}>
      <div style={styles.toggleContainer}>
        <ToggleButton
          onToggle={() => onScreenChange(currentScreen === 'home' ? 'settings' : 'home')}
          disabled={false}
          leftIcon={FaHome}
          rightIcon={FaCog}
          isLeft={currentScreen === 'home'}
          vertical={true}
        />
      </div>
    </div>
  );
}

export default TabBar;