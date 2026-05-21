/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MealNutrition {
  protein: number; // g
  carbs: number;   // g
  fat: number;     // g
}

export interface MealData {
  id: string;
  schoolName: string; // 반드시 "씨마스고등학교"
  date: Date;
  dateKey: string;     // YYYYMMDD
  dayOfWeek: string;   // "월", "화", "수", "목", "금"
  mealType: "중식" | "석식";
  title: string;       // 예: "치즈돈까스 정식"
  dishes: string[];    // 반찬 목록
  totalCalories: number; // kcal
  nutrition: MealNutrition;
  allergens: string[]; // 알레르기 정보
}

export interface NutritionMenuItem {
  id: string;
  name: string;
  category: "밥류" | "국/찌개" | "반찬" | "디저트";
  description: string;
  calories: number;    // kcal
  protein: number;     // g
  carbs: number;       // g
  fat: number;         // g
  allergens?: string[];
  selected?: boolean;
}

export interface UserProfile {
  name: string;
  gradeClassNumber: string; // "2학년 3반 15번"
  allergies: string[];      // 예: ["우유", "땅콩"]
  allergyNotice: boolean;
  dailyNotice: boolean;
}
