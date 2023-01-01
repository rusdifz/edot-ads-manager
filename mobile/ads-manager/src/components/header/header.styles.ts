import { StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 44,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  popupUser: {
    width: 240,
    padding: 10,
    paddingBottom: 2,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grey1,
  },
  itemMenu: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 10,
    borderRadius: 4
  }
});
