// App.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import SingleScreenApp from './SingleScreenApp';
import UserRegistrationScreen from './UserRegistrationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [booted, setBooted] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem('user_info');
      setIsRegistered(!!json);
      setBooted(true);
    })();
  }, []);

  if (!booted) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isRegistered ? (
          <Stack.Screen name="Main">
            {props => (
              <SingleScreenApp
                {...props}
                onLogout={async () => {
                  await AsyncStorage.removeItem('user_info');
                  setIsRegistered(false);
                }}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Register">
            {props => (
              <UserRegistrationScreen
                {...props}
                onRegistered={() => setIsRegistered(true)}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
