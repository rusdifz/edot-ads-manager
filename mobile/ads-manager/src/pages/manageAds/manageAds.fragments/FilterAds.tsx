import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import images from '../../../themes/images';
import { Button, SelectInputDate, SelectInputMultiple, Text, TextInput } from '../../../components';
import { colors } from '../../../themes/colors';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { campaignMenu, campaignStatusMenu } from '../../../utils/static';

type FilterAdsProps = {
  name: string;
};

const FilterAds = ({ name = 'Name' }: FilterAdsProps) => {
  const modalizeRef = React.useRef<Modalize>(null);
  return (
    <>
      <View style={styles.filter}>
        <View style={{ width: '76%' }}>
          <TextInput
            placeholder={name}
            iconLeft={images.icon.search}
            contentContainerStyle={{ height: 42 }}
            paddingBottom={0}
          />
        </View>
        <View style={{ width: '24%', alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={() => modalizeRef.current?.open()}>
            <Text color={colors.primary}>More Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Portal>
        <Modalize
          ref={modalizeRef}
          snapPoint={520}
          modalHeight={520}
          useNativeDriver={true}
          handlePosition="inside"
        >
          <View style={{ marginTop: 22 }}>
            <View style={styles.modalHeader}>
              <Text>More Filter</Text>
              <Text size={14} color={colors.primary}>
                Reset Filter
              </Text>
            </View>
            <View style={styles.modalContent}>
              <SelectInputMultiple data={campaignMenu} label="Campaign Objectives" />
              <SelectInputMultiple data={campaignStatusMenu} label="Campaign Status" />
              <SelectInputDate
                onChangeDate={(e) => console.log(e)}
                placeholder="Start Date Range"
              />
              <SelectInputDate onChangeDate={(e) => console.log(e)} placeholder="End Date Range" />
            </View>
            <View style={styles.wrapBtn}>
              <Button
                text="Cancel"
                style={{
                  borderRadius: 48 / 2,
                  width: 160,
                  backgroundColor: colors.primaryLight,
                  marginRight: 10,
                }}
                textStyle={{ color: colors.primary }}
                onPress={() => modalizeRef.current?.close()}
              />
              <Button
                text="Apply Filter"
                style={{ borderRadius: 48 / 2, width: 180, marginLeft: 10 }}
                onPress={() => modalizeRef.current?.close()}
              />
            </View>
          </View>
        </Modalize>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  filter: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.grey1Light,
    padding: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  modalContent: {
    borderTopWidth: 2,
    borderColor: colors.grey1Light,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  wrapBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 36,
    paddingHorizontal: 12,
  },
});

export default FilterAds;
