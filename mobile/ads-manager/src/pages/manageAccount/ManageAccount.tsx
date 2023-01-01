import React, { useState } from 'react';
import { FlatList, Image, View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import images from '../../themes/images';
import { Button, Chip, Icon, Modal, ModalConfirm, Text, TextInput } from '../../components';
import manageAccountStyles from './manageAccount.styles';
import { useSelector, useDispatch } from 'react-redux';
import { accountSettingState, removeAdsAccountState, updateAccountNameState} from '../../redux/accountSettingSlice'
import type { AccountMemberType, AdsAccountType, InputLeaveAdsAccount, InputRenameAccount, ResponseLeaveAdsAccount, ResponseRenameAccount } from '../../graphql/queries/accountSetting/accountSetting.interface';
import { USER_ROLE } from '../../utils/static';
import { useMutation } from '@apollo/client';
import { LEAVE_ACCOUNT, UPDATE_ACCOUNT_NAME } from '../../graphql/queries/accountSetting/accountSettingMutation';
import PopupLoading from '../../components/popupLoading/PopupLoading';
import { useToast } from 'react-native-toast-notifications';

const ManageAccount = () => {
  const [showRename, setShowRename] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AdsAccountType>();
  const { adsAccounts } = useSelector(accountSettingState)
  const [inputName, setInputName] = useState<string>("");
  const toast = useToast();
  const dispatch = useDispatch();

  const [updateAdsAccountName, { loading: loadingRename}] = useMutation<
    { updateAdsAccountName: ResponseRenameAccount },
    { type: InputRenameAccount }
  >(UPDATE_ACCOUNT_NAME, { variables: { type: { adsAccountId: selectedAccount?.id || "",  adsAccountName: inputName} } })

  const [leaveAdsAccount, { loading: loadingLeave }] = useMutation<
    { leaveAdsAccount: ResponseLeaveAdsAccount},
    { type: InputLeaveAdsAccount}
  >(LEAVE_ACCOUNT, { variables: { type: { adsAccountId: Number(selectedAccount?.id) } }})

  const handleRename = async () => {
    try {
      const res = await updateAdsAccountName();
      res.data?.updateAdsAccountName &&
        dispatch(updateAccountNameState(res.data.updateAdsAccountName));
      toast.show("rename success", { placement: 'top', type: 'success' });
    } catch (err: any) {
      console.error(JSON.stringify(err)); 
      toast.show(err.message || "error rename account", { placement: 'top', type: 'danger' });
    } finally {
      setShowRename(false)
    }
  }

  const handleLeave = async () => {
    try {
      console.log(selectedAccount?.id)
      const res = await leaveAdsAccount();
      res.data?.leaveAdsAccount &&
        dispatch(removeAdsAccountState(res.data?.leaveAdsAccount));
      console.log(res.data?.leaveAdsAccount.id)
      toast.show("leave success", { placement: 'top', type: 'success' });
    } catch (err: any) {
      console.error(JSON.stringify(err)); 
      toast.show(err.message || "error leave account", { placement: 'top', type: 'danger' });
    } finally {
      setShowLeave(false)
    }
  }

  return (
    <>
      <FlatList
        data={adsAccounts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={manageAccountStyles.container}
        renderItem={({ item }) => (
          <View style={manageAccountStyles.item}>
            <View style={{ width: '90%' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text size={18} weight="400">
                  {item.ads_account_name}
                </Text>
                <View style={{ paddingHorizontal: 8 }}>
                  <Chip text={item.account_type} color="blue" />
                </View>
              </View>
              <Text size={14} weight="400">
                ID{item.id} - {item.ads_account_members.find((member:AccountMemberType) => member.is_me)?.role || ''}
              </Text>
            </View>
              <View style={{ width: '10%', alignItems: 'flex-end' }}>
                <Menu>
                  <MenuTrigger>
                    <Image
                      source={images.icon.menu}
                      style={{ height: 20, width: 20 }}
                      resizeMode="contain"
                    />
                  </MenuTrigger>
                  <MenuOptions optionsContainerStyle={{ marginTop: -20 }}>
                    {
                      item.ads_account_members.find((member: AccountMemberType) => member.is_me)?.role === USER_ROLE.OWNER 
                      ?
                      <MenuOption
                       value={2}
                       style={{ flexDirection: 'row' }}
                       onSelect={() => {
                        setInputName(item.ads_account_name)
                        setShowRename(true);
                        setSelectedAccount(item);
                      }}
                     >
                       <Icon name={images.icon.edit} />
                       <Text paddingHorizontal={10}>Rename</Text>
                     </MenuOption>
                     :
                     <MenuOption
                      value={2}
                      style={{ flexDirection: 'row' }}
                      onSelect={() => {
                        setSelectedAccount(item);
                        setShowLeave(true);
                      }}
                    >
                      <Icon name={images.icon.leave} />
                      <Text paddingHorizontal={10}>Leave</Text>
                    </MenuOption>
                    }
                  </MenuOptions>
                </Menu>
              </View>
          </View>
        )}
      />
      <Modal
        title="Rename Ads Account"
        visible={showRename}
        onClose={() => setShowRename(false)}
        onRequestClose={() => setShowRename(false)}
        width="88%"
      >
        <View>
          <Text size={12} paddingVertical={12}>
            Ads Account {selectedAccount?.id || ''} - {selectedAccount?.ads_account_name || ''}
          </Text>
          <TextInput value={inputName} 
          onChangeText={(text) => setInputName(text)}
          label="Ads Account Name" />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 20,
              paddingHorizontal: 12,
            }}
          >
            <Button
              type="outline"
              text="Cancel"
              style={{ borderRadius: 48 / 2, width: 120 }}
              onPress={() => setShowRename(false)}
            />
            <Button disabled={!inputName} type="primary" text="Save" style={{ borderRadius: 48 / 2, width: 120 }} 
            onPress={() => handleRename()}
            />
          </View>
        </View>
      </Modal>
      <ModalConfirm
        visible={showLeave}
        onClose={() => setShowLeave(false)}
        title="Confirm Leave Account?"
        description={`If you confirm, you will have no access to ID${selectedAccount?.id}-${selectedAccount?.ads_account_name} anymore`}
        onPressConfirm={() => handleLeave()}
      />
      <PopupLoading loading={loadingRename || loadingLeave} />
    </>
  );
};

export default ManageAccount;
