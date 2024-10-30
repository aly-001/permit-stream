import React from 'react';
import { colors } from '../config/colors';
import AppText from './AppText';

const HeaderText = ({ text }) => {
  const styles = {
    contactsHeader: {
      color: colors.primaryText,
    }
  };

  return (
    <div style={styles.contactsHeader}>
      <AppText text={text} color={colors.primaryText} size="20px" />
    </div>
  );
};

export default HeaderText;

