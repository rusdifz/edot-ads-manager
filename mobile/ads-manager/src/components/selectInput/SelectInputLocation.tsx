import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { colors } from '../../themes/colors';
import images from '../../themes/images';
import Chip from '../chip/Chip';
import Icon from '../icon/Icon';
import Text from '../text/Text';
import TextInput from '../textInput/TextInput';

const SelectInputLocation = () => {
  const [showModal, setShowModal] = useState(false);
  const [radius, setRadius] = useState(500);
  const [coordinate, setCoordinate] = useState({
    latitude: -6.2,
    longitude: 106.816666,
  });

  useEffect(() => {
    console.log('oke');
  }, []);

  return (
    <>
      <Text weight="500" style={{ paddingTop: 8 }}>
        Location
      </Text>
      <Pressable onPress={() => setShowModal(!showModal)} style={styles.input}>
        <View style={{ width: '88%' }}>
          <Chip
            text={`${coordinate.latitude},${coordinate.longitude}`}
            style={{ alignSelf: 'baseline' }}
          />
          <Chip text={`Radius: ${radius}`} style={{ alignSelf: 'baseline' }} />
        </View>
        <View style={{ width: '12%', alignItems: 'flex-end' }}>
          <Icon name={images.icon.arrow_down} size={14} />
        </View>
      </Pressable>

      <Modal visible={showModal}>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text weight="500" size={18} color={colors.white}>
              Select Location
            </Text>
            <Icon name={images.icon.close} onPress={() => setShowModal(false)} />
          </View>
          <View style={{ paddingHorizontal: 12 }}>
            <TextInput
              label="Coordinate"
              disabled
              value={`${coordinate.latitude},${coordinate.longitude}`}
            />
            <TextInput
              label="Radius"
              value={String(radius)}
              onChangeText={(txt) => setRadius(Number(txt))}
            />
          </View>
          <MapView
            style={styles.map}
            provider="google"
            initialRegion={{ ...coordinate, latitudeDelta: 0.015, longitudeDelta: 0.0121 }}
            onMapLoaded={(e) => console.log(e)}
          >
            <Circle
              center={coordinate}
              radius={radius}
              fillColor="rgba(9, 213, 220, 0.21)"
              strokeColor={colors.blue1}
            />
            <Marker
              draggable
              coordinate={coordinate}
              onDragEnd={(e) => setCoordinate(e.nativeEvent.coordinate)}
            />
          </MapView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    padding: 8,
    borderColor: colors.grey1,
    marginBottom: 10,
  },
  header: {
    height: 52,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.blue1,
  },
  map: {
    flex: 1,
  },
});

export default SelectInputLocation;
