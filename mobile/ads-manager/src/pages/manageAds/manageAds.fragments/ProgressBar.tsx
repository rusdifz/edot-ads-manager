import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../../../components';
import { colors } from '../../../themes/colors';

type ProgressBarProps = {
  maxValue: number;
  value: number;
  label: string;
};

const ProgressBar = ({ maxValue = 100, value = 50, label = 'Label' }: ProgressBarProps) => {
  return (
    <View style={{ backgroundColor: colors.white, paddingHorizontal: 12 }}>
      <Text center size={12} color={colors.blue1}>
        {label}
      </Text>
      <View style={styles.container}>
        <View style={[styles.progress, { width: `${(100 * value) / maxValue}%` }]} />
      </View>
      <Text center size={12} color={colors.blue1}>{`${value}/${maxValue}`}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 12,
    width: '100%',
    borderWidth: 1,
    borderRadius: 12 / 2,
    borderColor: colors.blue1,
    padding: 2,
  },
  progress: {
    height: 6,
    backgroundColor: colors.blue1,
    borderRadius: 6 / 2,
  },
});

export default ProgressBar;
