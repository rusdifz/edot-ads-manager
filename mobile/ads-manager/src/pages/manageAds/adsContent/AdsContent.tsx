import React from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { colors } from '../../../themes/colors';
import { Button, Icon, Text } from '../../../components';
import type { AdsContentItemParams } from './adsContent.interfaces';
import { data } from './adsContent.datasource';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import images from '../../../themes/images';
import FilterAds from '../manageAds.fragments/FilterAds';
import type { AppNavigationProps } from '../../../navigation/AppNavigation';
import { useNavigation } from '@react-navigation/native';

const AdsContent = () => {
  const navigation = useNavigation<AppNavigationProps>();

  const _renderItem = ({ item: props }: { item: AdsContentItemParams }) => (
    <View style={styles.item}>
      <View style={{ width: '26%' }}>
        <Image source={{ uri: props.image }} style={styles.img} />
      </View>
      <View style={{ width: '74%' }}>
        <Text>{props.name}</Text>
        <View style={{ paddingVertical: 8 }}>
          <Text weight="300" size={12} color={colors.grey1}>
            Placement
          </Text>
          <Text weight="300" size={14}>
            {props.placement}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', paddingBottom: 8 }}>
          {props.status.map((status) => (
            <View
              style={[
                styles.status,
                {
                  backgroundColor:
                    status.name === 'Live'
                      ? colors.greenLight
                      : status.name === 'Published'
                      ? colors.blue1Light
                      : colors.grey1Light,
                },
              ]}
            >
              <Text size={12} style={{ paddingRight: 4 }}>
                {status.count}
              </Text>
              <Text size={12}>{status.name}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={{ position: 'absolute', top: 12, right: 10 }}>
        <Menu>
          <MenuTrigger>
            <Icon name={images.icon.menu} />
          </MenuTrigger>
          <MenuOptions optionsContainerStyle={{ marginTop: -30 }}>
            <MenuOption value={2} style={{ flexDirection: 'row' }}>
              <Icon name={images.icon.edit} />
              <Text paddingHorizontal={10}>Edit</Text>
            </MenuOption>
            <MenuOption value={2} style={{ flexDirection: 'row' }}>
              <Icon name={images.icon.copy} />
              <Text paddingHorizontal={10}>Duplicate</Text>
            </MenuOption>
            <MenuOption value={2} style={{ flexDirection: 'row' }}>
              <Icon name={images.icon.trash} />
              <Text paddingHorizontal={10}>Delete</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <FilterAds name="Ads Content Name" />
      <FlatList
        data={data}
        keyExtractor={(item) => item.name}
        renderItem={_renderItem}
        contentContainerStyle={styles.list}
      />
      <View style={styles.wrapBtn}>
        <Button
          size="normal"
          iconLeft={images.icon.plus}
          text="Create New Content"
          style={{ marginBottom: 0, borderRadius: 52 / 2, width: 280 }}
          onPress={() => navigation.navigate('CreateAdsContent')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.grey1Light,
    padding: 12,
  },
  img: {
    height: 80,
    width: 80,
    backgroundColor: colors.grey1,
    borderRadius: 8,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginRight: 12,
    borderRadius: 12,
  },
  wrapBtn: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});

export default AdsContent;
