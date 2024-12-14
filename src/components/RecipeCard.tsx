// Component hiển thị thông tin chi tiết của một công thức nấu ăn
// Bao gồm hình ảnh, tên món, vùng miền, nguyên liệu và cách làm
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Recipe } from "../types";
import { useAuth } from "../context/AuthContext";
import { ReviewService } from "../services/reviewService";
import { Ionicons } from "@expo/vector-icons";
import { ReviewModal } from "./ReviewModal";

// Props của component
interface Props {
  recipe: Recipe; // Thông tin công thức
  onSave?: () => void; // Hàm xử lý khi nhấn nút lưu
  onDelete?: () => void; // Hàm xử lý khi nhấn nút xóa
  showActions?: boolean; // Hiển thị các nút tương tác hay không
  showReviews?: boolean; // Hiển thị phần đánh giá hay không
}

export function RecipeCard({
  recipe,
  onSave,
  onDelete,
  showActions = true,
  showReviews = false,
}: Props) {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [existingReview, setExistingReview] = useState<any>(null);
  const [showReviewsList, setShowReviewsList] = useState(false);

  // Load thông tin đánh giá nếu showReviews = true
  useEffect(() => {
    if (showReviews) {
      const loadReviewData = async () => {
        const recipeStats = await ReviewService.getRecipeStats(recipe.id);
        setStats(recipeStats);
        if (user) {
          const review = await ReviewService.getUserReviewForRecipe(recipe.id, user.uid);
          setExistingReview(review);
        }
      };
      loadReviewData();
    }
  }, [recipe.id, user, showReviews]);

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
          <Text key={index} style={styles.listItem}>
            • {ingredient}
          </Text>
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

        {showReviews && (
          <View style={styles.ratingContainer}>
            <View style={styles.ratingHeader}>
              <View style={styles.ratingScore}>
                <Text style={styles.averageRating}>{stats.averageRating.toFixed(1)}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= stats.averageRating ? "star" : "star-outline"}
                      size={16}
                      color="#FFD700"
                    />
                  ))}
                </View>
                <Text style={styles.totalReviews}>{stats.totalReviews} đánh giá</Text>
              </View>
              
              {user && (
                <TouchableOpacity 
                  style={styles.addReviewButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Ionicons name={existingReview ? "create" : "add"} size={20} color="white" />
                  <Text style={styles.addReviewText}>
                    {existingReview ? 'Sửa đánh giá' : 'Đánh giá'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => setShowReviewsList(true)}
            >
              <Text style={styles.viewAllText}>Xem tất cả đánh giá</Text>
              <Ionicons name="chevron-forward" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {showReviews && user && (
        <ReviewModal
          visible={modalVisible}
          recipeId={recipe.id}
          userId={user.uid}
          existingReview={existingReview}
          onClose={() => setModalVisible(false)}
          onSubmit={async () => {
            const recipeStats = await ReviewService.getRecipeStats(recipe.id);
            setStats(recipeStats);
            if (user) {
              const review = await ReviewService.getUserReviewForRecipe(recipe.id, user.uid);
              setExistingReview(review);
            }
            setModalVisible(false);
          }}
        />
      )}
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  // Style cho card chứa toàn bộ thông tin
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Style cho phần hình ảnh
  image: {
    width: "100%",
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
    fontWeight: "bold",
    marginBottom: 5,
  },
  region: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingContainer: {
    marginTop: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
  },

  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  ratingScore: {
    alignItems: 'center',
  },

  averageRating: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },

  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: 4,
  },

  totalReviews: {
    fontSize: 12,
    color: '#666',
  },

  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },

  addReviewText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },

  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    marginTop: 4,
  },

  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});
