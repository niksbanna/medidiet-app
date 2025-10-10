import { Platform, ToastAndroid, Alert } from 'react-native';

/**
 * Show a toast notification on Android or a simple alert on iOS
 * @param message - The message to display
 * @param duration - Toast duration ('short' or 'long'), default is 'long'
 */
export const showToast = (message: string, duration: 'short' | 'long' = 'long') => {
  if (Platform.OS === 'android') {
    const toastDuration = duration === 'short' ? ToastAndroid.SHORT : ToastAndroid.LONG;
    ToastAndroid.show(message, toastDuration);
  } else {
    // For iOS, we use a non-blocking alert
    // In production, consider using a library like react-native-toast-message
    Alert.alert('', message, [{ text: 'OK', style: 'default' }]);
  }
};

/**
 * Show a success toast with checkmark emoji
 */
export const showSuccessToast = (message: string) => {
  showToast(`✅ ${message}`);
};

/**
 * Show an error toast with warning emoji
 */
export const showErrorToast = (message: string) => {
  showToast(`❌ ${message}`);
};

/**
 * Show a warning toast with warning emoji
 */
export const showWarningToast = (message: string) => {
  showToast(`⚠️ ${message}`);
};

/**
 * Show an info toast with info emoji
 */
export const showInfoToast = (message: string) => {
  showToast(`ℹ️ ${message}`);
};
