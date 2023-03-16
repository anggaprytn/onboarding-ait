import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { defaultColors } from '../../themes';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const statusBarHeight = getStatusBarHeight();

export const styles = StyleSheet.create({
  containerFooter: {
    position: 'absolute',
    bottom: 16,
    width: wp(100),
    alignItems: 'center',
  },
  underline: { textDecorationLine: 'underline' },
  container: { flex: 1, backgroundColor: defaultColors.screenBackground },
  containerHeader: {
    width: wp(100),
    paddingHorizontal: 16,
    marginTop: statusBarHeight + 32,
  },
  containerForm: { width: wp(100), marginTop: 32, paddingHorizontal: 16 },
  textInputEmail: {
    fontFamily: 'Satoshi-Regular',
    paddingRight: 48,
    height: 48,
    width: wp(100) - 32,
    paddingHorizontal: 16,
    backgroundColor: defaultColors.white,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
  },
  btnLogin: { width: wp(100) - 32, marginHorizontal: 16, marginTop: 32 },
  mt4: { marginTop: 4 },
  mt24: { marginTop: 24 },
  textInputPassword: {
    fontFamily: 'Satoshi-Regular',
    paddingRight: 48,
    height: 48,
    width: wp(100) - 32,
    paddingHorizontal: 16,
    backgroundColor: defaultColors.white,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
  },
});
