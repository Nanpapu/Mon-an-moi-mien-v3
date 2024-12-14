// Component màn hình Tài khoản
// Xử lý đăng nhập, đăng xuất và quên mật khẩu
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { ImportButton } from "../components/ImportButton";
import { RegionService } from "../services/regionService";
import * as ImagePicker from 'expo-image-picker';
import { UserService } from '../services/userService';

export default function ProfileScreen() {
  // HOOKS & STATE
  const { login, isLoading, user, logout, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Animation
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isRegistering]);

  // HANDLERS
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async () => {
    const emailValid = validateEmail(email);
    const passwordValid = password.length >= 6;

    if (emailValid && passwordValid) {
      try {
        if (isRegistering) {
          if (password !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu nhập lại không khớp");
            return;
          }
          await register(email, password);
          Alert.alert("Thành công", "Đăng ký tài khoản thành công");
        } else {
          await login(email, password);
          Alert.alert("Thành công", "Đăng nhập thành công");
        }
      } catch (error: any) {
        Alert.alert("Lỗi", error.message);
      }
    } else {
      Alert.alert(
        "Lỗi",
        `${!emailValid ? "Email không hợp lệ" : "Mật khẩu phải có ít nhất 6 ký tự"}`
      );
    }
  };

  const handleImportData = async () => {
    try {
      const success = await RegionService.importDataToFirestore();
      if (success) {
        Alert.alert("Thành công", "Đã import dữ liệu vào Firestore");
      } else {
        Alert.alert("Lỗi", "Không thể import dữ liệu");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi import dữ liệu");
    }
  };

  // RENDER
  if (user) {
    return (
      <Animated.View 
        style={[
          styles.container,
          { opacity: fadeAnim }
        ]}
      >
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#007AFF" />
          </View>
          <Text style={styles.welcomeText}>Xin chào,</Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.importButton} 
            onPress={handleImportData}
          >
            <Ionicons name="cloud-upload-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Import Data</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={logout}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Animated.View 
        style={[
          styles.formContainer,
          { opacity: fadeAnim }
        ]}
      >
        <Text style={styles.title}>
          {isRegistering ? "Đăng ký" : "Đăng nhập"}
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={showPassword ? "eye-outline" : "eye-off-outline"} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        {isRegistering && (
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                size={24} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          style={[
            styles.button,
            isLoading && styles.buttonDisabled
          ]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              {isRegistering ? "Đăng ký" : "Đăng nhập"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchAuthButton}
          onPress={() => {
            setIsRegistering(!isRegistering);
            setEmail("");
            setPassword("");
            setConfirmPassword("");
          }}
        >
          <Text style={styles.switchAuthText}>
            {isRegistering ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
            <Text style={styles.switchAuthHighlight}>
              {isRegistering ? "Đăng nhập" : "Đăng ký"}
            </Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  
  formContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },

  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  welcomeText: {
    fontSize: 24,
    fontWeight: "500",
    color: '#333',
  },

  emailText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },

  actionsContainer: {
    marginTop: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: '#333',
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 55,
  },

  input: {
    flex: 1,
    padding: 12,
    marginLeft: 10,
    fontSize: 16,
  },

  eyeIcon: {
    padding: 10,
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    backgroundColor: "#99c9ff",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  logoutButton: {
    backgroundColor: "#ff4444",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
  },

  switchAuthButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  switchAuthText: {
    fontSize: 15,
    color: '#666',
  },

  switchAuthHighlight: {
    color: '#007AFF',
    fontWeight: 'bold',
  },

  importButton: {
    backgroundColor: "#4CAF50",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
  },
});
