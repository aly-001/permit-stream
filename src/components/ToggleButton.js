import React from 'react';
import { colors } from '../config/colors';
import { FaInfo, FaCheck } from 'react-icons/fa';

function ToggleButton({ onToggle, disabled, isLeft, leftIcon: LeftIcon, rightIcon: RightIcon, vertical = false }) {
  const TOGGLE_SIZE = 60;
  const HALF_SIZE = TOGGLE_SIZE / 2;

  const styles = {
    container: {
      display: 'flex',
      backgroundColor: '#e0e0e0',
      borderRadius: '5px',
      position: 'relative',
      width: vertical ? `${HALF_SIZE}px` : `${TOGGLE_SIZE}px`,
      height: vertical ? `${TOGGLE_SIZE}px` : `${HALF_SIZE}px`,
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      alignItems: 'center',
      flexDirection: vertical ? 'column' : 'row',
    },
    slider: {
      position: 'absolute',
      backgroundColor: 'white',
      borderRadius: '5px',
      width: `${HALF_SIZE}px`,
      height: `${HALF_SIZE}px`,
      transition: 'transform 0.3s ease',
      transform: vertical
        ? `translateY(${isLeft ? '0px' : `${HALF_SIZE}px`})`
        : `translateX(${isLeft ? '0px' : `${HALF_SIZE}px`})`,
    },
    iconContainer: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
      color: '#666',
    },
    activeIcon: {
      color: '#2196F3',
    }
  };

  return (
    <div 
      style={styles.container} 
      onClick={disabled ? undefined : onToggle}
    >
      <div style={styles.slider} />
      <div style={{...styles.iconContainer, ...(isLeft && styles.activeIcon)}}>
        <LeftIcon size={12} />
      </div>
      <div style={{...styles.iconContainer, ...(!isLeft && styles.activeIcon)}}>
        <RightIcon size={12} />
      </div>
    </div>
  );
}

export default ToggleButton;