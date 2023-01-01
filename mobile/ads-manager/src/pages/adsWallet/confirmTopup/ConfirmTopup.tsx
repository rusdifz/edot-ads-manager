import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Icon, Text, TextInput } from '../../../components';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import type { AppNavigationParams, AppNavigationProps } from '../../../navigation/AppNavigation';
import { thousandSeparator } from '../../../utils/formatter';
import { colors } from '../../../themes/colors';
import images from '../../../themes/images';
import { howToPayList } from '../../../utils/static';

type ConfirmTopupRouteProps = RouteProp<AppNavigationParams, 'ConfirmTopup'>;

const ConfirmTopup = () => {
  const { params } = useRoute<ConfirmTopupRouteProps>();
  const navigation = useNavigation<AppNavigationProps>();
  return (
    <View style={styles.container}>
      <View style={styles.wrapTop}>
        <Text>Total Payment</Text>
        <Text color={colors.primary} weight="500">
          Rp {String(thousandSeparator(Number(params.amount)))}
        </Text>
      </View>
      <View style={styles.wrapBank}>
        {params.bank?.type === 'ewallet' ? (
          <View>
            <View
              style={{
                alignItems: 'center',
                padding: 12,
                borderBottomWidth: 8,
                borderColor: colors.grey1Light,
              }}
            >
              <Image
                source={params.bank?.image}
                style={{ height: 100, width: 100 }}
                resizeMode="contain"
              />
              <Text center>
                {params.bank.code === 'ovo'
                  ? 'Input your registered phone number in OVO'
                  : 'Input your Gopay PIN'}
              </Text>
              <TextInput
                placeholder=""
                style={{ textAlign: 'center', width: '100%', color: colors.primary }}
                contentContainerStyle={{
                  backgroundColor: colors.primaryLight,
                  borderWidth: 0,
                  marginTop: 8,
                }}
                secureTextEntry={params.bank.code === 'gopay' ? true : false}
                keyboardType="numeric"
              />
            </View>
            {params.bank.code === 'ovo' && (
              <View style={{ padding: 12 }}>
                <Text weight="500" size={18}>
                  How to Pay
                </Text>
                <Text paddingVertical={12}>
                  1. Open your OVO apps, go to notifications to complete your payment.
                </Text>
                <Text>
                  2. Please make payment within 60 seconds before the payment is cancelled
                  automatically.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View>
            <View style={{ borderBottomWidth: 8, borderColor: colors.grey1Light, padding: 12 }}>
              <Text>{params.bank?.name}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                }}
              >
                <Text weight="500">1288272828718827</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text color={colors.primary} paddingHorizontal={8}>
                    Copy
                  </Text>
                  <Icon name={images.icon.copy_active} size={14} />
                </View>
              </View>
            </View>
            <View style={{ padding: 12 }}>
              <Text weight="500" size={18}>
                How to Pay
              </Text>
              {howToPayList.map((item) => (
                <View style={styles.item}>
                  <Text>{item.title}</Text>
                  <Icon name={images.icon.arrow_right} size={14} />
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
      <View style={{ position: 'absolute', bottom: 0, alignItems: 'center', width: '100%' }}>
        {params.bank?.type === 'va' ? (
          <TouchableOpacity
            style={{ height: 80, justifyContent: 'center' }}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text color={colors.primary}>Back to Dashboard</Text>
          </TouchableOpacity>
        ) : (
          <Button text="Send" style={{ width: 160, borderRadius: 48 / 2 }} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey1Light,
  },
  wrapTop: {
    padding: 12,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
    marginBottom: 8,
  },
  wrapBank: {
    backgroundColor: colors.white,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    borderBottomWidth: 0.8,
    borderColor: colors.grey1Light,
  },
});

export default ConfirmTopup;
