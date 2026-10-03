import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoadingView from '../components/LoadingView';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import WorkoutSessionScreen from '../screens/WorkoutSessionScreen';
import CommunityScreen from '../screens/CommunityScreen';
import NutritionScreen from '../screens/NutritionScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const WorkoutStack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    text: colors.text,
    card: colors.surface,
    border: colors.border,
  },
};

function WorkoutNavigator() {
  return (
    <WorkoutStack.Navigator>
      <WorkoutStack.Screen name="WorkoutList" component={WorkoutsScreen} options={{ title: 'Workouts' }} />
      <WorkoutStack.Screen name="WorkoutSession" component={WorkoutSessionScreen} options={{ title: 'Session' }} />
    </WorkoutStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: { minHeight: 56, paddingBottom: 6, paddingTop: 6 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
          tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} />,
        }}
      />
      <Tab.Screen
        name="Workouts"
        component={WorkoutNavigator}
        options={{
          tabBarLabel: 'Workouts',
          tabBarAccessibilityLabel: 'Workouts tab',
          tabBarIcon: ({ color }) => <TabIcon emoji="💪" color={color} />,
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarLabel: 'Community',
          tabBarAccessibilityLabel: 'Community tab',
          tabBarIcon: ({ color }) => <TabIcon emoji="👥" color={color} />,
        }}
      />
      <Tab.Screen
        name="Nutrition"
        component={NutritionScreen}
        options={{
          tabBarLabel: 'Nutrition',
          tabBarAccessibilityLabel: 'Nutrition tab',
          tabBarIcon: ({ color }) => <TabIcon emoji="🍽️" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'Profile tab',
          tabBarIcon: ({ color }) => <TabIcon emoji="🙂" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function TabIcon({ emoji }) {
  return <Text style={{ fontSize: 18 }}>{emoji}</Text>;
}

export default function AppNavigator() {
  const { ready, user } = useAuth();

  if (!ready) {
    return <LoadingView label="Starting FitFlow" />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="Main" component={MainTabs} />
        ) : (
          <RootStack.Screen name="Login" component={LoginScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
