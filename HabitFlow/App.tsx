import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';

export default function App() {
  return (
    <GestureHandlerRootView>
      <AppNavigator />
    </GestureHandlerRootView>
  );
}
