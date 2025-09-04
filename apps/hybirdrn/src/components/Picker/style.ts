import { StyleSheet, Platform } from 'react-native';
import { theme } from '../../styles/theme';

export const defaultPickerStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colorBorder,
    borderRadius: theme.borderRadiusBase,
    backgroundColor: theme.colorWhite,
    paddingHorizontal: theme.spacingMedium,
    paddingVertical: theme.spacingSmall,
    minHeight: 40,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
      default: {},
    }),
  },
  pickerText: {
    flex: 1,
    color: theme.colorText,
    fontSize: theme.fontSizeBase,
  },
  placeholderText: {
    color: theme.colorTextSecondary,
  },
  arrow: {
    marginLeft: theme.spacingSmall,
    fontSize: theme.fontSizeBase,
    color: theme.colorTextSecondary,
  },
  disabled: {
    backgroundColor: theme.colorBackground,
    opacity: 0.6,
    ...Platform.select({
      web: {
        cursor: 'not-allowed',
      },
      default: {},
    }),
  },
  error: {
    borderColor: theme.colorError,
  },
  errorText: {
    color: theme.colorError,
    fontSize: theme.fontSizeSmall,
    marginTop: theme.spacingXs,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: theme.colorWhite,
    borderTopLeftRadius: theme.borderRadiusBase,
    borderTopRightRadius: theme.borderRadiusBase,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacingMedium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorBorder,
  },
  modalTitle: {
    fontSize: theme.fontSizeMedium,
    fontWeight: theme.fontWeightMedium,
    color: theme.colorText,
  },
  modalCancel: {
    fontSize: theme.fontSizeBase,
    color: theme.colorTextSecondary,
  },
  modalConfirm: {
    fontSize: theme.fontSizeBase,
    color: theme.colorPrimary,
    fontWeight: theme.fontWeightMedium,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    padding: theme.spacingMedium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: theme.fontSizeBase,
    color: theme.colorText,
  },
  selectedOption: {
    backgroundColor: theme.colorPrimaryLight,
  },
  selectedOptionText: {
    color: theme.colorPrimary,
    fontWeight: theme.fontWeightMedium,
  },
  checkIcon: {
    color: theme.colorPrimary,
    fontSize: theme.fontSizeBase,
  },
  small: {
    minHeight: 32,
    paddingVertical: theme.spacingXs,
  },
  large: {
    minHeight: 48,
    paddingVertical: theme.spacingMedium,
  },
  rounded: {
    borderRadius: 20,
  },
});

export default defaultPickerStyles;
