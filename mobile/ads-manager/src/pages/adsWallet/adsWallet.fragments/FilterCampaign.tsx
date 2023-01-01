import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Icon, Text } from '../../../components';
import images from '../../../themes/images';
import { colors } from '../../../themes/colors';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { campaignList } from '../../../utils/static';

type FilterCampaignProps = {
  onFiltered: (e: any) => void;
};

const FilterCampaign = ({ onFiltered }: FilterCampaignProps) => {
  const modalizeRef = React.useRef<Modalize>(null);

  const [itemSelected, setItemSelected] = useState<any>([]);
  const [filteredList, setFilteredList] = useState<any>([]);

  const onPressItem = (item: any) => {
    if (itemSelected.some((a: any) => a.id === item.id)) {
      setItemSelected(itemSelected.filter((a: any) => a.id !== item.id));
    } else {
      setItemSelected([...itemSelected, item]);
    }
  };

  const onApplyFilter = () => {
    setFilteredList(itemSelected);
    onFiltered(itemSelected);
    modalizeRef.current?.close();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={{ width: '88%' }}>
          <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
            {filteredList.map((fil: any) => (
              <View key={fil.id} style={[styles.chip, { backgroundColor: fil.color }]}>
                <Text color={colors.white} size={14} style={{ marginRight: 6 }}>
                  {fil.name}
                </Text>
                <Icon name={images.icon.delete_circle} size={14} />
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={{ width: '12%', alignItems: 'flex-end' }}>
          <Icon name={images.icon.filter} onPress={() => modalizeRef.current?.open()} />
        </View>
      </View>

      <Portal>
        <Modalize
          ref={modalizeRef}
          snapPoint={380}
          modalHeight={380}
          useNativeDriver={true}
          handlePosition="inside"
          HeaderComponent={() => (
            <View style={styles.modalHeader}>
              <Text size={18} weight="500">
                Campaign Objective
              </Text>
            </View>
          )}
          FooterComponent={() => (
            <View style={styles.wrapBtn}>
              <Button
                text="Cancel"
                style={{ width: '40%', borderRadius: 48 / 2, backgroundColor: colors.primaryLight }}
                textStyle={{ color: colors.primary }}
                onPress={() => modalizeRef.current?.close()}
              />
              <Button
                text="Apply Filter"
                style={{ width: '40%', borderRadius: 48 / 2 }}
                onPress={() => onApplyFilter()}
              />
            </View>
          )}
        >
          <View style={{ padding: 12, marginTop: 12 }}>
            <ScrollView>
              {campaignList.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  activeOpacity={0.6}
                  onPress={() => onPressItem(item)}
                  style={styles.item}
                >
                  <Icon
                    name={
                      itemSelected.some((a: any) => a.id === item.id)
                        ? images.icon.checkbox
                        : images.icon.uncheck
                    }
                  />
                  <Text paddingHorizontal={10}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modalize>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: colors.grey1,
    marginVertical: 10,
  },
  chip: {
    height: 30,
    borderRadius: 30 / 2,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  modalHeader: {
    paddingTop: 20,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  wrapBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

export default FilterCampaign;
