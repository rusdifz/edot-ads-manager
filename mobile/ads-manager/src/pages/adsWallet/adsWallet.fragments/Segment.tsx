import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../../../components';
import { colors } from '../../../themes/colors';

type SegmentProps = {
  onItemSelected: (e: string) => void;
};

const segmentList = ['Week', 'Month', 'Year', 'Custom'];

const Segment = ({ onItemSelected }: SegmentProps) => {
  const [itemSelected, setItemSelected] = useState('Week');

  const onPressItem = (item: string) => {
    setItemSelected(item);
    onItemSelected(item);
  };
  return (
    <View style={styles.container}>
      {segmentList.map((item, index) => (
        <TouchableOpacity
          key={item}
          onPress={() => onPressItem(item)}
          style={[
            styles.item,
            {
              borderRightWidth: index === 3 ? 0 : 1,
              backgroundColor: item === itemSelected ? colors.primary : colors.white,
              borderTopRightRadius: index === 3 ? 8 : 0,
              borderBottomRightRadius: index === 3 ? 8 : 0,
              borderTopLeftRadius: index === 0 ? 8 : 0,
              borderBottomLeftRadius: index === 0 ? 8 : 0,
            },
          ]}
        >
          <Text color={item === itemSelected ? colors.white : colors.primary}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    marginVertical: 12,
  },
  item: {
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: `${100 / 4}%`,
  },
});

export default Segment;
