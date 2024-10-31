import {StyleSheet, Dimensions} from 'react-native';
const res = Dimensions.get('window').height;

export const device_info_styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  unable__container: {
    paddingVertical: res * 0.02,
    marginTop: res * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  unable: {
    fontSize: res * 0.025,
    fontWeight: '600',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingVertical: res * 0.05,
    paddingHorizontal: res * 0.04,
    marginTop: res * 0.02,
    borderBottomLeftRadius: res * 0.03,
    borderBottomRightRadius: res * 0.03,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  header__id: {},
  header__id_text: {
    color: '#374259',
    fontWeight: '900',
    fontSize: res * 0.03,
  },
  header__bat: {
    flexDirection: 'row',
  },
  header__bat_text: {
    fontWeight: '900',
    fontSize: res * 0.03,
  },
  full: {
    color: '#337357',
  },
  low: {
    color: '#FF9800',
  },
  stat__container: {
    paddingHorizontal: res * 0.07,
    marginTop: res * 0.04,
  },
  width: {
    width: '100%',
  },
  divide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat__heart_box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#374259',
    padding: res * 0.02,
    borderRadius: res * 0.02,
  },
  warning: {
    backgroundColor: '#EE4266',
  },
  stat__heart_healine: {
    gap: res * 0.01,
  },
  stat__heart_icon: {
    fontSize: res * 0.1,
    color: '#41B06E',
  },
  stat__heart_text: {
    fontSize: res * 0.025,
    fontWeight: '900',
    color: '#FFF',
  },
  stat__heart_info: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: res * 0.01,
  },
  stat__heart_num: {
    fontSize: res * 0.05,
    color: '#FFF',
    fontWeight: '900',
  },
  stat__heart_unit: {
    fontSize: res * 0.02,
    color: '#FFF',
  },
  stat__divide_box: {
    width: '45%',
    backgroundColor: '#374259',
    paddingVertical: res * 0.02,
    paddingHorizontal: res * 0.01,
    borderRadius: res * 0.02,
    gap: res * 0.02,
  },
  stat__divide_headline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: res * 0.08,
  },
  stat__divide_icon: {
    fontSize: res * 0.05,
    width: '40%',
  },
  blood: {
    color: '#5DEBD7',
  },
  temp: {
    color: '#FA7070',
  },
  stat__divide_name: {
    fontSize: res * 0.03,
    width: '50%',
    fontWeight: '900',
    color: '#FFF',
  },
  stat__divide_info: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: res * 0.01,
  },
  stat__divide_num: {
    fontSize: res * 0.05,
    color: '#FFF',
    fontWeight: '900',
  },
  stat__divide_unit: {
    fontSize: res * 0.03,
    color: '#FFF',
  },
  measure: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: res * 0.05,
  },
  measure__text: {
    fontSize: res * 0.02,
    fontWeight: '900',
    color: '#5C8984',
    fontStyle: 'italic',
  },
  disconnect__container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    gap: res * 0.02,
    width: '100%',
    position: 'absolute',
    bottom: res * 0.02,
    right: res * 0.04,
  },
  disconnect__text: {
    textTransform: 'uppercase',
    fontSize: res * 0.02,
    fontWeight: '900',
    color: '#D37676',
  },
  disconnect__btn_icon: {
    width: res * 0.07,
    height: res * 0.07,
    borderRadius: (res * 0.07) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D37676',
  },
  disconnect__icon: {
    fontSize: res * 0.04,
    fontWeight: '900',
    color: '#FFF',
  },
});
