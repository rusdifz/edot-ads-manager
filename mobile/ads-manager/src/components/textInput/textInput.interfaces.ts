import type {
  ImageSourcePropType,
  StyleProp,
  TextInputProps as NativeTextInputProps,
  ViewStyle,
} from 'react-native';

export interface TextInputProps extends NativeTextInputProps {
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
  paddingTop?: number;
  paddingBottom?: number;
  iconRight?: string;
  iconLeft?: ImageSourcePropType;
  onPressRightIcon?: () => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
}
