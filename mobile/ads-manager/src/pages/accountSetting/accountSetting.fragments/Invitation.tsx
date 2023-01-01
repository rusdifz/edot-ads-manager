import React from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { Button, Text } from '../../../components';
import { colors } from '../../../themes/colors';
import images from '../../../themes/images';
import { useSelector, useDispatch } from 'react-redux'; 
import { accountSettingState, pushNewAdsAccount, resolveInvitation } from '../../../redux/accountSettingSlice';
import type { InputRespondInvitation, InvitationType, ResponseRespondInvitation } from '../../../graphql/queries/accountSetting/accountSetting.interface';
import { DEFAULT_PHOTO } from '../../../utils/static';
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { RESPOND_INVITATION } from '../../../graphql/queries/accountSetting/accountSettingMutation';
import { useToast } from 'react-native-toast-notifications';
import PopupLoading from '../../../components/popupLoading/PopupLoading';

const Invitation = () => {
  const { myInvitations } = useSelector(accountSettingState);
  const dispatch = useDispatch();
  const toast = useToast()
  const [respondInvitation, {loading}] = useMutation<
    {respondInvitation: ResponseRespondInvitation},
    {type: InputRespondInvitation}
  >(RESPOND_INVITATION)

  const handleRejection = async (item: InvitationType) => {
    try {
      const res = await respondInvitation({variables: { type: { isApprove: false, adsInvitationId: Number(item.id) } }});
      res.data?.respondInvitation.updatedInvitation?.id &&
        dispatch(resolveInvitation(res.data?.respondInvitation.updatedInvitation?.id));
      toast.show("invitation has been rejected", { placement: 'top', type: 'success' });
    } catch (err:any) {
      console.error(JSON.stringify(err));
      toast.show(err?.message || "rejection failed", { placement: 'top', type: 'danger' });
    }
  }

  const handleApproval = async (item: InvitationType) => {
    try {
      const res = await respondInvitation({variables: { type: { isApprove: true, adsInvitationId: Number(item.id) } }});
      res.data?.respondInvitation.updatedInvitation?.id &&
        dispatch(resolveInvitation(res.data?.respondInvitation.updatedInvitation?.id));
      res.data?.respondInvitation.newAdsAccount &&
        dispatch(pushNewAdsAccount(res.data?.respondInvitation.newAdsAccount));
      toast.show("invitation has been approved", { placement: 'top', type: 'success' });
    } catch (err:any) {
      console.error(JSON.stringify(err));
      toast.show(err?.message || "approval failed", { placement: 'top', type: 'danger' });
    }
  }

  const _renderItem = ({ item: props }: { item: InvitationType }) => (
    <View style={styles.item}>
      <View style={styles.itemTop}>
        <Image source={{ uri: props.user_inviter?.profile_picture || DEFAULT_PHOTO }} style={styles.avatar} />
        <View style={{ paddingLeft: 8, width: '80%' }}>
          <View style={{flexDirection:'row'}}>
            <Text numberOfLines={1} color={colors.text}>
            {props.user_inviter.fullname}{' '}
            </Text>
            <Text numberOfLines={1} color={colors.grey1}>
              @{props.user_inviter.username}
            </Text>
          </View>
          <Text size={12} weight="300">
            has invited you to {props.ads_account.ads_account_name} as {props.role}.
          </Text>
          <Text size={12} weight="300" color={colors.grey1}>
           {props.updated_at ? moment(props.updated_at).format('MMM DD, YYYY HH:mm') : ''}
          </Text>
        </View>
      </View>
      <View style={styles.wrapBtn}>
        <Button
          text="Reject"
          size="small"
          type="outline"
          style={styles.btnReject}
          iconLeft={images.icon.delete_pink}
          onPress={() => handleRejection(props)}
        />
        <Button
          text="Approve"
          size="small"
          style={{ width: 120, borderRadius: 38 / 2 }}
          iconLeft={images.icon.check_circle}
          onPress={() => handleApproval(props)}
        />
      </View>
    </View>
  );
  return (
    <View>
      <FlatList
        data={myInvitations}
        keyExtractor={(item) => item.id}
        renderItem={_renderItem}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderColor: colors.grey1Light,
  },
  btnReject: {
    width: 120,
    borderRadius: 38 / 2,
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
    marginRight: 12,
  },
});

export default Invitation;
