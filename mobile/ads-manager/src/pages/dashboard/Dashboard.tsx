import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { colors } from '../../themes/colors';
import { Icon, Text } from '../../components';
import { dummyData } from './dashboard.datasource';
import dashboardStyles from './dashboard.styles';
import images from '../../themes/images';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import FilterItem from './dashboard.fragments/FilterItem';
import { useNavigation } from '@react-navigation/native';
import type { AppNavigationProps } from '../../navigation/AppNavigation';

const Dashboard = () => {
  const navigation = useNavigation<AppNavigationProps>();
  const [showDesc, setShowDesc] = useState<any>({});

  return (
    <View style={{ flex: 1 }}>
      <View>
      </View>
      <FilterItem />
      <FlatList
        data={dummyData}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={dashboardStyles.container}
        renderItem={({ item }) => (
          <View style={dashboardStyles.item}>
            <View style={{ paddingBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
              <Text weight="500">{item.title}</Text>
              <View
                style={[
                  dashboardStyles.status,
                  {
                    backgroundColor:
                      item.status === 'Live'
                        ? colors.greenLight
                        : item.status === 'Pending Approval' ||
                          item.status === 'Waiting for your approval'
                        ? colors.yellowLight
                        : item.status === 'Published'
                        ? colors.blue1Light
                        : item.status === 'Rejected'
                        ? colors.redLight
                        : colors.grey1Light,
                  },
                ]}
              >
                <Text size={12}>{item.status}</Text>
              </View>
            </View>
            <View style={{ paddingBottom: 8 }}>
              <Text size={12} color={colors.grey1}>
                Objective
              </Text>
              <Text size={14}>{item.objective}</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingBottom: 8 }}>
              <View style={{ width: '50%' }}>
                <Text size={12} color={colors.grey1}>
                  Published Date
                </Text>
                <Text size={14}>{item.date_start}</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text size={12} color={colors.grey1}>
                  End Date
                </Text>
                <Text size={14}>{item.date_end}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', paddingBottom: 8 }}>
              <View style={{ width: '50%' }}>
                <Text size={12} color={colors.grey1}>
                  Budget Limit
                </Text>
                <Text size={14}>{item.budget_limit}</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text size={12} color={colors.grey1}>
                  Total Durations
                </Text>
                <Text size={14}>{item.total_duration}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', paddingBottom: 8 }}>
              <View style={{ width: '50%' }}>
                <Text size={12} color={colors.grey1}>
                  Total Clicks
                </Text>
                <Text size={14}>{item.total_click}</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text size={12} color={colors.grey1}>
                  Total Conversions
                </Text>
                <Text size={14}>{item.total_conversion}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', paddingBottom: 8 }}>
              <View style={{ width: '50%' }}>
                <Text size={12} color={colors.grey1}>
                  Total View
                </Text>
                <Text size={14}>{item.total_view}</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text size={12} color={colors.grey1}>
                  Total Spent
                </Text>
                <Text size={14}>{item.total_spent}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => setShowDesc({ [item.id]: showDesc[item.id] ? 0 : item.id })}
            >
              <Text size={12} color={colors.grey1} style={{ fontStyle: 'italic' }}>
                {showDesc[item.id] ? 'Hide Descriptions' : 'Show Descriptions'}
              </Text>
              <Icon name={images.icon.arrow_right_grey} size={10} />
            </TouchableOpacity>
            {showDesc[item.id] ? (
              <Text size={14} style={{ fontStyle: 'italic' }}>
                {item.description}
              </Text>
            ) : null}
            <View style={{ position: 'absolute', top: 12, right: 10 }}>
              <Menu>
                <MenuTrigger>
                  <Icon name={images.icon.menu} />
                </MenuTrigger>
                <MenuOptions optionsContainerStyle={{ marginTop: -30 }}>
                  {item.status === 'Live' && (
                    <MenuOption value={2} style={dashboardStyles.wrapItemMenu}>
                      <Icon name={images.icon.pause} />
                      <Text paddingHorizontal={10}>Pause Ads</Text>
                    </MenuOption>
                  )}
                  {item.status === 'Rejected' && (
                    <MenuOption value={2} style={dashboardStyles.wrapItemMenu}>
                      <Icon name={images.icon.edit} />
                      <Text paddingHorizontal={10}>Edit Ads</Text>
                    </MenuOption>
                  )}
                  {item.status === 'Paused' && (
                    <MenuOption value={2} style={dashboardStyles.wrapItemMenu}>
                      <Icon name={images.icon.play} />
                      <Text paddingHorizontal={10}>Start Ads</Text>
                    </MenuOption>
                  )}
                  {item.status === 'Pending Approval' && (
                    <MenuOption value={2} style={dashboardStyles.wrapItemMenu}>
                      <Icon name={images.icon.check_grey} />
                      <Text paddingHorizontal={10}>Approve Ads</Text>
                    </MenuOption>
                  )}
                  <MenuOption
                    value={2}
                    style={dashboardStyles.wrapItemMenu}
                    onSelect={() => navigation.navigate('DetailCampaign')}
                  >
                    <Icon name={images.icon.detail} />
                    <Text paddingHorizontal={10}>Details</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Dashboard;
