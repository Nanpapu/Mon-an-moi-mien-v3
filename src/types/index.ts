// Định nghĩa các kiểu dữ liệu (types và interfaces) dùng chung trong ứng dụng

// Thông tin một công thức nấu ăn
export interface Recipe {
  id: string;           // ID định danh duy nhất
  name: string;         // Tên món ăn
  region: string;       // Vùng miền
  image: string;        // URL hình ảnh món ăn
  ingredients: string[];    // Danh sách nguyên liệu
  instructions: string[];   // Các bước thực hiện
}

// Thông tin một vùng miền
export interface Region {
  id: string;           // ID định danh duy nhất
  name: string;         // Tên vùng miền
  coordinate: {         // Tọa độ trên bản đồ
    latitude: number;   // Vĩ độ
    longitude: number;  // Kinh độ
  };
  recipes: Recipe[];    // Danh sách công thức của vùng miền
}

// Trạng thái validation của form
export interface ValidationState {
  email: boolean;       // Trạng thái hợp lệ của email
  password: boolean;    // Trạng thái hợp lệ của mật khẩu
} 