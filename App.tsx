import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './screens/WelcomeScreen';
import UserMenuScreen from './screens/UserMenuScreen';
import PrivateMenuScreen from './screens/PrivateMenu';
import ProfileScreen from './screens/ProfileScreen';
import CourseScreen from './screens/CourseScreen';

import type { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isChef, setIsChef] = useState(false);
  const [currentUser, setCurrentUser] = useState< any | null>(null);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#F1FAEE' },
            headerTintColor: '#1D3557',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen name="Home">
            {(props) => (
              <WelcomeScreen
                {...props}
                isChef={isChef}
                currentUser={currentUser}
                setIsChef={setIsChef}
                setCurrentUser={setCurrentUser}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="UserMenu">
            {(props) => (
              <UserMenuScreen
                {...props}
                isChef={isChef}
                currentUser={currentUser}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="PrivateMenu">
            {(props) => (
              <PrivateMenuScreen
                {...props}
                isChef={isChef}
                currentUser={currentUser}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Profile">
            {(props) => (
              <ProfileScreen
                {...props}
                isChef={isChef}
                currentUser={currentUser}
                setIsChef={setIsChef}
                setCurrentUser={setCurrentUser}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Courses">
            {(props) => (
              <CourseScreen
                {...props}
                isChef={isChef}
                currentUser={currentUser}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
