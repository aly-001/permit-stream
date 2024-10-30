// a text component that can be used throughout the app
// bold, takes in a color and a size prop, inline styles. Note react with electron

import React from "react";
import PropTypes from "prop-types";

const AppText = ({ text, color, size }) => {
  const styles = {
    fontWeight: "bold",
    color: color,
    fontSize: size,
  };

  return <span style={styles}>{text}</span>;
};

AppText.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.string,
};

AppText.defaultProps = {
  color: "black",
  size: "16px",
};

export default AppText;
