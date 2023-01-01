import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Text } from '../../components';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { colors } from '../../themes/colors';
import Member from './accountSetting.fragments/Member';
import Invitation from './accountSetting.fragments/Invitation';
import MyRequest from './accountSetting.fragments/MyRequest';
import accountSettingStyles from './accountSetting.styles';
import { useSelector } from 'react-redux';
import { accountSettingState } from '../../redux/accountSettingSlice';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const renderScene = SceneMap({
  member: () => <Member />,
  invitation: () => <Invitation />,
  myRequest: () => <MyRequest />,
});

const AccountSetting = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'member', title: 'Member' },
    { key: 'invitation', title: 'Invitation' },
    { key: 'myRequest', title: 'My Request' },
  ]);

  const { myInvitations } = useSelector(accountSettingState)

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.blue1 }}
      style={{ backgroundColor: colors.white, height: 48 }}
      labelStyle={{ fontSize: 14, color: colors.text }}
      renderLabel={renderLabel}
    />
  );

  const renderLabel = ({ route, focused }: any) => (
    <View style={accountSettingStyles.tabLabel}>
      <Text color={focused ? colors.blue1 : colors.text} size={14}>
        {route.title}
      </Text>
      {
        (route.title === 'Invitation' && myInvitations.length > 0) &&
        <>
          <Text>{' '}</Text>
          <View style={[accountSettingStyles.circleTab]}>
            <Text style={{color: Colors.white}}>{myInvitations?.length}</Text>
          </View>
        </>
      }
    </View>

  );

  return (
    <View style={accountSettingStyles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
};

export default AccountSetting;
