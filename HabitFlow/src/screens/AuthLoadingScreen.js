import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export default function AuthLoadingScreen({ navigation }) {
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000; // current time in seconds

          if (decoded.exp && decoded.exp > now) {
            navigation.replace('Home');
          } else {
            // Token expired
            await AsyncStorage.removeItem('token');
            navigation.replace('Login');
          }
        } catch (error) {
          // Token invalid
          await AsyncStorage.removeItem('token');
          navigation.replace('Login');
        }
      } else {
        navigation.replace('Login');
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
