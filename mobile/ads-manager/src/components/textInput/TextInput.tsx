/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Image,
  StyleSheet,
  TextInput as NativeTextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import images from '../../themes/images';
import { colors } from '../../themes/colors';
import Text from '../text/Text';
import type { TextInputProps } from './textInput.interfaces';

const TextInput = (props: TextInputProps, ref: any) => {
  const {
    placeholder = 'Text Input',
    disabled = false,
    paddingHorizontal = 0,
    paddingVertical = 0,
    paddingTop = 0,
    paddingBottom = 10,
    label = '',
    contentContainerStyle,
    iconRight,
    iconLeft,
    onPressRightIcon,
    ...rest
  } = props;

  const [onFocus, setOnFocus] = React.useState(false);

  const onTextInputFocus = () => {
    setOnFocus(true);
  };

  const onTextInputBlur = () => {
    setOnFocus(false);
  };

  return (
    <View style={{ paddingHorizontal, paddingVertical, paddingTop, paddingBottom }}>
      {label !== '' && (
        <Text color={colors.text} style={{ paddingBottom: 6 }} weight="500">
          {label}
        </Text>
      )}
      <View
        style={[
          styles.wrapTextInput,
          { borderColor: onFocus ? colors.primary : colors.grey1 },
          contentContainerStyle,
        ]}
      >
        {iconLeft && (
          <TouchableOpacity disabled style={{ marginLeft: 8 }}>
            <Image source={iconLeft} style={{ height: 20, width: 20 }} resizeMode="contain" />
          </TouchableOpacity>
        )}
        <NativeTextInput
          ref={ref}
          placeholder={placeholder}
          editable={!disabled}
          onFocus={onTextInputFocus}
          onBlur={onTextInputBlur}
          style={[styles.textInput, { width: '84%' }]}
          {...rest}
        />
        {iconRight && (
          <TouchableOpacity onPress={onPressRightIcon}>
            <Image source={images.icon.close} style={{ height: 20, width: 20 }} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapTextInput: {
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    height: 48,
    paddingHorizontal: 8,
    fontSize: 16,
  },
});

export default React.forwardRef(TextInput);
