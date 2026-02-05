import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  LoginScreen,
  MagicLinkEmailScreen,
  MagicLinkSentScreen,
  MagicLinkVerifyScreen,
} from '@/screens/auth';
import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MagicLinkEmail" component={MagicLinkEmailScreen} />
      <Stack.Screen name="MagicLinkSent" component={MagicLinkSentScreen} />
      <Stack.Screen name="MagicLinkVerify" component={MagicLinkVerifyScreen} />
    </Stack.Navigator>
  );
}
