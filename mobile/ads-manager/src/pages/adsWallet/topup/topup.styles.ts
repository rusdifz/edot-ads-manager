import { StyleSheet } from "react-native";
import { colors } from "../../../themes/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey1Light
  },
  cardInput: {
    padding: 12,
    paddingBottom: 16,
    marginBottom: 8,
    backgroundColor: colors.white
  },
  wrapInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    backgroundColor: colors.primaryLight,
    borderRadius: 50/2,
    paddingHorizontal: 10
  },
  input: {
    textAlign: 'right', 
    minWidth: 100, 
    fontSize: 16, 
    color: colors.primary
  },
  list: {
    flexGrow: 1,
    backgroundColor: colors.white,
    padding: 12
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderBottomWidth: 0.8,
    borderColor: colors.grey1Light
  },
  wrapBtn: {
    alignItems: 'center',
    backgroundColor: colors.white,
    height: 60,
    width: '100%'
  }
})