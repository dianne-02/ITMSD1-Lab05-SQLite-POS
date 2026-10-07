import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ExpertProfileScreen from '../screens/ExpertProfileScreen';
import MakeAppointmentScreen from '../screens/MakeAppointmentScreen';
import TrackExpertScreen from '../screens/TrackExpertScreen';
import PaymentScreen from '../screens/PaymentScreen';
import SuccessScreen from '../screens/SuccessScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookingsScreen from '../screens/BookingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ExpertProfile" component={ExpertProfileScreen} />
        <Stack.Screen name="MakeAppointment" component={MakeAppointmentScreen} />
        <Stack.Screen name="TrackExpert" component={TrackExpertScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="Success" component={SuccessScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Bookings" component={BookingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
