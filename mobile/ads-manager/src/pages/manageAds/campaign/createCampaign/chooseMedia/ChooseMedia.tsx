import React, { useState } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';
import { colors } from '../../../../../themes/colors';
import { Button, Text } from '../../../../../components';
import chooseMediaStyles from './chooseMedia.styles';
import { mediaMenu } from '../../../../../utils/static';
import { mediaList } from '../../../../../utils/dataDummy';
import images from '../../../../../themes/images';
import ImagePicker from 'react-native-image-crop-picker';

const ChooseMedia = () => {
  const [menuSelected, setMenuSelected] = useState({ code: 'existing', name: 'Existing' });

  const onPressBrowse = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
    });
  };
  return (
    <View style={chooseMediaStyles.container}>
      <View style={chooseMediaStyles.header}>
        {mediaMenu.map((media) => (
          <Pressable
            key={media.code}
            onPress={() => setMenuSelected(media)}
            style={[
              chooseMediaStyles.headerItem,
              {
                borderBottomWidth: menuSelected.code === media.code ? 2 : 0,
                borderColor: colors.blue1,
              },
            ]}
          >
            <Text color={menuSelected.code === media.code ? colors.blue1 : colors.black}>
              {media.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {menuSelected.code === 'existing' ? (
        <FlatList
          data={mediaList}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={{ width: `${100 / 5}%`, marginBottom: 10 }}>
              <Image source={{ uri: item.image }} style={chooseMediaStyles.img} />
              <Text size={12} color={colors.grey1} center>
                {item.name}
              </Text>
            </View>
          )}
          numColumns={5}
          contentContainerStyle={{ padding: 10, alignItems: 'baseline' }}
        />
      ) : (
        <View style={{ padding: 12 }}>
          <View style={chooseMediaStyles.imgUpload}>
            <Button
              text="Browse"
              style={{ width: 100, borderRadius: 26, backgroundColor: colors.blue1 }}
              iconLeft={images.icon.media}
              onPress={() => onPressBrowse()}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default ChooseMedia;
