import moment from 'moment';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../../themes/colors';
import { Icon, Text } from '../../../components';
import images from '../../../themes/images';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { listYears, thousandSeparator } from '../../../utils/formatter';
import { walletActivityList } from '../../../utils/dataDummy';

const months = moment.months().map((m) => {
  return { name: m, code: m };
});
const years = listYears(6).map((y) => {
  return { name: y, code: y };
});

const WalletActivity = () => {
  const [monthSelected, setMonthSelected] = useState('');
  const [yearSelected, setYearSelected] = useState('');

  return (
    <>
      <View style={styles.contanier}>
        <Text>Wallet Activity</Text>
        <View style={styles.wrapInput}>
          <View style={{ width: '68%' }}>
            <Menu>
              <MenuTrigger>
                <View style={styles.input}>
                  <Text>{monthSelected}</Text>
                  <Icon name={images.icon.arrow_down} size={14} />
                </View>
              </MenuTrigger>
              <MenuOptions optionsContainerStyle={{ marginTop: -30 }}>
                {months.map((m) => (
                  <MenuOption key={m.code} value={m.code} onSelect={() => setMonthSelected(m.name)}>
                    <Text paddingHorizontal={10}>{m.name}</Text>
                  </MenuOption>
                ))}
              </MenuOptions>
            </Menu>
          </View>
          <View style={{ width: '30%' }}>
            <Menu>
              <MenuTrigger>
                <View style={styles.input}>
                  <Text>{yearSelected}</Text>
                  <Icon name={images.icon.arrow_down} size={14} />
                </View>
              </MenuTrigger>
              <MenuOptions optionsContainerStyle={{ marginTop: -30 }}>
                {years.map((m) => (
                  <MenuOption
                    key={m.code}
                    value={m.code}
                    onSelect={() => setYearSelected(String(m.name))}
                  >
                    <Text paddingHorizontal={10}>{m.name}</Text>
                  </MenuOption>
                ))}
              </MenuOptions>
            </Menu>
          </View>
        </View>
      </View>
      <View style={styles.contanier}>
        {walletActivityList.map((item, index) => (
          <View key={index} style={styles.item}>
            <View>
              <Text>{item.title}</Text>
              <Text size={12} color={colors.grey1}>
                {item.via}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text color={item.amount < 0 ? 'red' : 'green'}>
                Rp{String(thousandSeparator(item.amount))}
              </Text>
              <Text size={12} color={colors.grey1}>
                Balance: Rp{String(thousandSeparator(item.balance))}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  contanier: {
    backgroundColor: colors.white,
    padding: 10,
    marginBottom: 12,
  },
  wrapInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 8,
    borderColor: colors.grey1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default WalletActivity;
