import React from 'react';
import { ScrollView, View } from 'react-native';
import { colors } from '../../themes/colors';
import { Button, SelectInputDate, Text } from '../../components';
import adsWalletStyles from './adsWallet.styles';
import images from '../../themes/images';
import Segment from './adsWallet.fragments/Segment';
import SpendingChart from './adsWallet.fragments/SpendingChart';
import { useNavigation } from '@react-navigation/native';
import type { AppNavigationProps } from '../../navigation/AppNavigation';
import WalletActivity from './adsWallet.fragments/WalletActivity';

const AdsWallet = () => {
  const navigation = useNavigation<AppNavigationProps>();

  return (
    <ScrollView>
      <View style={adsWalletStyles.cardBalance}>
        <Text color={colors.white} size={14} style={{ paddingBottom: 10 }}>
          Balance
        </Text>
        <View style={adsWalletStyles.wrapBalance}>
          <View style={{ width: '72%' }}>
            <Text color={colors.primary} size={16}>
              Rp876.000.000.000
            </Text>
          </View>
          <View style={{ width: '28%' }}>
            <Button
              size="small"
              iconLeft={images.icon.plus}
              text="Top Up"
              style={{ marginBottom: 0, borderRadius: 38 / 2 }}
              onPress={() => navigation.navigate('Topup')}
            />
          </View>
        </View>
      </View>
      <View style={{ padding: 12, backgroundColor: colors.white }}>
        <Text size={16} weight="600">
          Spending Analytic
        </Text>
        <Segment onItemSelected={(item) => console.log(item)} />
        <SelectInputDate label="Date" onChangeDate={(e) => console.log(e)} />
        <SpendingChart />
      </View>
      <WalletActivity />
    </ScrollView>
  );
};

export default AdsWallet;
