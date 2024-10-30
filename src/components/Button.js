import React from 'react';

function Button({ text, color, onClick }) {
  const styles = {
    button: {
      backgroundColor: color,
      border: 'none',
      color: 'white',
      padding: '10px 20px',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'inline-block',
      fontSize: '16px',
      margin: '4px 2px',
      cursor: 'pointer',
      borderRadius: '4px',
    }
  };

  return (
    <button style={styles.button} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
