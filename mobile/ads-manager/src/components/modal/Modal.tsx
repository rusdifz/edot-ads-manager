import React from 'react';
import { Modal as NativeModal, ModalProps, View } from 'react-native';
import images from '../../themes/images';
import Icon from '../icon/Icon';
import Text from '../text/Text';
import modalStyles from './modal.styles';

interface MyModalProps extends ModalProps {
  title: string;
  onClose: () => void;
  width?: string | number;
  height?: string | number;
}

const Modal = ({ title = 'My Modal', onClose, children, height, width, ...rest }: MyModalProps) => {
  return (
    <NativeModal {...rest} transparent>
      <View style={modalStyles.container}>
        <View style={[modalStyles.content, { height, width }]}>
          <View style={modalStyles.wrapHeader}>
            <Text size={20} weight="600">
              {title}
            </Text>
            <Icon name={images.icon.close} onPress={onClose} />
          </View>
          {children}
        </View>
      </View>
    </NativeModal>
  );
};

export default Modal;
