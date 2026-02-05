import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Providers } from './src/providers';
import { LoadingScreen } from './src/components';
import { RootNavigator } from './src/navigation';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await loadFonts();
      setIsReady(true);
    }

    prepare();
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Providers>
        <StatusBar style="light" />
        <RootNavigator />
      </Providers>
    </GestureHandlerRootView>
  );
}

async function loadFonts() {
  return Promise.resolve();
}
