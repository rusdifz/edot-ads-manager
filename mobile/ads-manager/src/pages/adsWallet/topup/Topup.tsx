import React, { useState } from 'react';
import { Image, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../themes/colors';
import { Button, Icon, Text } from '../../../components';
import topupStyles from './topup.styles';
import { bankList } from '../../../utils/static';
import images from '../../../themes/images';
import { useNavigation } from '@react-navigation/native';
import type { AppNavigationProps } from 'src/navigation/AppNavigation';
import type { BankParams } from './topup.interfaces';

const Topup = () => {
  const navigation = useNavigation<AppNavigationProps>();
  const [amount, setAmount] = useState('');
  const [paySelected, setPaySelected] = useState<BankParams | null>(null);

  const onPressPayMethod = (item: BankParams) => {
    setPaySelected(item);
  };

  return (
    <View style={topupStyles.container}>
      <View style={topupStyles.cardInput}>
        <Text size={14} weight="600" paddingHorizontal={12}>
          Input Amount
        </Text>
        <View style={topupStyles.wrapInput}>
          <Text color={colors.primary} size={16}>
            Rp
          </Text>
          <TextInput
            placeholder="0"
            style={topupStyles.input}
            value={amount}
            onChangeText={(txt) => setAmount(txt)}
            keyboardType="numeric"
          />
        </View>
        <Text
          size={12}
          color={colors.primary}
          style={{ textAlign: 'right' }}
          weight="300"
          paddingHorizontal={12}
        >
          Min. Top Up Amount Rp 10.000
        </Text>
      </View>
      <ScrollView contentContainerStyle={topupStyles.list}>
        <Text size={18} weight="500">
          Select Payment Method
        </Text>
        <Text paddingVertical={12} weight="400">
          Virtual Account
        </Text>
        {bankList
          .filter((a) => a.type === 'va')
          .map((item) => (
            <TouchableOpacity
              activeOpacity={0.6}
              style={topupStyles.item}
              onPress={() => onPressPayMethod(item)}
            >
              <View style={{ width: '8%' }}>
                <Icon
                  name={
                    paySelected?.code === item.code ? images.icon.radio_active : images.icon.radio
                  }
                />
              </View>
              <View style={{ width: '22%' }}>
                <Image source={item.image} resizeMode="contain" style={{ height: 60, width: 60 }} />
              </View>
              <View style={{ width: '70%' }}>
                <Text>{item.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        <Text paddingVertical={12} weight="400">
          Instant Payment
        </Text>
        {bankList
          .filter((a) => a.type === 'ewallet')
          .map((item) => (
            <TouchableOpacity
              activeOpacity={0.6}
              style={topupStyles.item}
              onPress={() => onPressPayMethod(item)}
            >
              <View style={{ width: '8%' }}>
                <Icon
                  name={
                    paySelected?.code === item.code ? images.icon.radio_active : images.icon.radio
                  }
                />
              </View>
              <View style={{ width: '22%' }}>
                <Image source={item.image} resizeMode="contain" style={{ height: 60, width: 60 }} />
              </View>
              <View style={{ width: '70%' }}>
                <Text>{item.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
      <View style={topupStyles.wrapBtn}>
        <Button
          text="Pay Now"
          style={{ borderRadius: 48 / 2, width: 160 }}
          disabled={!paySelected || Number(amount) < 10000}
          onPress={() => navigation.navigate('ConfirmTopup', { amount, bank: paySelected })}
        />
      </View>
    </View>
  );
};

export default Topup;
