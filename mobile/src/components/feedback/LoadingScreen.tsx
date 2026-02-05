import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { darkTheme } from '../../theme/colors';

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={darkTheme.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkTheme.background,
  },
});
