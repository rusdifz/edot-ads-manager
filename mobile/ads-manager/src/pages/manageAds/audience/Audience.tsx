import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { colors } from '../../../themes/colors';
import { Button, Icon, Text } from '../../../components';
import { data } from './audience.datasource';
import type { AudienceItemParams } from './audience.interfaces';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import images from '../../../themes/images';
import FilterAds from '../manageAds.fragments/FilterAds';
import type { AppNavigationProps } from '../../../navigation/AppNavigation';
import { useNavigation } from '@react-navigation/native';

const Audience = () => {
  const navigation = useNavigation<AppNavigationProps>();

  const _renderItem = ({ item: props }: { item: AudienceItemParams }) => (
    <View style={styles.item}>
      <Text>{props.name}</Text>
      <View style={{ paddingVertical: 8 }}>
        <Text weight="300" size={12} color={colors.grey1}>
          Location
        </Text>
        <Text weight="300" size={14}>
          {props.location}
        </Text>
      </View>
      <View style={{ paddingBottom: 8 }}>
        <Text weight="300" size={12} color={colors.grey1}>
          Gender
        </Text>
        <Text weight="300" size={14}>
          {props.gender}
        </Text>
      </View>
      <View style={{ paddingBottom: 8 }}>
        <Text weight="300" size={12} color={colors.grey1}>
          Age
        </Text>
        <Text weight="300" size={14}>
          {props.age}
        </Text>
      </View>
      <View style={{ paddingBottom: 8 }}>
        <Text weight="300" size={12} color={colors.grey1}>
          Interest
        </Text>
        <Text weight="300" size={14}>
          {props.interest}
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
                    : status.name === 'Interest'
                    ? colors.redLight
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
      <View style={{ paddingBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
        <Text weight="400" size={12} color={colors.grey1} style={{ paddingRight: 4 }}>
          Last Updated on
        </Text>
        <Text weight="400" size={12}>
          {props.updated}
        </Text>
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
      <FilterAds name="Audience Name" />
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
          text="Create New Audience"
          style={{ marginBottom: 0, borderRadius: 52 / 2, width: 280 }}
          onPress={() => navigation.navigate('CreateAudience')}
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
    borderBottomWidth: 1,
    borderColor: colors.grey1Light,
    padding: 12,
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

export default Audience;
