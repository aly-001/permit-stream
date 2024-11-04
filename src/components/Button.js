import React from 'react';

function Button({ text, color = 'white', backgroundColor, onClick }) {
  const styles = {
    button: {
      backgroundColor: backgroundColor,
      border: 'none',
      color: color,
      padding: '7px 18px',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'inline-block',
      fontSize: '15px',
      fontWeight: '500',
      margin: '4px 2px',
      cursor: 'pointer',
      borderRadius: '8px',
    }
  };

  return (
    <button style={styles.button} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
