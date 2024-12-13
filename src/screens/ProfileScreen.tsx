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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { RegionService } from "../services/regionService";
import { ImportButton } from "../components/ImportButton";

export default function ProfileScreen() {
  // HOOKS & STATE
  // Lấy các hàm xử lý auth từ context
  const { login, isLoading, user, logout, register } = useAuth();
  // State quản lý form đăng nhập
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // HANDLERS
  // Kiểm tra email hợp lệ
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Xử lý đăng nhập
  const handleLogin = async () => {
    // Kiểm tra tính hợp lệ của form
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
      Alert.alert("Lỗi", "Email hoặc mật khẩu không hợp lệ");
    }
  };

  const handleImportData = async () => {
    const success = await RegionService.importDataToFirestore();
    if (success) {
      Alert.alert("Thành công", "Đã import dữ liệu vào Firestore");
    } else {
      Alert.alert("Lỗi", "Không thể import dữ liệu");
    }
  };

  // RENDER
  // Hiển thị màn hình khi đã đăng nhập
  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Xin chào, {user.email}</Text>
        <ImportButton />
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Hiển thị form đăng nhập
  return (
    <View style={styles.container}>
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
          secureTextEntry
        />
      </View>

      {isRegistering && (
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>
          {isRegistering ? "Đăng ký" : "Đăng nhập"}
        </Text>
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
      <ImportButton />
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  // Container chính
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },

  // Styles cho form container
  formContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Styles cho tiêu đề và text
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
  },

  // Styles cho input
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    padding: 12,
    marginLeft: 10,
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginBottom: 10,
  },

  // Styles cho các nút
  loginButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  forgotButton: {
    marginTop: 15,
    alignItems: "center",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  // Styles cho text trong nút
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotButtonText: {
    color: "#666",
    fontSize: 14,
  },
  socialButtonText: {
    marginLeft: 10,
    color: "#666",
    fontSize: 16,
  },

  // Styles cho nút đăng nhập và đăng ký
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
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
});
