// Root component của ứng dụng
// Cấu hình navigation và các providers
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import MapScreen from "./src/screens/MapScreen";
import MenuScreen from "./src/screens/MenuScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import { RecipeProvider } from './src/context/RecipeContext';
import { AuthProvider } from './src/context/AuthContext';

// Khởi tạo Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    // Bọc toàn bộ ứng dụng trong các providers
    <AuthProvider>
      <RecipeProvider>
        <NavigationContainer>
          {/* Cấu hình thanh tab navigation */}
          <Tab.Navigator
            screenOptions={({ route }) => ({
              // Tùy chỉnh icon cho từng tab
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;
                // Chọn icon dựa trên route name và trạng thái focus
                if (route.name === 'Bản đồ') {
                  iconName = focused ? 'map' : 'map-outline';
                } else if (route.name === 'Menu') {
                  iconName = focused ? 'book' : 'book-outline';
                } else {
                  iconName = focused ? 'person' : 'person-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
          >
            {/* Định nghĩa các màn hình trong tab */}
            <Tab.Screen name="Bản đồ" component={MapScreen} />
            <Tab.Screen name="Menu" component={MenuScreen} />
            <Tab.Screen name="Tài khoản" component={ProfileScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </RecipeProvider>
    </AuthProvider>
  );
}