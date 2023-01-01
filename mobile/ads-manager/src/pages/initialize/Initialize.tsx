import React, { useEffect } from 'react';
import { GET_ALL_USER, GET_MY_ACCOUNT_INVITATION, GET_MY_ACCOUNT_REQUEST, GET_MY_ADS_ACCOUNT} from '../../graphql/queries/accountSetting/accountSettingQuery';
import type { AllUserType, MyAdsAccountType, MyInvitationType, MyRequestType } from '../../graphql/queries/accountSetting/accountSetting.interface';
import { useQuery } from '@apollo/client';
import { View, ActivityIndicator, Text } from 'react-native';
import styles from './initialize.styles'
import { colors } from '../../themes/colors';
import { useDispatch } from 'react-redux'
import { setAdsAccounts, setMyInvitations, setMyRequests, setSelectedAdsAccounts } from '../../redux/accountSettingSlice';
import { setUserList } from '../../redux/userSlice';
import { setRouteName } from '../../redux/routeSlice';

const Initialize = ({navigation} : any) => {
    const {loading: loadingAccount, error: errorAccount, data: dataAccount} = useQuery<MyAdsAccountType>(GET_MY_ADS_ACCOUNT, {fetchPolicy: 'no-cache'})
    const {loading: loadingInvitation, error: errorInvitation, data: dataInvitation} = useQuery<MyInvitationType>(GET_MY_ACCOUNT_INVITATION, {fetchPolicy:'no-cache'})
    const {loading: loadingRequest, error: errorRequest, data: dataRequest} = useQuery<MyRequestType>(GET_MY_ACCOUNT_REQUEST, {fetchPolicy: 'no-cache'})
    const {loading: loadingUser, error: erroruser, data: dataUser} = useQuery<AllUserType>(GET_ALL_USER, {fetchPolicy:'no-cache'})
    const dispatch = useDispatch()
    useEffect(()=> {
      if (dataAccount && dataInvitation && dataRequest && dataUser
        && !loadingAccount && !loadingInvitation && !loadingRequest && !loadingUser
        ) {
        const users = dataUser.listUser
        users.sort((a,b) => a.username <= b.username ? -1 : 1)
        dispatch(setAdsAccounts(dataAccount.myAdsAccount));
        dispatch(setSelectedAdsAccounts(dataAccount.myAdsAccount[0]));
        dispatch(setMyInvitations(dataInvitation.myAccountInvitation));
        dispatch(setMyRequests(dataRequest.myAccountRequest));
        dispatch(setUserList(users));
        dispatch(setRouteName("Ads Dashboard"));
        navigation.navigate("Dashboard");
      }
    }, [loadingAccount, loadingInvitation, loadingRequest, loadingUser, dataAccount, dataInvitation, dataRequest, dataUser, dispatch])
    
  return (
    <View style={[styles.container, styles.horizontal]}>
        {loadingAccount || loadingInvitation || loadingRequest || loadingUser ?
        <ActivityIndicator size="large" color={colors.primary} />
        : errorAccount || errorInvitation || errorRequest || erroruser ?
        <Text>{`${errorAccount || ''} ${errorInvitation?.message || ''} ${errorRequest?.message || ''} || ${erroruser?.message || ''} `}</Text>
        :
        <></>
        }
    </View>
  );
};

export default Initialize;
