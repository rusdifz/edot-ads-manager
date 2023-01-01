import React, { useMemo, useState, useEffect } from 'react';
import { FlatList, Image, StyleSheet, Switch, View } from 'react-native';
import { colors } from '../../../themes/colors';
import {
  Button,
  Icon,
  Modal,
  ModalConfirm,
  SelectInput,
  Text,
  SearchInput,
  TextInput,
} from '../../../components';
import images from '../../../themes/images';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { DEFAULT_PHOTO, roleUser, roleUserType, USER_ROLE } from '../../../utils/static';
import type { AccountMemberType, AdsAccountType, InputEditUserRole, InputInviteMember, InputRemoveUser, InputSelectApprover, RequestType, ResponseEditUserRole, ResponseRemoveUser, ResponseSelectApprover } from '../../../graphql/queries/accountSetting/accountSetting.interface';
import { useSelector } from 'react-redux';
import { accountSettingState, pushNewRequest, removeMember, updateApprover, updateMemberRole } from '../../../redux/accountSettingSlice';
import { usersState } from '../../../redux/userSlice';
import { useMutation } from '@apollo/client';
import { EDIT_ROLE, INVITE_MEMBER, REMOVE_USER, SET_APPROVER } from '../../../graphql/queries/accountSetting/accountSettingMutation';
import {useDispatch} from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import PopupLoading from '../../../components/popupLoading/PopupLoading';
import { TouchableOpacity } from 'react-native'

