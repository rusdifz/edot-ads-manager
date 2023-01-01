import React from 'react';
import { ScrollView, View } from 'react-native';
import { colors } from '../../../../themes/colors';
import { Button, SelectInput, SelectInputMultiple, TextInput } from '../../../../components';

const CreateAdsContent = () => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 12 }}>
        <View style={{ paddingVertical: 12 }}>
          <TextInput label="Content Name" />
          <SelectInputMultiple
            label="Placement"
            data={[
              { name: 'Banner 1', code: 'b1' },
              { name: 'Banner 2', code: 'b2' },
            ]}
          />
          <View style={{ paddingBottom: 12 }}>
            <SelectInput onSelect={() => null} key_label='' key_value='' label="Placement and Content" data={[{ name: 'Select 1', code: '1' }]} />
          </View>
          <TextInput label="Captions" placeholder="Captions" multiline />
        </View>
      </ScrollView>
      <View style={{ paddingTop: 12, alignItems: 'center' }}>
        <Button text="Save Content" style={{ width: 160, borderRadius: 48 / 2 }} />
      </View>
    </View>
  );
};

export default CreateAdsContent;
