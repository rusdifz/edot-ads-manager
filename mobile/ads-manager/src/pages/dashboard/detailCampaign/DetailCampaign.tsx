import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { colors } from '../../../themes/colors';
import { Text } from '../../../components';
import AdsDetailTab from './adsDetail/AdsDetailTab';
import InsightTab from './insight/InsightTab';

const renderScene = SceneMap({
  adsDetailTab: () => <AdsDetailTab />,
  insightTab: () => <InsightTab />,
});

const DetailCampaign = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'adsDetailTab', title: 'Ads Details' },
    { key: 'insightTab', title: 'Insight' },
  ]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.blue1 }}
      style={{ backgroundColor: colors.white, height: 48 }}
      labelStyle={{ fontSize: 14, color: colors.text }}
      renderLabel={renderLabel}
    />
  );

  const renderLabel = ({ route, focused }: any) => (
    <Text color={focused ? colors.blue1 : colors.text} size={14}>
      {route.title}
    </Text>
  );

  return (
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
};

export default DetailCampaign;
