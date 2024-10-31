import {StyleSheet, Dimensions} from 'react-native';
import {APP_COLORS} from '../colors';

const res = Dimensions.get('window').height;

export const home_styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  welcome__bg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  welcome__container: {
    position: 'relative',
    padding: res * 0.025,
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome__time: {
    position: 'absolute',
    top: res * 0.035,
    left: 0,
    width: res * 0.15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.95,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: res * 0.015,
    gap: 10,
  },
  time__welcome__container: {
    // backgroundColor: '#FFF',
    borderRadius: 5,
  },
  time__welcome: {
    fontSize: res * 0.02,
    color: '#4CAF50',
  },
  time__welcome_period: {
    fontWeight: '600',
    color: '#000',
    // backgroundColor: '#FFF',
  },
  highlight: {
    fontWeight: '700',
    fontSize: res * 0.03,
  },
  welcome__logo: {
    width: '80%',
    // alignItems: 'center',
  },
  space__box: {
    alignItems: 'center',
  },
  space__box_content: {
    width: '40%',
    height: res * 0.005,
    backgroundColor: '#4CAF50',
    margin: res * 0.02,
    borderRadius: 10,
  },
  logo__name: {
    fontFamily: 'BerkshireSwash-Regular',
    fontSize: res * 0.04,
    color: APP_COLORS.darkblue,
  },
  logo__name_night: {
    fontFamily: 'BerkshireSwash-Regular',
    fontSize: res * 0.04,
    color: APP_COLORS.pink,
  },
  start: {
    // width: '100%',
    alignItems: 'flex-start',
  },
  end: {
    // width: '100%',
    alignItems: 'flex-end',
  },
  class__name_container: {
    position: 'absolute',
    top: res * 0.035,
    right: 0,
    paddingHorizontal: res * 0.01,
    paddingVertical: res * 0.01,
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
  class__name: {
    color: '#000',
    fontSize: res * 0.02,
    fontWeight: '600',
  },
  welcome__btn_group: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: res * 0.14,
  },
  welcome__btn: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  scan_button: {
    alignItems: 'center',
  },
  side__box: {
    width: res * 0.07,
    height: res * 0.07,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  side__icon: {
    fontSize: res * 0.03,
  },
  side__text: {
    fontSize: res * 0.015,
    fontWeight: '600',
    color: '#FFF',
    marginTop: res * 0.005,
  },
  main__box: {
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main__icon: {
    fontSize: res * 0.04,
    color: APP_COLORS.pink,
  },

  //STATS STYLE --------------------------------------------------------------------------------
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  content: {
    padding: Platform.OS === 'android' ? res * 0.02 : res * 0.025,
    // backgroundColor: 'teal',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: res * 0.025,
    padding: res * 0.03,
    paddingTop: Platform.OS === 'ios' ? res * 0.05 : 0,
    height: 80,
  },
  header__text: {
    fontSize: Platform.OS == 'android' ? res * 0.03 : res * 0.04,
    fontWeight: '900',
    // color: '#4CAF50',
    color: '#4CAF50',
  },
  device__id: {
    fontSize: 15,
    marginTop: 10,
    color: '#FFF',
  },
  battery__container: {
    position: 'relative',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  battery__number: {
    color: '#FFF',
    fontSize: res * 0.015,
    fontWeight: '900',
  },
  battery__charge: {
    width: res * 0.04,
    height: res * 0.015,
    backgroundColor: '#BDBDBD',
    borderRadius: 2,
  },
  box__notcharge: {
    backgroundColor: '#388E3C',
  },
  box__incharge: {
    backgroundColor: '#FB8C00',
  },
  stat__container: {
    width: '100%',
    height: '100%',
    marginTop: res * 0.005,
    paddingHorizontal: res * 0.009,
    paddingBottom: res * 0.06, //clear after done
  },
  stat__list: {
    gap: 20,
  },
  disable: {
    display: 'none',
  },
  vertical__list: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  stat__box: {
    width: '48%',
    justifyContent: 'space-between',
  },
  stat__item: {
    width: '100%',
    marginTop: res * 0.02,
  },
  stat__item_content: {
    width: '100%',
    backgroundColor: '#15212D',
    padding: res * 0.015,
    borderRadius: 15,
    shadowColor: '#FFF',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.6,
    shadowRadius: 5.68,
    elevation: 12,
  },
  spotlight: {
    // backgroundColor: '#B7B7B7',
    // shadowColor: '#EADBC8',
  },
  item__head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stat__icon: {
    width: res * 0.045,
    height: res * 0.045,
    borderRadius: (res * 0.045) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: res * 0.025,
  },
  time__blur: {
    backgroundColor: '#4F4722',
  },
  time: {
    color: '#FFB800',
  },
  distance__blur: {
    backgroundColor: '#243352',
  },
  distance: {
    color: '#627CE6',
  },
  sprint__blur: {
    backgroundColor: '#113C24',
  },
  sprint: {
    color: '#03A900',
  },
  calories__blur: {
    backgroundColor: '#443024',
  },
  calories: {
    color: '#FF6B00',
  },
  step__blur: {
    backgroundColor: '#412F39',
  },
  step: {
    fontSize: 25,
    color: '#F16767',
  },
  jump__blur: {
    backgroundColor: '#443C2C',
  },
  jump: {
    color: '#FFA726',
  },
  speed__blur: {
    backgroundColor: '#4F2E2A',
  },
  speed: {
    color: '#FF5722',
  },
  heatmap__blur: {
    backgroundColor: '#4D292F',
  },
  heatmap: {
    color: '#F44336',
  },
  stat__name: {
    fontSize: res * 0.02,
    color: '#FFF',
    fontWeight: '900',
    marginLeft: res * 0.015,
  },
  stat__jump: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  jump__image: {
    width: res * 0.07,
    height: res * 0.12,
    resizeMode: 'cover',
  },
  item__number: {
    alignItems: 'center',
    paddingVertical: res * 0.025,
  },
  medal__container: {
    width: res * 0.12,
    height: res * 0.125,
  },
  medal: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  quote__contaier: {
    marginTop: res * 0.02,
    gap: res * 0.01,
    alignItems: 'center',
  },
  quote__text: {
    textAlign: 'center',
    fontWeight: '900',
    color: '#4CAF50',
  },
  number: {
    fontSize: res * 0.04,
    color: '#FFF',
    fontWeight: '700',
  },
  spotlight__number: {
    fontSize: res * 0.05,
    color: '#E79C25',
  },
  bottom__name: {
    textAlign: 'center',
    fontSize: res * 0.02,
    color: '#FFF',
    fontWeight: '900',
  },
  unit__square: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  square: {
    fontSize: res * 0.013,
    color: '#FFF',
    fontWeight: '600',
    marginLeft: res * 0.003,
  },
  unit: {
    marginTop: res * 0.015,
    color: '#FFF',
    fontWeight: '600',
  },
  congrate: {
    fontSize: res * 0.015,
    marginTop: 10,
    color: '#43A047',
    textAlign: 'center',
  },
  map__container: {
    position: 'relative',
    marginTop: res * 0.025,
    paddingBottom: res * 0.015,
  },
  map__disable: {
    position: 'absolute',
    width: '100%',
    height: res * 0.3,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  map: {
    width: '100%',
    height: res * 0.3,
  },
  heatmap__dots: {
    padding: res * 0.005,
    backgroundColor: '#43A047',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heatmap__dots_nd: {
    padding: res * 0.0048,
    backgroundColor: '#FDD835',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // opacity: 0.6,
  },
  heatmap__dots_rd: {
    padding: res * 0.0047,
    backgroundColor: '#F4511E',
    borderRadius: 10,
    // opacity: 0.6,
  },
  multi: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: res * 0.015,
    paddingVertical: res * 0.025,
  },
  item: {
    alignItems: 'center',
    width: '31%',
  },
  speed_accecleration__blur: {
    backgroundColor: '#103945',
  },
  speed_accecleration: {
    color: '#00ACC1',
  },
  line: {
    height: '50%',
    width: 1,
    backgroundColor: '#616161',
  },
  button__group: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: res * 0.015,
  },
  button__container: {
    paddingVertical: res * 0.015,
    alignItems: 'center',
    borderRadius: 5,
  },
  button__save: {
    width: '55%',
    backgroundColor: '#FFF',
  },
  button__icon: {
    fontSize: res * 0.03,
  },
  save: {
    color: '#43A047',
  },
  button__clear: {
    width: '18%',
    backgroundColor: '#43A047',
  },
  clear: {
    color: '#FFF',
  },
  button__disconnect: {
    width: '18%',
    backgroundColor: '#F44336',
  },
  disconnect: {
    color: '#FFF',
  },
  loadingAnimation: {
    width: 0,
    height: res * 0.01,
    backgroundColor: '#FFF',
  },
});
