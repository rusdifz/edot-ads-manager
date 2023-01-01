import React from 'react';
import { ScrollView, View } from 'react-native';
import { colors } from '../../../../themes/colors';
import {
  Button,
  RadioButton,
  SelectInput,
  SelectInputCity,
  Text,
  TextInput,
} from '../../../../components';

const CreateAudience = () => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 12 }}>
        <View style={{ paddingVertical: 12 }}>
          <TextInput label="Audience Name" />
          <SelectInputCity />
          <View>
            <Text weight="500" paddingVertical={8}>
              Gender
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <RadioButton text="All" textSize={16} isActive={false} />
              <RadioButton text="Male" textSize={16} isActive={false} />
              <RadioButton text="Female" textSize={16} isActive={false} />
            </View>
          </View>
          <View style={{ paddingVertical: 10 }}>
            <Text weight="500" paddingVertical={8}>
              Age
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: '44%' }}>
                <TextInput placeholder="Age Min" />
              </View>
              <View style={{ width: '44%' }}>
                <TextInput placeholder="Age Max" />
              </View>
            </View>
          </View>
          <SelectInput onSelect={() => null} key_label="" key_value='' label="Interests" data={[{ name: 'Select 1', code: '1' }]} />
        </View>
      </ScrollView>
      <View style={{ paddingTop: 12, alignItems: 'center' }}>
        <Button text="Save Audience" style={{ width: 160, borderRadius: 48 / 2 }} />
      </View>
    </View>
  );
};

export default CreateAudience;
