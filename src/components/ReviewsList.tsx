import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Review } from '../types';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
};

export const ReviewsList = ({ reviews, averageRating, totalReviews }: Props) => {
  return (
    <View style={styles.container}>
      {/* Hiển thị điểm trung bình */}
      <View style={styles.statsContainer}>
        <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= averageRating ? "star" : "star-outline"}
              size={20}
              color="#FFD700"
            />
          ))}
        </View>
        <Text style={styles.totalReviews}>{totalReviews} đánh giá</Text>
      </View>

      {/* Danh sách đánh giá */}
      <ScrollView style={styles.reviewsList}>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= review.rating ? "star" : "star-outline"}
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.reviewDate}>
                {review.createdAt.toDate().toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  averageRating: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  totalReviews: {
    color: '#666',
    fontSize: 14,
  },
  reviewsList: {
    maxHeight: 300,
  },
  reviewItem: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewDate: {
    color: '#666',
    fontSize: 12,
  },
  reviewComment: {
    color: '#333',
    fontSize: 14,
  },
});
