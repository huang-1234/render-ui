import { StyleSheet, Dimensions, Platform } from 'react-native';
import { theme } from '../../styles/theme';

const { width } = Dimensions.get('window');

export const defaultSwiperStyles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: 200,
  },
  slideContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  slide: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: theme.colorWhite,
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -20 }],
    zIndex: 10,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
      default: {},
    }),
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  arrowIcon: {
    color: theme.colorWhite,
    fontSize: 20,
    fontWeight: theme.fontWeightBold,
  },
  imageBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});
