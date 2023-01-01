import { StyleSheet } from "react-native";
import { colors } from "../../themes/colors";

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.grey1Light
  },
  item: {
    padding: 12,
    marginBottom: 4,
    flexDirection: 'row',
    backgroundColor: colors.white
  },
  header: {
    height: 40,
    paddingHorizontal: 12,
    justifyContent: 'center'
  }
})