import { StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.white,
    padding: 12,
  },
  item: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: colors.white,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.grey1Light,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginLeft: 6,
    borderRadius: 4,
  },
  wrapItemMenu: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
