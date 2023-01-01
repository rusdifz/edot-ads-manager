import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import images from '../../../../../themes/images';
import {
  Button,
  Icon,
  RadioButton,
  SelectInput,
  SelectInputCity,
  SelectInputLocation,
  Text,
  TextInput,
} from '../../../../../components';
import { colors } from '../../../../../themes/colors';

type TargetAudienceProps = {
  onPressNext: () => void;
};
const TargetAudience = ({ onPressNext }: TargetAudienceProps) => {
  const [isNew, setIsNew] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 12 }}>
        <SelectInput
          key_label=""
          key_value=""
          onSelect={() => null}
          label="Audience"
          data={[{ code: '1', name: 'ABC' }]}
        />
        <TouchableOpacity
          onPress={() => setIsNew(!isNew)}
          style={{ flexDirection: 'row', paddingTop: 14, alignItems: 'center' }}
        >
          <Icon name={isNew ? images.icon.checkbox : images.icon.uncheck} />
          <Text weight="500" paddingHorizontal={10}>
            Add New Audience
          </Text>
        </TouchableOpacity>
        {isNew && (
          <View style={{ paddingVertical: 12 }}>
            <TextInput label="Audience Name" />
            <SelectInputCity />
            <SelectInputLocation />
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
            <SelectInput
              key_label=""
              key_value=""
              onSelect={() => null}
              label="Interests"
              data={[{ name: 'Select 1', code: '1' }]}
            />
          </View>
        )}
      </ScrollView>
      <View style={{ paddingTop: 12, alignItems: 'center' }}>
        <Button text="Next" style={{ width: 100, borderRadius: 48 / 2 }} onPress={onPressNext} />
      </View>
    </View>
  );
};

export default TargetAudience;
