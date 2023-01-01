import React, { useMemo } from 'react';
import { Dimensions, Image, Pressable, TouchableOpacity, View } from 'react-native';
import { colors } from '../../themes/colors';
import Button from '../button/Button';
import Chip from '../chip/Chip';
import Text from '../text/Text';
import headerStyles from './header.styles';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import Icon from '../icon/Icon';
import images from '../../themes/images';
import { useNavigation } from '@react-navigation/native';
import type { AppNavigationProps } from '../../navigation/AppNavigation';
import type { AdsMenuParams } from './header.interfaces';
import { adsMenu } from '../../utils/static';
import type { AdsAccountType } from '../../graphql/queries/accountSetting/accountSetting.interface';
import { useSelector, useDispatch } from 'react-redux';
import { accountSettingState, setSelectedAdsAccounts } from '../../redux/accountSettingSlice';
import { routeState, setRouteName } from '../../redux/routeSlice';

const Header = ({ parentNavigation }: any) => {
  const navigation = useNavigation<AppNavigationProps>();
  const modalizeRef = React.useRef<Modalize>(null);

  const [showShop, setShowShop] = React.useState(false);
  const { selectedAdsAccount: accountSelected, adsAccounts } = useSelector(accountSettingState);
  const { name: routeName } = useSelector(routeState);

  const dispatch = useDispatch();

  const onPressItem = (item: AdsAccountType) => {
    dispatch(setSelectedAdsAccounts(item));
    setShowShop(false);
  };

  const onPressMenu = (item: AdsMenuParams) => {
    modalizeRef.current?.close();
    dispatch(setRouteName(item.title));
    if (item.title === 'Ads Account Setting') {
      navigation.navigate('AccountSetting');
    } else if (item.title === 'Ads Wallet') {
      navigation.navigate('AdsWallet');
    } else if (item.title === 'Manage Ads') {
      navigation.navigate('ManageAds');
    } else if (item.title === 'Ads Dashboard') {
      navigation.navigate('Dashboard');
    }
  };

  const onPressManageAccount = () => {
    setShowShop(false);
    dispatch(setRouteName('Manage Ads Account'));
    navigation.navigate('ManageAccount');
  };

  const isHideHeader = useMemo(() => routeName === 'Manage Ads Account', [routeName]);

  const handleBack = () => {
    console.log(navigation.navigate('AccountSetting'));
    dispatch(setRouteName('Ads Account Setting'));
  };

  return (
    <>
      <View
        style={{
          paddingVertical: 10,
          flexDirection: 'row',
          backgroundColor: colors.blue1,
          alignItems: 'center',
        }}
      >
        <View style={{ width: 17 }} />
        <Icon
          name={images.icon.arrow_left}
          onPress={() => (isHideHeader ? handleBack() : parentNavigation?.navigate('Home'))}
        />
        <Text style={{ fontSize: 20, fontWeight: '400', marginLeft: 25, color: colors.white }}>
          {routeName}
        </Text>
      </View>
      {/* {
      !!adsAccounts?.length && !isHideHeader &&
      <> */}
      <View style={headerStyles.header}>
        <View style={{ width: '80%' }}>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => setShowShop(!showShop)}
          >
            <Text size={18} weight="600">
              {accountSelected?.ads_account_name || ''}
            </Text>
            <View style={{ paddingHorizontal: 8 }}>
              <Chip text={accountSelected?.account_type || ''} color="blue" />
            </View>
            <Icon name={images.icon.arrow_down} size={16} />
          </Pressable>
        </View>
        <View style={{ width: '20%', alignItems: 'flex-end' }}>
          <Icon name={images.icon.burger} onPress={() => modalizeRef.current?.open()} />
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          zIndex: 1,
          flex: 1,
        }}
      >
        {showShop ? (
          <Pressable
            onPress={() => setShowShop(false)}
            style={{
              height: Dimensions.get('window').height,
              width: Dimensions.get('window').width,
              paddingTop: 44,
              marginLeft: 12,
            }}
          >
            <View style={headerStyles.popupUser}>
              {adsAccounts.map((ads: AdsAccountType) => (
                <Pressable
                  key={ads.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 14,
                    justifyContent: 'space-between',
                  }}
                  onPress={() => onPressItem(ads)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      size={16}
                      weight="400"
                      color={
                        ads.ads_account_name === accountSelected?.ads_account_name
                          ? colors.primary
                          : 'grey'
                      }
                    >
                      {ads.ads_account_name}
                    </Text>
                    <View style={{ paddingHorizontal: 8 }}>
                      <Chip
                        text={ads.account_type}
                        color={
                          ads.ads_account_name === accountSelected?.ads_account_name
                            ? 'blue'
                            : 'default'
                        }
                      />
                    </View>
                  </View>
                  {ads.ads_account_name === accountSelected?.ads_account_name ? (
                    <Icon name={images.icon.checked} size={14} />
                  ) : null}
                </Pressable>
              ))}
              <View style={{ borderTopWidth: 0.8, paddingTop: 8, borderColor: colors.grey1Light }}>
                <Button
                  text="Manage Ads Account"
                  type="primary"
                  size="small"
                  style={{ borderRadius: 38 / 2 }}
                  onPress={() => onPressManageAccount()}
                />
              </View>
            </View>
          </Pressable>
        ) : null}
      </View>

      <Portal>
        <Modalize
          ref={modalizeRef}
          snapPoint={260}
          modalHeight={220}
          useNativeDriver={true}
          handlePosition="inside"
        >
          <View style={{ padding: 12, marginTop: 12 }}>
            {adsMenu.map((item) => (
              <TouchableOpacity
                key={item.title}
                activeOpacity={0.6}
                onPress={() => onPressMenu(item)}
                style={[
                  headerStyles.itemMenu,
                  {
                    backgroundColor: routeName === item.title ? colors.primaryLight : 'white',
                  },
                ]}
              >
                <Image source={item.icon} style={{ height: 20, width: 20 }} resizeMode="contain" />
                <Text
                  color={routeName === item.title ? colors.primary : colors.text}
                  paddingHorizontal={10}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modalize>
      </Portal>
      {/* </>
    } */}
    </>
  );
};

export default Header;
