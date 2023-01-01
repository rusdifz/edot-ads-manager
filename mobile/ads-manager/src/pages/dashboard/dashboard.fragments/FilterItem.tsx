import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../themes/colors';
import { Button, Icon, SelectInputMultiple, Text, TextInput } from '../../../components';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { sortAdsMenu } from '../../../utils/static';
import images from '../../../themes/images';

const FilterItem = () => {
  const modalizeRef = React.useRef<Modalize>(null);
  const modalizeRef2 = React.useRef<Modalize>(null);

  const [sortSelected, setSortSelected] = React.useState<any>(null);

  const onPressItemSort = (item: any) => {
    setSortSelected(item);
    modalizeRef.current?.close();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={{ width: '50%' }}>
          <TextInput
            placeholder="Ads Name"
            contentContainerStyle={{ height: 40 }}
            paddingBottom={0}
          />
        </View>
        <View style={styles.wrapMoreFilter}>
          <TouchableOpacity onPress={() => modalizeRef2.current?.open()}>
            <Text color={colors.primary}>More Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => modalizeRef.current?.open()}>
            <Text color={colors.primary}>Sort By</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Portal>
        <Modalize
          ref={modalizeRef}
          snapPoint={360}
          modalHeight={360}
          useNativeDriver={true}
          handlePosition="inside"
        >
          <View style={{ padding: 12, marginTop: 12 }}>
            <View style={{ paddingBottom: 12 }}>
              <Text weight="600">Sort By</Text>
            </View>
            {sortAdsMenu.map((item) => (
              <TouchableOpacity
                key={item.code}
                activeOpacity={0.6}
                onPress={() => onPressItemSort(item)}
                style={styles.item}
              >
                <Text color={sortSelected?.code === item.code ? colors.primary : colors.text}>
                  {item.name}
                </Text>
                {sortSelected?.code === item.code && <Icon name={images.icon.checked} size={14} />}
              </TouchableOpacity>
            ))}
          </View>
        </Modalize>
        <Modalize ref={modalizeRef2} useNativeDriver={true} handlePosition="inside">
          <View style={{ padding: 12, marginTop: 12 }}>
            <View style={{ paddingBottom: 12 }}>
              <Text weight="600">More Filter</Text>
            </View>
          </View>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 12 }}>
            <SelectInputMultiple label="Ads Status" data={[{ name: 'Live', code: 'live' }]} />
            <SelectInputMultiple label="Ads Objective" data={[{ name: 'Live', code: 'live' }]} />
            <SelectInputMultiple label="Placement" data={[{ name: 'Live', code: 'live' }]} />
            <View>
              <Text weight="500" style={{ paddingBottom: 6 }}>
                Published Date
              </Text>
              <TextInput placeholder="Start Date Range" />
              <TextInput placeholder="End Date Range" />
            </View>
            <View>
              <Text weight="500" style={{ paddingBottom: 6 }}>
                End Date
              </Text>
              <TextInput placeholder="Start Date Range" />
              <TextInput placeholder="End Date Range" />
            </View>
            <View>
              <Text weight="500" style={{ paddingBottom: 6 }}>
                Total Spent
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ width: '48%' }}>
                  <TextInput placeholder="IDR 0" />
                </View>
                <Text>-</Text>
                <View style={{ width: '48%' }}>
                  <TextInput placeholder="IDR 0" />
                </View>
              </View>
            </View>
            <View>
              <Text weight="500" style={{ paddingBottom: 6 }}>
                Cost Per View
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ width: '48%' }}>
                  <TextInput placeholder="IDR 0" />
                </View>
                <Text>-</Text>
                <View style={{ width: '48%' }}>
                  <TextInput placeholder="IDR 0" />
                </View>
              </View>
            </View>
            <View>
              <Text weight="500" style={{ paddingBottom: 6 }}>
                Cost Per Click
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ width: '48%' }}>
                  <TextInput placeholder="IDR 0" />
                </View>
                <Text>-</Text>
                <View style={{ width: '48%' }}>
                  <TextInput placeholder="IDR 0" />
                </View>
              </View>
            </View>
          </ScrollView>
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
        </Modalize>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    width: '100%',
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  wrapMoreFilter: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  wrapBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 36,
    paddingHorizontal: 12,
  },
});

export default FilterItem;
