import { StyleSheet } from 'react-native';
import { colors } from '../../../../../themes/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    height: 48,
  },
  headerItem: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  img: {
    height: 68,
    width: 68,
    borderRadius: 8,
    backgroundColor: colors.grey1,
  },
  imgUpload: {
    height: 200,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.grey1Light,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
