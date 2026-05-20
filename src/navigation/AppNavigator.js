import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { colors } from '../theme';
import { useApp } from '../context/AppContext';

import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import AdminScreen from '../screens/AdminScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTab" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
}

function CustomTabBar({ state, descriptors, navigation }) {
  const { cartCount, currentUser } = useApp();

  const tabs = state.routes.map((route, index) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;

    const icons = {
      Home: '🏠',
      Orders: '📦',
      Admin: '⚙️',
      Profile: '👤',
    };

    const labels = {
      Home: 'INÍCIO',
      Orders: 'ENCOMENDAS',
      Admin: 'ADMIN',
      Profile: 'PERFIL',
    };

    const onPress = () => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const showBadge = route.name === 'Home' && cartCount > 0;

    return (
      <TouchableOpacity key={route.key} style={styles.tabItem} onPress={onPress} activeOpacity={0.7}>
        <View style={{ position: 'relative' }}>
          <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
            {icons[route.name]}
          </Text>
          {showBadge && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
          {labels[route.name]}
        </Text>
      </TouchableOpacity>
    );
  });

  return <View style={styles.tabBar}>{tabs}</View>;
}

function MainTabs() {
  const { currentUser } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {!isAdmin && <Tab.Screen name="Home" component={HomeStack} />}
      {!isAdmin && <Tab.Screen name="Orders" component={OrdersScreen} />}
      {isAdmin && <Tab.Screen name="Admin" component={AdminScreen} />}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 8,
    paddingBottom: 20,
  },
  tabItem: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 4,
  },
  tabIcon: { fontSize: 22, marginBottom: 3 },
  tabIconActive: { },
  tabLabel: { fontSize: 9, fontWeight: '600', color: colors.text2, letterSpacing: 0.5 },
  tabLabelActive: { color: colors.accent },
  tabBadge: {
    position: 'absolute', top: -4, right: -8,
    backgroundColor: colors.accent, borderRadius: 8,
    minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  tabBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
});
