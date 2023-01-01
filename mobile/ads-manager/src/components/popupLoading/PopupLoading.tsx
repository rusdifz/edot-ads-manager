import React from 'react';
import { View, ActivityIndicator, Modal } from 'react-native';
import popupLoadingStyles from './popupLoading.styles';
import { colors } from '../../themes/colors';

interface PopupLoadingProps {
    loading: boolean;
}

const PopupLoading = ({loading}: PopupLoadingProps) => {
    return(
        <Modal style={popupLoadingStyles.modal} visible={loading} transparent={true}>
            <View style={[popupLoadingStyles.container, popupLoadingStyles.horizontal]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        </Modal>
    )
}

export default PopupLoading;