/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MealData, NutritionMenuItem } from "./types";
import { getWeekDates, formatDateKey } from "./utils";

// Generate dynamic meal data for the week given any base date
export function generateWeeklyMockMeals(baseDate: Date): MealData[] {
  const weekDates = getWeekDates(baseDate);
  const weekDays = ["월", "화", "수", "목", "금"];
  
  // Custom meal menus for each day of the week to show rich variety
  const lunchTemplates = [
    {
      title: "치즈돈까스 정식",
      dishes: ["*친환경현미밥", "쇠고기미역국", "매콤돈육강정 (10.12.)", "숙주미나리무침", "배추김치 ."],
      totalCalories: 845,
      nutrition: { protein: 32, carbs: 110, fat: 25 },
      allergens: ["대두", "밀", "쇠고기", "돼지고기"]
    },
    {
      title: "한방갈비탕",
      dishes: ["친환경흑미밥", "한방갈비탕 (16.)", "수제부추잡채", "삼색나물무침", "깍두기", "아이스홍시"],
      totalCalories: 810,
      nutrition: { protein: 35, carbs: 105, fat: 20 },
      allergens: ["쇠고기", "대두", "밀", "아황산류"]
    },
    {
      title: "순살치킨커리라이스",
      dishes: ["치킨카레라이스", "가쓰오장국", "단호박범벅 (1.2.)", "양상추그린샐러드", "열무김치", "유산균요구르트"],
      totalCalories: 890,
      nutrition: { protein: 29, carbs: 125, fat: 28 },
      allergens: ["닭고기", "우유", "대두", "밀", "토마토"]
    },
    {
      title: "수제함박스테이크 정식",
      dishes: ["*혼합잡곡밥", "돈육김치찌개 (10.)", "수제함박스테이크 (2.5.10.16.)", "숙주나물무침", "깍두기", "콘드레싱 ."],
      totalCalories: 850,
      nutrition: { protein: 38, carbs: 108, fat: 26 },
      allergens: ["돼지고기", "쇠고기", "우유", "대두", "밀"]
    },
    {
      title: "불고기낙지덮밥",
      dishes: ["불낙덮밥", "팽이맑은국", "오징어초무침", "바삭알말이 (1.5.)", "배추김치", "초코퐁당소보루"],
      totalCalories: 865,
      nutrition: { protein: 30, carbs: 115, fat: 24 },
      allergens: ["오징어", "밀", "대두", "쇠고기", "난류"]
    }
  ];

  const dinnerTemplates = [
    {
      title: "참치마요덮밥 & 떡볶이",
      dishes: ["참치마요덮밥 (1.5.)", "유부장국", "매콤떡볶이 (1.5.6.)", "깍두기", "요구르트 ."],
      totalCalories: 720,
      nutrition: { protein: 22, carbs: 98, fat: 18 },
      allergens: ["난류", "우유", "대두", "밀"]
    },
    {
      title: "베이컨크림파스타",
      dishes: ["크림스파게티 (1.2.6.)", "수제비나크국", "케이준치킨샐러드", "수제오이피클", "배추김치", "레몬에이드"],
      totalCalories: 780,
      nutrition: { protein: 25, carbs: 105, fat: 26 },
      allergens: ["우유", "밀", "대두", "닭고기", "돼지고기"]
    },
    {
      title: "매콤제육덮밥",
      dishes: ["제육양념덮밥 (10.)", "어묵국 (1.5.)", "해물김치전 (5.6.)", "단무지아삭무침", "요구르트"],
      totalCalories: 710,
      nutrition: { protein: 24, carbs: 95, fat: 19 },
      allergens: ["돼지고기", "대두", "밀", "조개류"]
    },
    {
      title: "해물순두부찌개 정식",
      dishes: ["쌀밥", "해물순두부찌개 (5.9.18.)", "언양식바싹불고기", "부추무침", "깍두기", "사과푸딩"],
      totalCalories: 690,
      nutrition: { protein: 28, carbs: 88, fat: 20 },
      allergens: ["대두", "쇠고기", "새우", "조개류"]
    },
    {
      title: "수제돈까스카레",
      dishes: ["수제카레돈까스 (2.5.6.10.)", "맑은우동장국", "꽃맛살샐러드", "단무지무침", "배추김치"],
      totalCalories: 740,
      nutrition: { protein: 23, carbs: 102, fat: 22 },
      allergens: ["돼지고기", "대두", "밀", "우유", "게"]
    }
  ];

  const meals: MealData[] = [];
  
  weekDates.forEach((date, index) => {
    const dayName = weekDays[index];
    const dateKey = formatDateKey(date);
    
    // Lunch
    meals.push({
      id: `lunch-${dateKey}`,
      schoolName: "씨마스고등학교",
      date,
      dateKey,
      dayOfWeek: dayName,
      mealType: "중식",
      title: lunchTemplates[index].title,
      dishes: lunchTemplates[index].dishes,
      totalCalories: lunchTemplates[index].totalCalories,
      nutrition: lunchTemplates[index].nutrition,
      allergens: lunchTemplates[index].allergens
    });
    
    // Dinner
    meals.push({
      id: `dinner-${dateKey}`,
      schoolName: "씨마스고등학교",
      date,
      dateKey,
      dayOfWeek: dayName,
      mealType: "석식",
      title: dinnerTemplates[index].title,
      dishes: dinnerTemplates[index].dishes,
      totalCalories: dinnerTemplates[index].totalCalories,
      nutrition: dinnerTemplates[index].nutrition,
      allergens: dinnerTemplates[index].allergens
    });
  });
  
  return meals;
}

