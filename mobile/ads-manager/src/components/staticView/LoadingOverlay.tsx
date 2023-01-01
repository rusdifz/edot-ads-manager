import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { colors } from '../../themes/colors';
import Text from '../text/Text';

type LoadingOverlayProps = {
  visible: boolean;
  text?: string;
};

const LoadingOverlay = ({ visible = false, text = 'Please Wait ..' }: LoadingOverlayProps) => {
  return (
    <>
      <Modal visible={visible} transparent>
        <View style={styles.container}>
          <View style={styles.wrapLoader}>
            <ActivityIndicator size="large" color={colors.grey1} />
            <Text color={colors.grey1}>{text}</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blackDim,
  },
  wrapLoader: {
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 6,
  },
});

export default LoadingOverlay;
