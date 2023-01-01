import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import images from '../../themes/images';
import { colors } from '../../themes/colors';
import Icon from '../icon/Icon';
import Text from '../text/Text';
import moment from 'moment';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker/src';

type SelectInputDateProps = {
  onChangeDate: (e: DateTimePickerEvent, date?: Date) => void;
  label?: string;
  placeholder?: string;
};

const SelectInputDate = ({ onChangeDate, label = 'Select', placeholder }: SelectInputDateProps) => {
  const [showDate, setShowDate] = useState(false);
  const [dateSelected, setDateSelected] = useState<Date>();

  const onPressItem = (event: DateTimePickerEvent, date?: Date) => {
    setDateSelected(date);
    setShowDate(false);
    onChangeDate(event, date);
  };

  return (
    <>
      {label && <Text>{label}</Text>}
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => setShowDate(!showDate)}
        style={styles.input}
      >
        <Text color={dateSelected ? colors.text : colors.grey1}>
          {dateSelected ? moment(dateSelected).format('DD-MM-YYYY') : placeholder}
        </Text>
        <Icon name={images.icon.calendar} size={20} />
      </TouchableOpacity>
      {showDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateSelected ? dateSelected : new Date()}
          mode="date"
          is24Hour={true}
          onChange={onPressItem}
        />
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
  },
  popup: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grey1,
    marginTop: 10,
  },
  item: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SelectInputDate;
