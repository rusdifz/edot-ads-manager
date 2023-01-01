import React from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { colors } from '../../../themes/colors';
import { Button, Icon, Text } from '../../../components';
import { data } from './campaign.datasource';
import type { CampaignItemParams } from './campaign.interfaces';
import images from '../../../themes/images';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import FilterAds from '../manageAds.fragments/FilterAds';
import { useNavigation } from '@react-navigation/native';
import type { AppNavigationProps } from '../../../navigation/AppNavigation';

const Campaign = () => {
  const navigation = useNavigation<AppNavigationProps>();

  const _renderItem = ({ item: props }: { item: CampaignItemParams }) => (
    <View style={styles.item}>
      <View style={{ width: '26%' }}>
        <Image source={{ uri: props.image }} style={styles.img} />
      </View>
      <View style={{ width: '74%' }}>
        <View style={{ paddingBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
          <Text>{props.name}</Text>
          <View
            style={[
              styles.status,
              {
                backgroundColor:
                  props.status === 'Live'
                    ? colors.greenLight
                    : props.status === 'Pending Approval'
                    ? colors.yellowLight
                    : props.status === 'Published'
                    ? colors.blue1Light
                    : props.status === 'Rejected'
                    ? colors.redLight
                    : colors.grey1Light,
              },
            ]}
          >
            <Text size={12}>{props.status}</Text>
          </View>
        </View>
        <View style={{ paddingBottom: 8 }}>
          <Text weight="300" size={12} color={colors.grey1}>
            Objective
          </Text>
          <Text weight="300" size={14}>
            {props.objective}
          </Text>
        </View>
        <View style={{ paddingBottom: 8 }}>
          <Text weight="300" size={12} color={colors.grey1}>
            Audience
          </Text>
          <Text weight="300" size={14}>
            {props.audience}
          </Text>
        </View>
        <View style={{ paddingBottom: 8 }}>
          <Text weight="300" size={12} color={colors.grey1}>
            Content Name
          </Text>
          <Text weight="300" size={14}>
            {props.content_name}
          </Text>
        </View>
        <View style={{ paddingBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
          <Text
            weight="400"
            size={12}
            color={colors.grey1}
            style={{ fontStyle: 'italic', paddingRight: 4 }}
          >
            Show Description
          </Text>
          <Icon name={images.icon.arrow_right_grey} size={8} />
        </View>
        <View style={{ paddingBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
          <Text weight="400" size={12} color={colors.grey1} style={{ paddingRight: 4 }}>
            Last Updated on
          </Text>
          <Text weight="400" size={12}>
            {props.updated}
          </Text>
        </View>
      </View>
      <View style={{ position: 'absolute', top: 12, right: 10 }}>
        {/* <Icon name={images.icon.menu} /> */}
        <Menu>
          <MenuTrigger>
            <Icon name={images.icon.menu} />
          </MenuTrigger>
          <MenuOptions optionsContainerStyle={{ marginTop: -30 }}>
            {props.status !== 'Rejected' && (
              <MenuOption value={2} style={{ flexDirection: 'row' }}>
                <Icon name={images.icon.copy} />
                <Text paddingHorizontal={10}>Duplicate</Text>
              </MenuOption>
            )}
            {props.status !== 'Live' &&
            props.status !== 'Pending Approval' &&
            props.status !== 'Published' ? (
              <>
                <MenuOption value={2} style={{ flexDirection: 'row' }}>
                  <Icon name={images.icon.edit} />
                  <Text paddingHorizontal={10}>Edit</Text>
                </MenuOption>
                <MenuOption value={2} style={{ flexDirection: 'row' }}>
                  <Icon name={images.icon.trash} />
                  <Text paddingHorizontal={10}>Delete</Text>
                </MenuOption>
              </>
            ) : null}
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FilterAds name="Campaign Name" />
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
          text="Create New Campaign"
          style={{ marginBottom: 0, borderRadius: 52 / 2, width: 280 }}
          onPress={() => navigation.navigate('CreateCampaign')}
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
    marginLeft: 6,
    borderRadius: 4,
  },
  wrapBtn: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});

export default Campaign;
