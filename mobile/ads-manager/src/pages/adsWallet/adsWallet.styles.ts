import { StyleSheet } from "react-native";
import { colors } from "../../themes/colors";

export default StyleSheet.create({
  container: {
    flexGrow: 1
  },
  cardBalance: {
    padding: 12,
    paddingBottom: 16,
    backgroundColor: colors.blue1
  },
  wrapBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: colors.primaryLight,
    borderRadius: 50/2,
    paddingHorizontal: 10
  },
  wrapFilterDate: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderColor: colors.grey1
  }
})