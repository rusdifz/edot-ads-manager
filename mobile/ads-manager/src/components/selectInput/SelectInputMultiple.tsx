import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import images from '../../themes/images';
import { colors } from '../../themes/colors';
import Icon from '../icon/Icon';
import Text from '../text/Text';
import Chip from '../chip/Chip';

type DataParams = {
  name: string;
  code: string;
};

type SelectInputMultipleProps = {
  data: DataParams[];
  label: string;
};

const SelectInputMultiple = ({ data, label = 'Select' }: SelectInputMultipleProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [itemSelected, setItemSelected] = useState<DataParams[]>([]);

  const onPressItem = (item: DataParams) => {
    if (item.code === 'all') {
      setItemSelected(itemSelected.some((a) => a.code === item.code) ? [] : data);
    } else if (itemSelected.some((a) => a.code === item.code)) {
      setItemSelected(itemSelected.filter((b) => b.code !== item.code));
    } else {
      const mergeData = [...itemSelected, item];
      setItemSelected(mergeData);
    }

    setShowPopup(false);
  };

  return (
    <>
      <Text weight="500">{label}</Text>
      <Pressable onPress={() => setShowPopup(!showPopup)} style={styles.input}>
        <ScrollView style={{ width: '88%' }} contentContainerStyle={{ flexGrow: 1 }} horizontal>
          {itemSelected.length !== 0 ? (
            itemSelected.map((item) => (
              <Chip
                key={item.code}
                text={item.name}
                iconRight={
                  <Icon
                    name={images.icon.delete_grey}
                    size={12}
                    onPress={() => Alert.alert('okw')}
                  />
                }
                style={{ marginRight: 8 }}
              />
            ))
          ) : (
            <Text color={colors.grey1}>{`Select ${label}`}</Text>
          )}
        </ScrollView>
        <View style={{ width: '12%', alignItems: 'flex-end' }}>
          <Icon name={images.icon.arrow_down} size={14} />
        </View>
      </Pressable>
      {showPopup && (
        <View style={styles.popup}>
          {data.map((item) => (
            <TouchableOpacity key={item.code} onPress={() => onPressItem(item)} style={styles.item}>
              <Icon
                name={
                  itemSelected.some((a) => a.code === item.code)
                    ? images.icon.checkbox
                    : images.icon.uncheck
                }
                size={14}
              />
              <Text paddingHorizontal={8}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 10,
  },
  popup: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grey1,
  },
  item: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
});

export default SelectInputMultiple;
