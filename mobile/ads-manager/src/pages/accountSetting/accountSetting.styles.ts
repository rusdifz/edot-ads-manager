import { StyleSheet } from "react-native";
import { colors } from "../../themes/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  header: {
    height: 40,
    paddingHorizontal: 12,
    justifyContent: 'center'
  },
  tabLabel: {
    flexDirection: 'row',
  },
  circleTab: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.blue1,
    alignItems: 'center'
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "center",
  }
})