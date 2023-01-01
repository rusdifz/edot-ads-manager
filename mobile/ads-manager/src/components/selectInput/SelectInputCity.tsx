import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../../themes/colors';
import images from '../../themes/images';
import Icon from '../icon/Icon';
import Text from '../text/Text';
import { addressList } from '../../utils/dataDummy';
import Chip from '../chip/Chip';
import TextInput from '../textInput/TextInput';

type CityParams = {
  name: string;
  code: string;
  district: { code: string; name: string }[];
};

const SelectInputCity = () => {
  const [showModal, setShowModal] = useState(false);

  const [citySelected, setCitySelected] = useState<CityParams[]>([]);

  const onPressCity = (city: any) => {
    console.log(city);
    if (citySelected.length === 0) {
      setCitySelected([city]);
    }
    if (citySelected.some((a) => a.code === city.code)) {
      setCitySelected(citySelected.filter((a) => a.code !== city.code));
    } else {
      setCitySelected([...citySelected, city]);
    }
  };

  const onPressDistict = (cityId: string, disctrict: any) => {
    const checkDistrict = citySelected.filter((a) => a.code === cityId);
    // console.log(disctrict, citySelected, checkDistrict);
    if (checkDistrict[0]?.district.some((a) => a.code === disctrict.code)) {
      const filterDistrict = citySelected.map((a) => {
        return {
          ...a,
          district: a.district.filter((a) => a.code !== disctrict.code),
        };
      });
      console.log('min', filterDistrict);
      setCitySelected(filterDistrict);
    } else {
      const filterDistrict = citySelected.map((a) => {
        return {
          ...a,
          district: [...a.district, disctrict],
        };
      });
      console.log('plus', filterDistrict);
      setCitySelected(filterDistrict);
    }
  };

  return (
    <>
      <Text weight="500" style={{ paddingTop: 8 }}>
        Address
      </Text>
      <Pressable onPress={() => setShowModal(!showModal)} style={styles.input}>
        <ScrollView style={{ width: '88%' }} contentContainerStyle={{ flexGrow: 1 }} horizontal>
          {citySelected.length !== 0 ? (
            citySelected.map((item) =>
              item.district.map((a) => <Chip key={a.code} text={a.name} />)
            )
          ) : (
            <Text color={colors.grey1}>Select Address</Text>
          )}
        </ScrollView>
        <View style={{ width: '12%', alignItems: 'flex-end' }}>
          <Icon name={images.icon.arrow_down} size={14} />
        </View>
      </Pressable>

      <Modal visible={showModal}>
        <View>
          <View style={styles.header}>
            <Text weight="500" size={18} color={colors.white}>
              Select Address
            </Text>
            <Icon name={images.icon.close} onPress={() => setShowModal(false)} />
          </View>
          <View style={{ padding: 10 }}>
            <TextInput
              placeholder="Search City or District"
              contentContainerStyle={{ height: 40 }}
            />
          </View>
          {addressList.map((city) => (
            <View style={styles.modal}>
              <TouchableOpacity
                onPress={() => onPressCity(city)}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
              >
                <Icon
                  name={
                    citySelected.some((a) => a.code === city.code)
                      ? images.icon.checkbox_min
                      : images.icon.uncheck
                  }
                />
                <Text paddingHorizontal={10}>{city.name}</Text>
                <Icon name={images.icon.arrow_right} size={12} />
              </TouchableOpacity>
              {citySelected.some((a) => a.code === city.code) &&
                city.district.map((dis) => (
                  <TouchableOpacity
                    onPress={() => onPressDistict(city.code, dis)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                      marginLeft: 26,
                    }}
                  >
                    <Icon
                      name={
                        citySelected
                          .filter((a) => a.code === city.code)[0]
                          ?.district.some((a) => a.code === dis.code)
                          ? images.icon.checkbox_min
                          : images.icon.uncheck
                      }
                    />
                    <Text paddingHorizontal={10}>{dis.name}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          ))}
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
    height: 48,
    paddingHorizontal: 8,
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
  modal: {
    padding: 12,
  },
});

export default SelectInputCity;