const Member = () => {
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [showEditMember, setShowEditMember] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectInvitedUser, setSelectInvitedUser] = useState<number>(0);
  const [selectInvitedRole, setSelectInvitedRole] = useState<string>('');
  const [selectedRemoveUser, setSelectedRemoveUser] = useState<AccountMemberType>();
  const [selectedEditUser, setSelectedEditUser] = useState<AccountMemberType>();
  const [selectedEditRole, setSelectedEditRole] = useState<string>("");
  const [selectedUserApproval, setSelectedUserApproval] = useState<AccountMemberType>();

  const toast = useToast()
  
  const { selectedAdsAccount } = useSelector(accountSettingState) as { selectedAdsAccount: AdsAccountType };
  const [isApprover, setIsApprover] = useState<boolean>(selectedAdsAccount?.approver_mode || false);
  const { data: listUser } = useSelector(usersState);

  const dispatch = useDispatch()

  const [inviteMember, {loading: loadingInvite}] = useMutation<
    { inviteMember: RequestType},
    { type: InputInviteMember }
  >(INVITE_MEMBER, {
    variables: { type: { userIdInvited: selectInvitedUser, role: selectInvitedRole, adsAccountId: Number(selectedAdsAccount?.id) } }
  })

  const [removeUserFromAdsAccount, { loading: loadingRemove }] = useMutation<
    {removeUserFromAdsAccount: ResponseRemoveUser},
    {type: InputRemoveUser}
  >(REMOVE_USER, { variables: { type: { adsAccountId: selectedAdsAccount.id, userId: Number(selectedRemoveUser?.user.id) } } })

  const [editUserRole, { loading: loadingEdit }] = useMutation<
    {editUserRole: ResponseEditUserRole},
    {type: InputEditUserRole}
  >(EDIT_ROLE, { variables: { type: { adsAccountId: Number(selectedAdsAccount.id), userId: Number(selectedEditUser?.user.id), userRole: selectedEditRole  } } })

  const [selectApprover, { loading: loadingApprover }] = useMutation<
    { selectApprover: ResponseSelectApprover },
    { type: InputSelectApprover }
  >(SET_APPROVER)


  const myRole = useMemo(() => selectedAdsAccount?.ads_account_members
    ?.find((member:AccountMemberType) => member.is_me)?.role, [selectedAdsAccount])

  const userRoleInvited = useMemo(() => {
    const rolesAvailable = [];
    for (let i = 0; i < roleUser.length; i++) {
      const element = roleUser[i];
      if (element?.name === myRole) {
        break;
      }
      rolesAvailable.push(element);
    } 
    return rolesAvailable;
  }, [myRole])

  useEffect(() => {
    setIsApprover(selectedAdsAccount.approver_mode)
  }, [selectedAdsAccount])

  const handleInviteMember = async () => {
    try {
      const res = await inviteMember();
      res.data?.inviteMember && dispatch(pushNewRequest(res.data?.inviteMember))
      setShowInviteMember(false);
      toast.show("invitation successful", { placement: 'top', type: 'success' });
    } catch (err:any) {
      console.error(JSON.stringify(err))
      toast.show(err.message || "error, something is wrong", { placement: 'top', type: 'danger' });
    }
  }

  const handleRemove = async () => {
    try {
      console.log(selectedRemoveUser)
      const res = await removeUserFromAdsAccount()
      res?.data?.removeUserFromAdsAccount &&
        dispatch(removeMember(res?.data?.removeUserFromAdsAccount))
      console.log(JSON.stringify(res.data))
      toast.show("user is successfully removed", { placement: 'top', type: 'success' });
    } catch (err:any) {
      console.error(JSON.stringify(err));
      toast.show(err.message || "error remove user", { placement: 'top', type: 'danger' });
    } finally {
      setShowConfirm(false);
    }
  }

  const handleEditRole = async () => {
    try {
      const res = await editUserRole();
      res.data?.editUserRole &&
        dispatch(updateMemberRole(res.data.editUserRole))
      toast.show("role has been updated", { placement: 'top', type: 'success' });
    } catch (err:any) {
      console.error(JSON.stringify(err));
      toast.show(err.message || "error remove user", { placement: 'top', type: 'danger' });
    } finally {
      setShowEditMember(false);
    }
  }

  const handleSetApprover = async (item: AccountMemberType | undefined) => {
    try {
      const res = await selectApprover({variables: { type: { adsMemberId: item?.id || "",  isDisable: false} }})
      res.data?.selectApprover &&
        dispatch(updateApprover(res.data.selectApprover))
      toast.show("approver has been selected", { placement: 'top', type: 'success' });
    } catch (err:any) {
      console.error(JSON.stringify(err));
      toast.show(err.message || "error remove user", { placement: 'top', type: 'danger' });
    }
  }

  const handleCancelApproverMode = async () => {
    try {
      const id = selectedAdsAccount.ads_account_members.find((member: AccountMemberType) => member.is_approver)?.id
      const res = await selectApprover({variables: { type: { adsMemberId: id || "",  isDisable: true} }})
      res.data?.selectApprover &&
        dispatch(updateApprover(res.data.selectApprover))
      toast.show("approver mode has been removed", { placement: 'top', type: 'success' });
    } catch (err:any) {
      console.error(JSON.stringify(err));
      toast.show(err.message || "error remove user", { placement: 'top', type: 'danger' });
    }
  }

  const _renderItem = ({ item }: { item: AccountMemberType }) => 
    {
      return (
        <View style={styles.item}>
          {
            (!selectedAdsAccount.approver_mode && isApprover) &&
            <TouchableOpacity onPress={() =>  setSelectedUserApproval(item)}>
            <View style={styles.outerCircle}>
              <View style={selectedUserApproval?.id === item.id ?  styles.innerCircleActive : styles.innerCirclePassive} />
            </View>
            </TouchableOpacity>
          }
        <View style={{ width: '16%' }}>
          <Image source={{ uri: item.user?.profile_picture || DEFAULT_PHOTO }} style={styles.avatar} resizeMode="contain" />
        </View>
        <View style={{ width: '74%' }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ maxWidth: '60%', paddingRight: 6 }}>
              <Text numberOfLines={1}>{item?.user?.fullname}</Text>
            </View>
            <View style={{ maxWidth: '30%' }}>
              <Text numberOfLines={1} color={colors.grey1} size={14}>
                @{item?.user?.username}
              </Text>
            </View>
            {item.is_me ? (
              <View style={{ paddingLeft: 6 }}>
                <View style={styles.wrapMe}>
                  <Text size={10} color={colors.white} paddingHorizontal={8}>
                    Me
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
          <View style={{flexDirection:'row'}}>
            <View style={styles.wrapRole}>
              <Text size={10}>{item.role}</Text>
            </View>
            {
              (item.is_approver) &&
              <View style={[styles.wrapRole, { marginLeft: 3 }]}>
                <Text size={10}>Approver</Text>
              </View>
            }
          </View>
        </View>
        {(myRole === USER_ROLE.OWNER && isApprover) || (myRole === USER_ROLE.ADMIN && (item.role === USER_ROLE.ADVERTISER || item.role === USER_ROLE.ANALYST))
        || (myRole === USER_ROLE.OWNER && item.role !== USER_ROLE.OWNER)  ? (
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
               { (myRole === USER_ROLE.OWNER && item.role !== USER_ROLE.ANALYST && isApprover && !item.is_approver) &&
               <MenuOption
                  value={2}
                  style={{ flexDirection: 'row' }}
                  onSelect={() => handleSetApprover(item)}
                >
                  <Icon name={images.icon.approval} />
                  <Text paddingHorizontal={10}>Set As Approver</Text>
                </MenuOption>
                }
                { (item.role !== USER_ROLE.OWNER) &&
                  <MenuOption
                  value={2}
                  style={{ flexDirection: 'row' }}
                  onSelect={() => {
                    setSelectedEditUser(item);
                    setShowEditMember(true);
                  }}
                >
                  <Icon name={images.icon.edit} />
                  <Text paddingHorizontal={10}>Edit</Text>
                </MenuOption>
                }
                {
                  (item.role !== USER_ROLE.OWNER) &&
                  <MenuOption
                  value={2}
                  style={{ flexDirection: 'row' }}
                  onSelect={() => {
                    setSelectedRemoveUser(item);
                    setShowConfirm(true);
                  }}
                >
                  <Icon name={images.icon.remove} />
                  <Text paddingHorizontal={10}>Remove</Text>
                </MenuOption> 
                }
              </MenuOptions>
            </Menu>
          </View>
        ) : null}
      </View>
      )
    };

  return (
    <>
    {
      selectedAdsAccount &&
      <View style={styles.container}>
      <View style={styles.approver}>
        <Switch
          trackColor={{ false: colors.grey1, true: colors.blue1 }}
          ios_backgroundColor="#3e3e3e"
          onValueChange={async () => {
            if (isApprover && selectedAdsAccount.approver_mode) {
              setIsApprover(false);
              await handleCancelApproverMode();
            } else {
              setIsApprover(!isApprover)
              setSelectedUserApproval(undefined);
            }
          }}
          value={isApprover}
          disabled={myRole !== USER_ROLE.OWNER}
        />
        <Text size={16} paddingHorizontal={6}>
          Approver
        </Text>
      </View>
      {
        selectedAdsAccount.ads_account_members.length &&
        <FlatList data={selectedAdsAccount.ads_account_members} keyExtractor={(item) => item.id} renderItem={_renderItem} />
      }
      <View style={styles.wrapButton}>
        {(!selectedAdsAccount.approver_mode && isApprover) ? (
          <View style={{ flexDirection: 'row' }}>
            <Button
              type="outline"
              text="Cancel"
              style={{ borderRadius: 48 / 2, width: '44%', marginRight: 8 }}
              onPress={() => setIsApprover(false)}
            />
            <Button text="Set As Approver" style={{ borderRadius: 48 / 2, width: '44%' }} 
            disabled={!selectedUserApproval}
            onPress={() => handleSetApprover(selectedUserApproval)}
            />
          </View>
        ) : (
          <>
          {
            (myRole === USER_ROLE.OWNER || myRole === USER_ROLE.ADMIN) &&
            <Button
            text="Invite New Member"
            style={{ borderRadius: 48 / 2, width: 220 }}
            iconLeft={images.icon.plus}
            onPress={() => setShowInviteMember(true)}
          />
          }
          </>
        )}
      </View>
      <Modal
        title="Invite New Member"
        visible={showInviteMember}
        onClose={() => setShowInviteMember(false)}
        onRequestClose={() => setShowInviteMember(false)}
        width="88%"
      > 
        <View>
        <SearchInput label="Full Name" data={listUser} key_label="fullname" key_value="id"
          onSelected={(item:any) => setSelectInvitedUser(item.id)}
          />
          <SelectInput label="Role" data={userRoleInvited} key_label="name" key_value='id' 
          onSelect={(item)=> setSelectInvitedRole(item.name)} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20 }}>
            <Button
              type="outline"
              text="Cancel"
              style={{ borderRadius: 48 / 2, width: 120 }}
              onPress={() => setShowInviteMember(false)}
            />
            <Button
              disabled= {!selectInvitedUser || !selectInvitedRole}
              type="primary"
              text="Send Invitation"
              style={{ borderRadius: 48 / 2, width: 180 }}
              onPress={() => handleInviteMember()}
            />
          </View>
        </View>
      </Modal>

      <Modal
        title="Edit Role Member"
        visible={showEditMember}
        onClose={() => setShowEditMember(false)}
        onRequestClose={() => setShowEditMember(false)}
        width="88%"
      >
        <View>
         <TextInput label='username' disabled={true} value={`@${selectedEditUser?.user.username || selectedEditUser?.user?.fullname?.trim()}`} />
          <SelectInput label="Role" data={userRoleInvited} key_label="name" key_value='id' onSelect={(item:roleUserType)=> setSelectedEditRole(item.name)} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20 }}>
            <Button
              type="outline"
              text="Cancel"
              style={{ borderRadius: 48 / 2, width: 120 }}
              onPress={() => setShowEditMember(false)}
            />
            <Button
            disabled={!setSelectedEditUser || !setSelectedEditRole}
            onPress={() => handleEditRole()} 
            type="primary" text="Save" style={{ borderRadius: 48 / 2, width: 180 }} />
          </View>
        </View>
      </Modal>

      <ModalConfirm
        onPressConfirm={() => handleRemove()}
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Remove?"
        description={`If you confirm, @${selectedRemoveUser?.user.username || selectedRemoveUser?.user?.fullname.trim()} will no longer have access as Advertiser to this account.`}
      />

      <PopupLoading loading={loadingInvite || loadingRemove || loadingEdit || loadingApprover} />
    </View>
    }
    </>   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  approver: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 0.8,
    borderColor: colors.grey1Light,
    alignItems: 'center',
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 10,
    backgroundColor: colors.grey1Light,
  },
  wrapRole: {
    backgroundColor: colors.grey1Light,
    maxWidth: 80,
    borderRadius: 18 / 2,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2
  },
  wrapMe: {
    backgroundColor: colors.primary,
    borderRadius: 18 / 2,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width:30,
    height:30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.blue1,
    marginRight: 20,
    justifyContent: 'center'
  },
  innerCirclePassive: {
    width: 20,
    height:20,
    borderRadius: 10,
  },
  innerCircleActive: {
    width: 16,
    height:16,
    borderRadius: 8,
    backgroundColor: colors.blue1,
    alignSelf: 'center'
  }
});

export default Member;
