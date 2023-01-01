import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { Button, View } from 'react-native';
import { AppAdsManager } from 'ads-manager-package';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const Stack = createStackNavigator();

  function Home({ navigation }: any) {
    return (
      <View>
        <Button title="ke pengelola iklan" onPress={() => navigation.navigate('AdsManager')} />
      </View>
    );
  }

  function AdsManager({navigation}: any) {
    return <AppAdsManager 
    parentNavigation = {navigation}
    accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA3NCwiZW1haWwiOiJhem1pLnJvcWkyQGdtYWlsLmNvbSIsInBob25lX251bWJlciI6Ijg3ODU4OTQzNDIxNDgiLCJ1c2VyX2RldmljZV9pZCI6bnVsbCwiaWF0IjoxNjY3NTI5MzQxfQ.6nHJELV2PMTERj3RtvC3plEKQYVkHcGh-Kx-PPCUbj8" />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="AdsManager"
          component={AdsManager}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
