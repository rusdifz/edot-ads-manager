import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Text from '../text/Text';
import { colors } from '../../themes/colors';

type ChipProps = {
  text: string;
  color?: 'default' | 'blue' | 'primary';
  borderColor?: string;
  iconRight?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const Chip = ({ text, color = 'default', iconRight, style }: ChipProps) => {
  const colorDefault = { backgroundColor: colors.grey1Light, borderColor: colors.grey1 };
  const colorBlue = { backgroundColor: colors.blue1Light, borderColor: colors.blue1 };
  const colorPrimary = { backgroundColor: colors.primaryLight, borderColor: colors.primary };
  const checkColor =
    color === 'default' ? colorDefault : color === 'blue' ? colorBlue : colorPrimary;

  return (
    <View style={[styles.container, checkColor, style]}>
      <Text size={12} style={{ paddingRight: iconRight ? 8 : 0 }}>
        {text}
      </Text>
      {iconRight && iconRight}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 26,
    borderWidth: 0.8,
    borderRadius: 26 / 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});

export default Chip;
