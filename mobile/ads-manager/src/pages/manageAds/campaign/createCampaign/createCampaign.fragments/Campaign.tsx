import React from 'react';
import { ScrollView, View } from 'react-native';
import { colors } from '../../../../../themes/colors';
import { Button, RadioButton, Text, TextInput } from '../../../../../components';
import createCampaignStyles from '../createCampaign.styles';

type CampaignProps = {
  onPressNext: () => void;
};

const Campaign = ({ onPressNext }: CampaignProps) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 12 }}>
        <TextInput label="Campaign Name" placeholder="Type Campaign Name" />
        <Text weight="500" style={{ paddingTop: 10 }}>
          Campaign Objective
        </Text>
        <View style={createCampaignStyles.wrapObjective}>
          <Text size={14} weight="500">
            Awareness
          </Text>
          <RadioButton text="Brand Awareness" isActive={false} style={{ marginVertical: 10 }} />
          <RadioButton text="React" isActive={false} style={{ marginBottom: 14 }} />
          <Text size={14} weight="500">
            Consideration
          </Text>
          <RadioButton
            text="Trafic"
            isActive={false}
            style={{ marginVertical: 10, marginBottom: 14 }}
          />
          <Text size={14} weight="500">
            Conversion
          </Text>
          <RadioButton text="Catalogue Sales" isActive={false} style={{ marginVertical: 10 }} />
          <RadioButton text="Store Trafic" isActive={false} style={{ marginBottom: 14 }} />
        </View>
        <TextInput
          label="Description"
          placeholder="Type Description"
          multiline
          style={{ height: 100 }}
        />
      </ScrollView>
      <View style={{ paddingTop: 12, alignItems: 'center' }}>
        <Button text="Next" style={{ width: 100, borderRadius: 48 / 2 }} onPress={onPressNext} />
      </View>
    </View>
  );
};

export default Campaign;
