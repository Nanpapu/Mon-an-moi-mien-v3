// Component hiển thị thông tin chi tiết của một công thức nấu ăn
// Bao gồm hình ảnh, tên món, vùng miền, nguyên liệu và cách làm
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Recipe } from '../types';

// Props của component
interface Props {
  recipe: Recipe;              // Thông tin công thức
  onSave?: () => void;        // Hàm xử lý khi nhấn nút lưu
  onDelete?: () => void;      // Hàm xử lý khi nhấn nút xóa
  showActions?: boolean;       // Hiển thị các nút tương tác hay không
}

export function RecipeCard({ recipe, onSave, onDelete, showActions = true }: Props) {
  // RENDER
  return (
    <View style={styles.card}>
      {/* Phần hình ảnh món ăn */}
      <Image
        source={recipe.image}
        style={styles.image}
        contentFit="cover"
        transition={1000}
      />
      
      {/* Phần thông tin chi tiết */}
      <View style={styles.content}>
        {/* Tên món và vùng miền */}
        <Text style={styles.name}>{recipe.name}</Text>
        <Text style={styles.region}>Vùng miền: {recipe.region}</Text>
        
        {/* Danh sách nguyên liệu */}
        <Text style={styles.sectionTitle}>Nguyên liệu:</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.listItem}>• {ingredient}</Text>
        ))}

        {/* Các bước thực hiện */}
        <Text style={styles.sectionTitle}>Cách làm:</Text>
        {recipe.instructions.map((instruction, index) => (
          <Text key={index} style={styles.listItem}>
            {index + 1}. {instruction}
          </Text>
        ))}

        {/* Phần nút tương tác */}
        {showActions && (
          <View style={styles.actions}>
            {onSave && (
              <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.buttonText}>Lưu công thức</Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                <Text style={styles.buttonText}>Xóa công thức</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  // Style cho card chứa toàn bộ thông tin
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Style cho phần hình ảnh
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  // Style cho phần nội dung
  content: {
    padding: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  region: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
    paddingLeft: 10,
  },

  // Style cho phần nút tương tác
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});