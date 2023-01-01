import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import images from '../../themes/images';
import { colors } from '../../themes/colors';
import Icon from '../icon/Icon';
import Text from '../text/Text';

interface SelectInputProps {
  data: any[];
  label: string;
  onSelect: ((item: any) => void) | undefined;
  key_value: string | undefined;
  key_label: string | undefined;
}
const SelectInput = ({
  data,
  label = 'Select',
  key_value = 'code',
  key_label = 'name',
  onSelect,
}: SelectInputProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [itemSelected, setItemSelected] = useState<any | null>(null);

  const onPressItem = (item: any) => {
    setItemSelected(item);
    setShowPopup(false);
    onSelect && onSelect(item);
  };

  return (
    <>
      <Text weight="500">{label}</Text>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => setShowPopup(!showPopup)}
        style={styles.input}
      >
        <Text color={itemSelected ? colors.text : colors.grey1}>
          {itemSelected ? itemSelected[key_label] : 'Select'}
        </Text>
        <Icon name={images.icon.arrow_down} size={14} />
      </TouchableOpacity>
      {showPopup ? (
        <ScrollView keyboardShouldPersistTaps={'always'} style={styles.popup}>
          {data.map((item) => (
            <TouchableOpacity key={item.code} onPress={() => onPressItem(item)} style={styles.item}>
              <Text color={itemSelected?.code === item.code ? colors.primary : colors.text}>
                {item.name}
              </Text>
              {itemSelected && itemSelected[key_value] === item[key_value] ? (
                <Icon name={images.icon.checked} size={14} />
              ) : null}
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : null}
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
  },
  popup: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grey1,
    marginTop: 10,
    maxHeight: 250,
  },
  item: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SelectInput;
