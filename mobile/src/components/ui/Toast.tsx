import React from 'react';
import ToastMessage, {
  BaseToast,
  ErrorToast,
  ToastConfig,
  ToastShowParams,
} from 'react-native-toast-message';
import { darkTheme } from '../../theme/colors';

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: darkTheme.primary, backgroundColor: darkTheme.surface }}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1Style={{ color: darkTheme.text, fontWeight: '600' }}
      text2Style={{ color: darkTheme.textSecondary }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#EF4444', backgroundColor: darkTheme.surface }}
      text1Style={{ color: darkTheme.text, fontWeight: '600' }}
      text2Style={{ color: darkTheme.textSecondary }}
    />
  ),
};

export function Toast() {
  return <ToastMessage config={toastConfig} />;
}

export const toast = {
  show: (params: ToastShowParams) => ToastMessage.show(params),
  hide: () => ToastMessage.hide(),
};
