import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { Button, ModalConfirm, Text } from '../../../components';
import { colors } from '../../../themes/colors';
import { useToast } from 'react-native-toast-notifications';
import type { InputCancelInvitation, RequestType, ResponseCancelInvitation } from '../../../graphql/queries/accountSetting/accountSetting.interface';
import { DEFAULT_PHOTO, INVITATION_STATUS} from '../../../utils/static';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux'
import { accountSettingState, updateStatusRequest } from '../../../redux/accountSettingSlice';
import { useMutation } from '@apollo/client';
import { CANCEL_INVITATION } from '../../../graphql/queries/accountSetting/accountSettingMutation';
import PopupLoading from '../../../components/popupLoading/PopupLoading';

const MyRequest = () => {
  const toast = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const { myRequests } = useSelector(accountSettingState)
  const [selected, setSelected] = useState<RequestType>();

  const dispatch = useDispatch();

  const [cancelInvitation, {loading}] = useMutation<
    {cancelInvitation: ResponseCancelInvitation},
    {type: InputCancelInvitation}
  >(CANCEL_INVITATION, {variables: {type: { adsInvitationId: Number(selected?.id)}}})

  const onCancel = async () => {
    try {
      const res = await cancelInvitation();
      res.data?.cancelInvitation &&
        dispatch(updateStatusRequest(res.data.cancelInvitation))
      toast.show('Invitation request has been canceled!', { placement: 'top', type: 'success' });
    } catch (err) {
      console.error(JSON.stringify(err))
      toast.show('failed canceling invitation', { placement: 'top', type: 'danger' });
    } finally {
      setShowConfirm(false);
    }
  };

  const _renderItem = ({ item }: { item: RequestType }) => (
    <View style={styles.item}>
      <View style={styles.itemTop}>
        <Image source={{ uri: item.user_invited?.profile_picture || DEFAULT_PHOTO }} style={styles.avatar} />
        <View style={{ paddingLeft: 8, width: '80%' }}>
          <View style={{flexDirection:'row', paddingBottom:3}}>
            <Text numberOfLines={1} color={colors.text}>
              {item.user_invited?.fullname}{' '}
            </Text>
            <Text numberOfLines={1} color={colors.grey1}>
                @{item.user_invited?.username}
              </Text>
            </View>
            <View style={{paddingBottom:3}}>
              <Text size={12} weight="300">
              has been invited to {item.ads_account?.ads_account_name} as {item.role}.
            </Text>
            </View>
          <Text size={12} weight="300" color={colors.grey1}>
            {item.created_at ? moment(item.created_at).format('MMM DD, YYYY HH:mm') : ''}
          </Text>
        </View>
      </View>
      <View style={styles.wrapBtn}>
        <Button
          disabled={item.ads_invitation_status !== INVITATION_STATUS.PENDING}
          text={item.ads_invitation_status === INVITATION_STATUS.PENDING ? "Cancel Request" : item.ads_invitation_status.toUpperCase()}
          size="small"
          type="outline"
          style={item.ads_invitation_status === INVITATION_STATUS.PENDING ? styles.btn : styles.btnDisabled}
          onPress={() => {
            setShowConfirm(true)
            setSelected(item)
          }}
        />
      </View>
    </View>
  );

  return (
    <View>
      <FlatList
        data={myRequests}
        keyExtractor={(item) => item.id}
        renderItem={_renderItem}
      />
      <ModalConfirm
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Cancel Request?"
        description={`If you confirm, the invitation to @${selected?.user_invited.username || selected?.user_invited?.fullname.trim()}
        will be cancelled.`}
        onPressConfirm={() => onCancel()}
      />
      <PopupLoading loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 12,
    backgroundColor: colors.white,
  },
  itemTop: {
    flexDirection: 'row',
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 10,
  },
  wrapBtn: {
    paddingTop: 12,
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderColor: colors.grey1Light,
  },
  btn: {
    width: 160,
    borderRadius: 38 / 2,
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
    marginRight: 12,
  },
  btnDisabled: {
    width: 160,
    borderRadius: 38 / 2,
    marginRight: 12,
  }
});

export default MyRequest;
