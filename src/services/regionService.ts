import { db } from '../config/firebase';
import { collection, getDocs, doc, getDoc, query, where, setDoc } from 'firebase/firestore';
import { Region, Recipe } from '../types';
import { regions } from '../data/regions';

export const RegionService = {
  // Lấy tất cả vùng miền
  getAllRegions: async (): Promise<Region[]> => {
    try {
      const regionsSnapshot = await getDocs(collection(db, 'regions'));
      const regions: Region[] = [];
      
      for (const doc of regionsSnapshot.docs) {
        const regionData = doc.data();
        const recipesSnapshot = await getDocs(
          query(collection(db, 'recipes'), where('regionId', '==', doc.id))
        );
        
        const recipes = recipesSnapshot.docs.map(recipeDoc => recipeDoc.data() as Recipe);
        
        regions.push({
          ...regionData,
          recipes
        } as Region);
      }
      
      return regions;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu vùng miền:', error);
      return [];
    }
  },

  // Lấy chi tiết một vùng miền 
  getRegionById: async (regionId: string): Promise<Region | null> => {
    try {
      const regionDoc = await getDoc(doc(db, 'regions', regionId));
      if (!regionDoc.exists()) return null;

      const regionData = regionDoc.data();
      const recipesSnapshot = await getDocs(
        query(collection(db, 'recipes'), where('regionId', '==', regionId))
      );
      
      const recipes = recipesSnapshot.docs.map(doc => doc.data() as Recipe);
      
      return {
        ...regionData,
        recipes
      } as Region;
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết vùng miền:', error);
      return null;
    }
  },

  importDataToFirestore: async () => {
    try {
      // Import regions
      for (const region of regions) {
        const { recipes: regionRecipes, ...regionData } = region;
        
        await setDoc(doc(db, 'regions', region.id), {
          id: region.id,
          name: region.name,
          coordinate: region.coordinate
        });
        
        for (const recipe of regionRecipes) {
          await setDoc(doc(db, 'recipes', recipe.id), {
            ...recipe,
            regionId: region.id
          });
        }
      }
      
      console.log('Import dữ liệu thành công!');
      return true;
    } catch (error) {
      console.error('Lỗi khi import dữ liệu:', error);
      return false;
    }
  }
}; 