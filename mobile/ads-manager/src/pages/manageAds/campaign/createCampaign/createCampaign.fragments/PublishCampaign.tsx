import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../../../../../themes/colors';
import { Button, RadioButton, Text, TextInput } from '../../../../../components';
import RenderHtml from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';
import type { AppNavigationProps } from '../../../../../navigation/AppNavigation';

const source = {
  html: `
<p style='text-align:center;'>
  Hello World!
</p>`,
};

const PublishCampaign = () => {
  const navigation = useNavigation<AppNavigationProps>();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.card}>
          <Text weight="500" paddingVertical={12}>
            Campaign ABC
          </Text>
          <View style={{ paddingBottom: 12 }}>
            <Text size={14} color={colors.grey1}>
              Objective
            </Text>
            <Text>Brand Awareness</Text>
          </View>
          <View style={{ paddingBottom: 12 }}>
            <Text size={14} color={colors.grey1}>
              Audience
            </Text>
            <Text>Audience 1</Text>
          </View>
          <View style={{ paddingBottom: 12 }}>
            <Text size={14} color={colors.grey1}>
              Location
            </Text>
            <Text>DKI Jakarta, Bandung, Tangerang</Text>
          </View>
          <View style={{ paddingBottom: 12 }}>
            <Text size={14} color={colors.grey1}>
              Gender
            </Text>
            <Text>All</Text>
          </View>
          <View style={{ paddingBottom: 12 }}>
            <Text size={14} color={colors.grey1}>
              Age
            </Text>
            <Text>30 - 45</Text>
          </View>
          <View style={{ paddingBottom: 12 }}>
            <Text size={14} color={colors.grey1}>
              Device
            </Text>
            <Text>Mobile</Text>
          </View>
          <View style={{ paddingBottom: 12 }}>
            <Text size={14} color={colors.grey1}>
              Content Name
            </Text>
            <Text>Banner eShop</Text>
          </View>
          <View style={{ paddingBottom: 12 }}>
            <Text size={14} color={colors.grey1}>
              Placement
            </Text>
            <Text>Banner 1080px</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={{ paddingBottom: 12 }}>
            <Text size={14} color={colors.grey1}>
              Placement 1
            </Text>
            <Text>Banner 1080px</Text>
          </View>
          <RenderHtml source={source} />
        </View>
        <View style={styles.card}>
          <View style={{ paddingBottom: 12 }}>
            <Text size={14} color={colors.grey1}>
              Placement 2
            </Text>
            <Text>Captions</Text>
          </View>
          <RenderHtml source={source} />
          <View>
            <Text weight="500" paddingVertical={12}>
              Schedule
            </Text>
            <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
              <RadioButton text="Continuous" isActive={false} />
              <RadioButton text="End Date" isActive={true} />
            </View>
            <TextInput placeholder="End Date" />
          </View>
          <View>
            <Text weight="500" paddingVertical={12}>
              Budget Limit
            </Text>
            <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
              <RadioButton text="No Limit" isActive={false} />
              <RadioButton text="Budget Limit" isActive={true} />
            </View>
            <TextInput placeholder="Budget Limit" />
          </View>
        </View>
      </ScrollView>
      <View style={{ paddingTop: 12, alignItems: 'center' }}>
        <Button
          text="Publish"
          style={{ width: 100, borderRadius: 48 / 2 }}
          onPress={() => navigation.pop()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 10,
    backgroundColor: colors.white,
    padding: 12,
  },
});

export default PublishCampaign;
