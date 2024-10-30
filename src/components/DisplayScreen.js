import React from 'react';
import { colors } from "../config/colors";

function DisplayScreen() {
  const styles = {
    displayScreen: {
      flex: 1,
      backgroundColor: colors.primary,
      height: '100%',
    },
  };

  return (
    <div style={styles.displayScreen}>
      {/* Main content will be displayed here */}
    </div>
  );
}

export default DisplayScreen;