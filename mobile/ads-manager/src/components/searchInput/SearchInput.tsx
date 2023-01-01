import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import images from '../../themes/images';
import { colors } from '../../themes/colors';
import Icon from '../icon/Icon';
import Text from '../text/Text';
import TextInput from '../textInput/TextInput';
import type { TextInputProps } from '../textInput/textInput.interfaces';

interface SelectInputProps extends TextInputProps {
  data: any[];
  label: string;
  key_label: string;
  key_value: string;
  onSelected: (item:any) => void
};

const SearchInput = ({ data, label, key_label, key_value, onSelected, ...props}: SelectInputProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [itemSelected, setItemSelected] = useState<any | null>(null);
  const inputRef = useRef<any>();
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [editInput, setEditInput] = useState<string>("")

  const onPressItem = (item: any) => {
    setItemSelected(item);
    inputRef.current?.blur();
    onSelected(item);
  };

  return (
    <>
        <TextInput value={editInput} placeholder='Search' label={label} style={styles.input} ref={inputRef} onChangeText={(text) => {
            setEditInput(text);
            const filtered: any[] = []
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                if (element[key_label]?.toLowerCase()?.search(text.toLowerCase()) !== -1) {
                    filtered.push(element);
                }
                if (filtered.length === 10) {
                    break;
                }
            }
            setFilteredData(filtered);
        }}
        onFocus={() => {
            setShowPopup(true);
        }}
        onBlur={() => {
            setShowPopup(false);
            setEditInput(itemSelected ? data.find((item:any) => item.id === itemSelected[key_value])[key_label]  : "");
        }}
        {...props}
        >
        </TextInput>
      {showPopup && filteredData.length ? (
        <ScrollView keyboardShouldPersistTaps={"always"} style={styles.popup}>
            {filteredData.map((item:any) => (
                 <TouchableOpacity key={String(item[key_value])} onPress={() => onPressItem(item)} style={styles.item}>
                    <Text color={itemSelected && itemSelected[key_value] === item[key_value] ? colors.primary : colors.text}>
                        {item[key_label]}
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
    marginTop: 1,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderColor: 'transparent',
    flex: 1
  },
  popup: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grey1,
    maxHeight: 250
  },
  item: {
    flexDirection: 'row',
    height: 40,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: colors.black,
    borderWidth: 0.5,
    borderColor: colors.grey1Light
  },
});

export default SearchInput;
