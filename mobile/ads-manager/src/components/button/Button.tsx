/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, Pressable, View } from 'react-native';
import Text from '../text/Text';
import type { ButtonProps } from './button.interfaces';
import { buttonDisable, buttonSize, buttonTypes } from './button.styles';
import { colors } from '../../themes/colors';

const Button = (props: ButtonProps) => {
  const {
    text = 'Button',
    type = 'primary',
    size = 'normal',
    style: styleOverride,
    textStyle: textStyleOverride,
    iconRight,
    iconLeft,
    ...rest
  } = props;

  const checkStyles = rest.disabled ? 'disable' : type;
  const viewStyles = checkStyles === 'disable' ? buttonDisable : buttonTypes[type];
  const textColor = rest.disabled
    ? colors.grey1
    : type === 'outline'
    ? colors.primary
    : colors.grey1Light;
  const textSize = size === 'small' ? 14 : 18;
  const iconSize = size === 'small' ? 14 : 18;

  return (
    <View style={[viewStyles, buttonSize[size], styleOverride]}>
      <Pressable
        {...rest}
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: size === 'normal' ? 48 : 38,
        }}
        android_ripple={{
          color: colors.grey1,
          borderless: true,
        }}
      >
        {iconLeft && <Image source={iconLeft} style={{ height: iconSize, width: iconSize }} />}
        <Text
          style={[{ color: textColor, fontSize: textSize, marginHorizontal: 8 }, textStyleOverride]}
          weight="600"
          color={textColor}
          size={textSize}
        >
          {text}
        </Text>
        {iconRight && <Image source={iconRight} style={{ height: iconSize, width: iconSize }} />}
      </Pressable>
    </View>
  );
};

export default Button;
