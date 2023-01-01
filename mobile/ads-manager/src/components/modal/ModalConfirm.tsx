import React, { useEffect, useRef } from 'react';
import { Image, View } from 'react-native';
import { Modalize, ModalizeProps } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { colors } from '../../themes/colors';
import images from '../../themes/images';
import Button from '../button/Button';
import Text from '../text/Text';

interface ModalConfirmProps extends ModalizeProps {
  visible: boolean;
  title?: string;
  description?: string;
  onPressConfirm?: () => void;
}

const ModalConfirm = ({
  visible = false,
  title = 'Confirmation',
  description = 'Are you sure you want to delete this?',
  onPressConfirm,
  ...rest
}: ModalConfirmProps) => {
  const modalizeRef = useRef<Modalize>(null);

  useEffect(() => {
    if (visible) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [visible]);
  return (
    <>
      <Portal>
        <Modalize
          ref={modalizeRef}
          snapPoint={380}
          modalHeight={380}
          useNativeDriver={true}
          handlePosition="inside"
          {...rest}
        >
          <View style={{ padding: 12, marginTop: 12 }}>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={images.image.confirm}
                style={{ height: 180, width: '100%' }}
                resizeMode="contain"
              />
              <View style={{ paddingTop: 16, alignItems: 'center' }}>
                <Text size={18} weight="600">
                  {title}
                </Text>
                <Text size={14} color={colors.grey1} center>
                  {description}
                </Text>
              </View>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 36 }}
              >
                <Button
                  text="Cancel"
                  style={{
                    borderRadius: 48 / 2,
                    width: 160,
                    backgroundColor: colors.primaryLight,
                    marginRight: 10,
                  }}
                  textStyle={{ color: colors.primary }}
                  onPress={() => modalizeRef.current?.close()}
                />
                <Button
                  text="Confirm"
                  style={{ borderRadius: 48 / 2, width: 160, marginLeft: 10 }}
                  onPress={onPressConfirm}
                />
              </View>
            </View>
          </View>
        </Modalize>
      </Portal>
    </>
  );
};

export default ModalConfirm;
