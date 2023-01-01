import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../../../../themes/colors';
import { Text } from '../../../../components';
import { data } from './adsDetail.datasource';

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

const AdsDetailTab = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <WrapItem title="Objective" content={data.objective} />
        <WrapItem title="Audience" content={data.audience} />
        <WrapItem title="Gender" content={data.location} />
        <WrapItem title="Age" content={data.age} />
        <WrapItem title="Interest" content={data.interest} />
        <WrapItem title="Description" content={data.description} />
        <WrapItem title="Content Name" content={data.content_name} />
        <WrapItem title="Placement" content={data.placement} />
        <WrapItem title="Schedule" content={data.schedule} />
        <WrapItem title="Budget Limit" content={data.budget_limit} />
      </View>
      {data.placement_list.map((item) => (
        <View key={item.name} style={styles.card}>
          <WrapItem title={item.name} content={item.caption} />
          <Text>{item.banner}</Text>
        </View>
      ))}
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

export default AdsDetailTab;
