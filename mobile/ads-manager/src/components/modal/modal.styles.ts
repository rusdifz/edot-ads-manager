import { StyleSheet } from "react-native";
import { colors } from "../../themes/colors";

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.blackDim
  },
  wrapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 18
  },
  content: {
    maxWidth: '90%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12
  }
})