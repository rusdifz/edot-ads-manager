import React from 'react';
import { Image, ImageRequireSource, TouchableOpacity } from 'react-native';
import images from '../../themes/images';

type IconProps = {
  name: ImageRequireSource;
  size?: number;
  onPress?: () => void;
};

const Icon = ({ name = images.icon.ads_home, size = 20, onPress }: IconProps) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Image source={name} style={{ width: size, height: size }} resizeMode="contain" />
    </TouchableOpacity>
  );
};

export default Icon;
