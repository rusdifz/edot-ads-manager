// @ts-nocheck
import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { chartData, chartData2 } from '../../../utils/dataDummy';
import { Text } from '../../../components';
import { colors } from '../../../themes/colors';
import FilterCampaign from './FilterCampaign';

const SpendingChart = () => {
  const [filterSelected, setFilterSelected] = useState([]);

  return (
    <View>
      <FilterCampaign onFiltered={(e) => setFilterSelected(e)} />
      <Text center size={14}>
        Total Spending
      </Text>
      <Text center weight="600" style={{ paddingBottom: 12 }}>
        Rp8.200.000
      </Text>
      <LineChart
        data={filterSelected.some((a: any) => a.id === '2') ? chartData : []}
        data2={filterSelected.some((a: any) => a.id === '3') ? chartData2 : []}
        color1={colors.purple}
        color2={colors.yellow}
        dataPointsColor1={colors.purple}
        dataPointsColor2={colors.yellow}
        // isAnimated
        showVerticalLines={false}
        hideYAxisText
        curved
        initialSpacing={20}
        hideRules
        dataPointLabelShiftY={100}
        yAxisLabelWidth={1}
        spacing={50}
        width={Dimensions.get('window').width - 40}
        xAxisColor={colors.grey1}
        yAxisColor={colors.grey1}
      />
    </View>
  );
};

export default SpendingChart;
