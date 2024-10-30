import React from "react";
import { colors } from '../config/colors';

function TabBar() {
  const styles = {
    tabBar: {
      width: '60px',
      backgroundColor: colors.tertiary,
      height: '100%',
    },
  };

  return (
    <div style={styles.tabBar}>
      {/* Tab icons and navigation will go here */}
    </div>
  );
}

export default TabBar;