// Default items for the nutrition calculator (based on a typical school lunch menu)
export const defaultNutritionMenuItems: NutritionMenuItem[] = [
  {
    id: "menu-1",
    name: "친환경현미밥",
    category: "밥류",
    description: "식이섬유가 풍부한 건강 현미밥",
    calories: 300,
    protein: 6,
    carbs: 60,
    fat: 1.5,
    selected: true
  },
  {
    id: "menu-2",
    name: "돼지고기 김치찌개",
    category: "국/찌개",
    description: "얼큰하고 진한 돼지고기가 들어간 김치찌개",
    calories: 250,
    protein: 15,
    carbs: 10,
    fat: 12,
    allergens: ["돼지고기", "대두"],
    selected: true
  },
  {
    id: "menu-3",
    name: "시금치 나물",
    category: "반찬",
    description: "신선한 시금치를 고소한 참기름에 무친 영양 만점 반찬",
    calories: 45,
    protein: 2,
    carbs: 5,
    fat: 1.8,
    selected: false
  },
  {
    id: "menu-4",
    name: "고등어 구이",
    category: "반찬",
    description: "오메가3가 가득하고 겉바속촉하게 노릇하게 구운 고등어",
    calories: 250,
    protein: 20,
    carbs: 0.5,
    fat: 16,
    allergens: ["고등어"],
    selected: false
  },
  {
    id: "menu-5",
    name: "쇠고기미역국",
    category: "국/찌개",
    description: "오랜 시간 푹 끓여 깊은 맛의 쇠고기미역국",
    calories: 180,
    protein: 14,
    carbs: 6,
    fat: 8,
    allergens: ["쇠고기", "대두"],
    selected: false
  },
  {
    id: "menu-6",
    name: "참치마요덮밥용 밥",
    category: "밥류",
    description: "고소한 김가루와 소스가 올라간 고소한 밥",
    calories: 320,
    protein: 7,
    carbs: 65,
    fat: 3,
    selected: false
  },
  {
    id: "menu-7",
    name: "매콤돈육강정",
    category: "반찬",
    description: "바삭하게 튀겨 매콤달콤 소스에 버무린 돈육강정",
    calories: 280,
    protein: 18,
    carbs: 22,
    fat: 11,
    allergens: ["돼지고기", "대두", "밀"],
    selected: false
  },
  {
    id: "menu-8",
    name: "아이스홍시",
    category: "디저트",
    description: "달콤하고 시원한 자연 그대로의 아이스 디저트",
    calories: 80,
    protein: 0.5,
    carbs: 20,
    fat: 0.1,
    selected: false
  },
  {
    id: "menu-9",
    name: "요구르트",
    category: "디저트",
    description: "소화를 도와주는 상큼하고 유익한 요구르트",
    calories: 60,
    protein: 1,
    carbs: 12,
    fat: 0.2,
    allergens: ["우유"],
    selected: false
  }
];
