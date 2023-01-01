import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import images from '../../../../../themes/images';
import {
  Button,
  Icon,
  SelectInput,
  SelectInputMultiple,
  Text,
  TextInput,
} from '../../../../../components';
import RenderHtml from 'react-native-render-html';
import { colors } from '../../../../../themes/colors';
import { useNavigation } from '@react-navigation/native';
import type { AppNavigationProps } from '../../../../../navigation/AppNavigation';

type ContentProps = {
  onPressNext: () => void;
};

const source = {
  html: `
<p style='text-align:center;'>
  Hello World!
</p>`,
};

const Content = ({ onPressNext }: ContentProps) => {
  const { width } = useWindowDimensions();
  const [isNew, setIsNew] = useState(false);
  const navigation = useNavigation<AppNavigationProps>();

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 12 }}>
        <SelectInput key_label='' key_value='' onSelect={() => null} label="Content" data={[{ code: '1', name: 'ABC' }]} />
        <TouchableOpacity
          onPress={() => setIsNew(!isNew)}
          style={{ flexDirection: 'row', paddingTop: 14, alignItems: 'center' }}
        >
          <Icon name={isNew ? images.icon.checkbox : images.icon.uncheck} />
          <Text weight="500" paddingHorizontal={10}>
            Add New Content
          </Text>
        </TouchableOpacity>
        {isNew && (
          <View style={{ paddingVertical: 12 }}>
            <TextInput label="Audience Name" />
            <SelectInputMultiple
              label="Placement"
              data={[
                { name: 'Banner 1080px', code: '1' },
                { name: 'Banner 1920px', code: '2' },
              ]}
            />
            <SelectInput key_label='' key_value='' onSelect={() => null}
              label="Placement and Content"
              data={[{ name: 'eShop Category Banner', code: '1' }]}
            />
            <View style={{ flexDirection: 'row', paddingVertical: 12 }}>
              <View style={{ paddingTop: 2, paddingRight: 10 }}>
                <Icon name={images.icon.info} />
              </View>
              <Text weight="300" size={14}>
                Placed in the homepage, size 1080 x 240 px, extension .jpg / .jpeg / .png
              </Text>
            </View>
            <View style={styles.wrapMedia}>
              <RenderHtml contentWidth={width} source={source} />
            </View>
            <Pressable onPress={() => navigation.navigate('ChooseMedia')} style={styles.wrapMedia}>
              <Icon name={images.icon.media} />
              <Text color={colors.grey1}>Choose Media</Text>
            </Pressable>
            <TextInput label="Link" />
            <TextInput label="Category Name" />
            <TextInput label="Cost per 100 views" />
          </View>
        )}
      </ScrollView>
      <View style={{ paddingTop: 12, alignItems: 'center' }}>
        <Button text="Next" style={{ width: 100, borderRadius: 48 / 2 }} onPress={onPressNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapMedia: {
    padding: 10,
    borderRadius: 6,
    borderColor: colors.grey1Light,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default Content;
