import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import images from '../../themes/images';
import Icon from '../icon/Icon';
import Text from '../text/Text';

type RadioButtonProps = {
  text?: string;
  textSize?: number;
  isActive: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const RadioButton = ({
  text,
  textSize = 14,
  isActive = false,
  onPress,
  style,
}: RadioButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.6}
      onPress={onPress}
      disabled={!onPress}
    >
      <Icon name={isActive ? images.icon.radio_active : images.icon.radio} />
      {text && (
        <Text size={textSize} paddingHorizontal={8}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default RadioButton;
