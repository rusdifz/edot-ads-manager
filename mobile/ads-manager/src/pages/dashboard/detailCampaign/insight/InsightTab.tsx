import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../../themes/colors';
import { Chip, Text } from '../../../../components';
import { data, filterMenu } from './insight.datasource';

const WrapItem = ({ title, content }: { title: string; content: string }) => {
  return (
    <View style={styles.item}>
      <Text color={colors.grey1} size={14}>
        {title}
      </Text>
      <Text>{content}</Text>
    </View>
  );
};

const InsightTab = () => {
  const [filterSelected, setFilterSelected] = useState('1');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.card, { flexDirection: 'row', flexWrap: 'wrap', display: 'flex' }]}>
        {filterMenu.map((menu) => (
          <TouchableOpacity
            onPress={() => setFilterSelected(menu.code)}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            <Chip text={menu.name} color={filterSelected === menu.code ? 'primary' : 'default'} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.card}>
        <WrapItem title="Total Durations" content={data.total_duration} />
        <WrapItem title="Total Clicks" content={data.total_click} />
        <WrapItem title="Cost Per Click" content={data.cost_per_click} />
        <WrapItem title="Total Convertion" content={data.total_convertion} />
        <WrapItem title="Cost Per Convertion" content={data.cost_per_convertion} />
        <WrapItem title="Corvertion Rate" content={data.convertion_rate} />
        <WrapItem title="Click Rate" content={data.click_rate} />
        <WrapItem title="Bounce Rate" content={data.bounce_rate} />
        <WrapItem title="Total View" content={data.total_view} />
        <WrapItem title="Cost Per View" content={data.cost_per_view} />
        <WrapItem title="Total Spent" content={data.total_spent} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  card: {
    padding: 12,
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  item: {
    paddingBottom: 10,
  },
});

export default InsightTab;
