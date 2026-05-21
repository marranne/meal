/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Heart, 
  MapPin, 
  User, 
  Edit3, 
  Bell, 
  AlertTriangle, 
  ChevronRight, 
  LogOut, 
  Plus, 
  X, 
  Check, 
  Info,
  ExternalLink,
  Calculator
} from "lucide-react";
import { MealData, NutritionMenuItem, UserProfile } from "./types";
import { 
  getTodayKST, 
  formatKoreanDate, 
  formatDateKey, 
  getWeekDates, 
  getWeekOfMonth, 
  getDefaultSelectedDate,
  cleanDishName
} from "./utils";
import { generateWeeklyMockMeals, defaultNutritionMenuItems } from "./mockData";
import AppHeader from "./components/AppHeader";
import BottomNav from "./components/BottomNav";
import HeroMealCard from "./components/HeroMealCard";
import MealCard from "./components/MealCard";
import NutritionSummaryCard from "./components/NutritionSummaryCard";
import MenuFilterChips, { MenuCategoryFilter } from "./components/MenuFilterChips";
import SelectableMenuItem from "./components/SelectableMenuItem";

export default function App() {
  // 1. Core States (Synchronized selected date across all screens)
  const defaultDateInfo = getDefaultSelectedDate();
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDateInfo.date);
  const [isWeekendAdjusted, setIsWeekendAdjusted] = useState<boolean>(defaultDateInfo.isWeekendAdjustment);
  
  // Active Tab state: "home" | "weekly" | "nutrition" | "profile"
  const [currentTab, setCurrentTab] = useState<string>("home");

  // Load dynamically generated weekly meal mock database based on synchronized selectedDate
  const [meals, setMeals] = useState<MealData[]>([]);
  
  // 2. Nutrition Calculator States
  const [calculatorItems, setCalculatorItems] = useState<NutritionMenuItem[]>(defaultNutritionMenuItems);
  const [calculatorFilter, setCalculatorFilter] = useState<MenuCategoryFilter>("전체");

  // 3. User & Settings state (stored in LocalStorage or memory)
  const [profile, setProfile] = useState<UserProfile>({
    name: "김학생",
    gradeClassNumber: "2학년 3반 15번",
    allergies: ["우유", "땅콩"],
    allergyNotice: true,
    dailyNotice: true
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [newAllergen, setNewAllergen] = useState("");
  const [showAddAllergen, setShowAddAllergen] = useState(false);

  // 4. Toast notifications for interaction feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger weekly meal generation whenever selectedDate changes
  useEffect(() => {
    const weeklyMeals = generateWeeklyMockMeals(selectedDate);
    setMeals(weeklyMeals);
  }, [selectedDate]);

  // Toast auto-dismiss effect
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Helper to extract specific meal by dynamic criteria
  const getMealForSelectedDate = (type: "중식" | "석식"): MealData | undefined => {
    const key = formatDateKey(selectedDate);
    return meals.find(m => m.dateKey === key && m.mealType === type);
  };

  const selectedDateKey = formatDateKey(selectedDate);
  const selectedDayName = ["일", "월", "화", "수", "목", "금", "토"][selectedDate.getDay()];
  const weekDates = getWeekDates(selectedDate);

  // Toggle meal selection in the Nutrition Calculator
  const handleToggleCalculatorItem = (id: string) => {
    setCalculatorItems(prev =>
      prev.map(item => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  // Synchronous calculation of summary stats based on current check state
  const selectedItems = calculatorItems.filter(item => item.selected);
  const calcTotals = selectedItems.reduce(
    (acc, curr) => {
      acc.calories += curr.calories;
      acc.protein += curr.protein;
      acc.carbs += curr.carbs;
      acc.fat += curr.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Filtered list for the calculation catalog view
  const filteredCalculatorItems = calculatorItems.filter(item => {
    if (calculatorFilter === "전체") return true;
    return item.category === calculatorFilter;
  });

  // Action handlers
  const handleSaveResult = () => {
    // Save chosen calculator components set locally
    localStorage.setItem(
      `nutrition_calc_${selectedDateKey}`,
      JSON.stringify(selectedItems.map(i => i.name))
    );
    showToast("계산 결과가 기기에 성공적으로 저장되었습니다!");
  };

  const handleUpdateNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setProfile(prev => ({ ...prev, name: tempName }));
      setIsEditingName(false);
      showToast(`이름이 '${tempName}'(으)로 변경되었습니다.`);
    }
  };

  const handleAddAllergen = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAllergen.trim() && !profile.allergies.includes(newAllergen.trim())) {
      setProfile(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergen.trim()]
      }));
      showToast(`알레르기 필터에 '${newAllergen}'(이)가 추가되었습니다.`);
      setNewAllergen("");
      setShowAddAllergen(false);
    }
  };

  const handleRemoveAllergen = (name: string) => {
    setProfile(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== name)
    }));
    showToast(`알레르기 필터에서 '${name}'(이)가 제거되었습니다.`);
  };

  const handleLogout = () => {
    showToast("로그아웃되었습니다. 교원 연수용 데모 상태가 초기화됩니다.");
  };

  const handleToggleNotice = (type: "allergy" | "daily") => {
    if (type === "allergy") {
      setProfile(prev => {
        const next = !prev.allergyNotice;
        showToast(next ? "알레르기 경보 알림이 켜졌습니다." : "알레르기 경보 알림이 꺼졌습니다.");
        return { ...prev, allergyNotice: next };
      });
    } else {
      setProfile(prev => {
        const next = !prev.dailyNotice;
        showToast(next ? "일일 식단 알림이 켜졌습니다." : "일일 식단 알림이 꺼졌습니다.");
        return { ...prev, dailyNotice: next };
      });
    }
  };

  // Synchronized selected meal from home/week screen to populate the calculator on navigation
  const loadLunchToCalculator = () => {
    // Take the lunch on current date, convert to calculator items
    const lunch = getMealForSelectedDate("중식");
    if (lunch) {
      const generatedItems: NutritionMenuItem[] = lunch.dishes.map((dish, index) => {
        const cleaned = cleanDishName(dish);
        let category: NutritionMenuItem["category"] = "반찬";
        let calories = 70;
        let protein = 3;
        let carbs = 8;
        let fat = 2;

        if (cleaned.includes("밥") || cleaned.includes("덮밥") || cleaned.includes("라이스")) {
          category = "밥류";
          calories = 300;
          carbs = 62;
          protein = 5;
          fat = 1;
        } else if (cleaned.includes("국") || cleaned.includes("찌개") || cleaned.includes("탕")) {
          category = "국/찌개";
          calories = 160;
          protein = 10;
          carbs = 12;
          fat = 6;
        } else if (cleaned.includes("에이드") || cleaned.includes("요구르트") || cleaned.includes("아이스") || cleaned.includes("푸딩")) {
          category = "디저트";
          calories = 75;
          protein = 0.8;
          carbs = 18;
          fat = 0.2;
        } else if (cleaned.includes("돈까스") || cleaned.includes("치킨") || cleaned.includes("강정") || cleaned.includes("갈비") || cleaned.includes("스테이크")) {
          category = "반찬";
          calories = 260;
          protein = 16;
          carbs = 15;
          fat = 12;
        }

        return {
          id: `sync-meal-${index}`,
          name: cleaned,
          category,
          description: `씨마스고등학교 ${selectedDayName}요일 급식 엄선 메뉴`,
          calories,
          protein,
          carbs,
          fat,
          selected: true
        };
      });

      setCalculatorItems(generatedItems);
      setCurrentTab("nutrition");
      showToast("오늘의 중식 메뉴가 계산기에 연동되었습니다!");
    } else {
      showToast("해당 날짜에는 연동할 급식 식단이 없습니다.");
    }
  };

  const lunchMeal = getMealForSelectedDate("중식");
  const dinnerMeal = getMealForSelectedDate("석식");

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7EF]">
      {/* 
        TODO: Add actual Gmarket Sans font files to /public/fonts before deployment.
        TODO: Prepare GitHub and Vercel deployment.
      */}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 transform rounded-full bg-[#4F6F00] px-5 py-2.5 text-xs font-bold text-white shadow-xl flex items-center gap-2 animate-bounce">
          <Info size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Synchronized Global Header */}
      <AppHeader 
        currentTab={currentTab} 
        onTabChange={(tab) => setCurrentTab(tab)} 
        onNotificationClick={() => showToast("알림 목록이 비어 있습니다. 평화로운 학교식당입니다.")}
        onSettingsClick={() => setCurrentTab("profile")}
      />

      {/* Main Content Area */}
      <main className="flex-grow pb-24 pt-6 md:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Calendar top ribbon (Except profile tab) */}
          {currentTab !== "profile" && (
            <div className="mb-6 rounded-2xl bg-[#EEF0EA]/50 p-4 border border-[#EEF0EA]/80 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDE8B2]/80 text-[#4F6F00]">
                  <MapPin size={18} />
                </span>
                <div>
                  <h4 className="text-[13px] font-bold text-[#6B7F1A] uppercase tracking-wider">
                    씨마스고등학교 조리실
                  </h4>
                  <p className="text-sm font-semibold text-[#2A241A] flex items-center gap-2">
                    {formatKoreanDate(selectedDate)}
                    {isWeekendAdjusted && (
                      <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">
                        다음 급식일
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Quick Today picker button */}
              <button 
                onClick={() => {
                  const todayInfo = getDefaultSelectedDate();
                  setSelectedDate(todayInfo.date);
                  setIsWeekendAdjusted(todayInfo.isWeekendAdjustment);
                  showToast("오늘 급식일로 이동했습니다.");
                }}
                className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#4F6F00] border border-[#EEF0EA] hover:bg-[#EEF0EA] active:scale-95 transition-all"
              >
                오늘로 돌아가기
              </button>
            </div>
          )}

          {/* TAB CONTENT 1: HOME (홈) */}
          {currentTab === "home" && (
            <div className="space-y-6">
              
              {/* Dynamic Big Food Hero Card */}
              {lunchMeal ? (
                <HeroMealCard 
                  date={selectedDate} 
                  title={lunchMeal.title} 
                  totalCalories={lunchMeal.totalCalories}
                  isWeekend={isWeekendAdjusted}
                />
              ) : (
                <div className="rounded-[24px] bg-white p-12 text-center border border-[#EEF0EA] shadow-sm">
                  <AlertTriangle className="mx-auto text-amber-500 mb-3" size={32} />
                  <p className="text-[#2A241A] font-bold">해당 날짜의 급식 정보가 아직 없습니다.</p>
                  <p className="text-xs text-[#747967] mt-1">조리실에서 아직 식단표 일정을 입력하지 않았습니다.</p>
                  {/* TODO: Handle weekends and school holidays from NEIS calendar data. */}
                </div>
              )}

              {/* Today's Meals Summary Header */}
              <div className="flex items-center justify-between mt-8 border-b border-[#EEF0EA] pb-2">
                <h3 className="font-sans text-lg font-extrabold text-[#2A241A] flex items-center gap-2">
                  <span>오늘의 급식</span>
                  <span className="text-xs font-normal text-[#747967]">{getWeekOfMonth(selectedDate)}</span>
                </h3>
                
                <button 
                  onClick={loadLunchToCalculator}
                  className="rounded-full bg-[#DDE8B2]/60 px-3.5 py-1 text-xs font-bold text-[#4F6F00] hover:bg-[#4F6F00] hover:text-white transition-all flex items-center gap-1"
                >
                  <Calculator size={12} />
                  <span>이 식단으로 영양계산하기</span>
                </button>
              </div>

              {/* Grid representation of daily schedule */}
              <div className="grid gap-6 md:grid-cols-2">
                
                {/* LUNCH CARD */}
                {lunchMeal ? (
                  <MealCard 
                    mealType="중식" 
                    title={lunchMeal.title} 
                    dishes={lunchMeal.dishes} 
                    totalCalories={lunchMeal.totalCalories} 
                    allergens={lunchMeal.allergens}
                    proteinRate={85}
                    highlightedDish="매콤돈육강정"
                    badgeText="추천"
                  />
                ) : (
                  <div className="rounded-[24px] bg-white p-8 text-center border border-[#EEF0EA] text-[#747967] text-sm">
                    오늘 중식 식단이 비어 있습니다.
                  </div>
                )}

                {/* DINNER CARD */}
                {dinnerMeal ? (
                  <MealCard 
                    mealType="석식" 
                    title={dinnerMeal.title} 
                    dishes={dinnerMeal.dishes} 
                    totalCalories={dinnerMeal.totalCalories} 
                    allergens={dinnerMeal.allergens}
                    proteinRate={60}
                    highlightedDish="매콤떡볶이"
                    badgeText="특식"
                  />
                ) : (
                  <div className="rounded-[24px] bg-white p-8 text-center border border-[#EEF0EA] text-[#747967] text-sm">
                    오늘 석식 식단이 비어 있습니다.
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB CONTENT 2: WEEKLY (식단표) */}
          {currentTab === "weekly" && (
            <div className="space-y-6">
              
              {/* Header section */}
              <section>
                <p className="text-xs font-bold text-[#4F6F00]">주간 식단</p>
                <h1 className="font-sans text-2xl font-extrabold text-[#2A241A] tracking-tight">
                  {getWeekOfMonth(selectedDate)}
                </h1>
              </section>

              {/* WeekDateSelector Ribbon */}
              <section className="flex justify-between items-center bg-white rounded-[24px] p-2 border border-[#EEF0EA] shadow-sm">
                {weekDates.map((d, index) => {
                  const daysKorean = ["일", "월", "화", "수", "목", "금", "토"];
                  const dayName = daysKorean[d.getDay()];
                  const dayNumber = d.getDate();
                  const isSelected = formatDateKey(d) === selectedDateKey;

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedDate(d);
                        setIsWeekendAdjusted(false);
                      }}
                      className={`flex flex-col items-center justify-center w-14 py-3 rounded-2xl transition-all ${
                        isSelected
                          ? "bg-[#4F6F00] text-white shadow-md font-bold"
                          : "text-[#747967] hover:bg-[#FAF7EF] hover:text-[#4F6F00]"
                      }`}
                    >
                      <span className="text-xs font-bold mb-1">{dayName}</span>
                      <span className="text-base font-extrabold">{dayNumber}</span>
                    </button>
                  );
                })}
              </section>

              {/* Meals schedule grid - 2 columns on tablet/desktop */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#4F6F00] px-1 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#4F6F00]"></span>
                    점심 식사 시간
                  </h3>
                  {lunchMeal ? (
                    <MealCard 
                      mealType="중식" 
                      title={lunchMeal.title} 
                      dishes={lunchMeal.dishes} 
                      totalCalories={lunchMeal.totalCalories} 
                      allergens={lunchMeal.allergens}
                      proteinRate={85}
                      highlightedDish="수제함박스테이크"
                      badgeText="특식"
                    />
                  ) : (
                    <div className="rounded-[24px] bg-white p-12 text-center border border-[#EEF0EA] text-[#747967] text-sm">
                      해당 요일의 중식 정보가 아직 없습니다.
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#6B7F1A] px-1 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#6B7F1A]"></span>
                    저녁 식사 시간
                  </h3>
                  {dinnerMeal ? (
                    <MealCard 
                      mealType="석식" 
                      title={dinnerMeal.title} 
                      dishes={dinnerMeal.dishes} 
                      totalCalories={dinnerMeal.totalCalories} 
                      allergens={dinnerMeal.allergens}
                      proteinRate={60}
                    />
                  ) : (
                    <div className="rounded-[24px] bg-white p-12 text-center border border-[#EEF0EA] text-[#747967] text-sm">
                      해당 요일의 석식 정보가 아직 없습니다.
                    </div>
                  )}
                </div>
              </div>

              {/* 
                TODO: Use dateKey to request meal data from the NEIS API.
                TODO: Replace dynamic mock data with real NEIS meal data.
              */}
            </div>
          )}

          {/* TAB CONTENT 3: NUTRITION CALCULATOR (영양계산) */}
          {currentTab === "nutrition" && (
            <div className="space-y-6">
              
              {/* Responsive Layout Division */}
              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                
                {/* LEFT COLUMN: Summary Gauges Panel */}
                <div className="w-full lg:w-5/12 flex flex-col justify-between gap-4">
                  
                  <div className="space-y-4">
                    <NutritionSummaryCard 
                      totalCalories={calcTotals.calories}
                      protein={calcTotals.protein}
                      carbs={calcTotals.carbs}
                      fat={calcTotals.fat}
                    />

                    {/* Meta indicator */}
                    <div className="rounded-2xl border border-dashed border-[#EEF0EA] bg-[#FAF7EF] p-4 text-xs text-[#747967] space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#6B7F1A]">
                        <Info size={14} />
                        <span>영양학 팁</span>
                      </div>
                      <p>단백질 달성도와 탄수화물, 지방 수준은 고등학생 점심 권장섭취량 기준에 최적으로 산출되었습니다.</p>
                    </div>
                  </div>

                  {/* Desktop persistent save trigger bar */}
                  <div className="hidden lg:block mt-auto pb-1">
                    <button
                      onClick={handleSaveResult}
                      disabled={selectedItems.length === 0}
                      className="w-full bg-[#4F6F00] hover:bg-[#6B7F1A] text-white py-4 rounded-full font-bold shadow-lg shadow-[#4F6F00]/20 hover:shadow-xl transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Check size={18} className="stroke-[3]" />
                      <span>계산 결과 저장하기</span>
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN: Items List with Category Filter */}
                <div className="w-full lg:w-7/12 space-y-4 bg-white rounded-[24px] p-6 border border-[#EEF0EA] shadow-sm flex flex-col">
                  
                  {/* Category Filter selector */}
                  <div>
                    <h3 className="text-sm font-bold text-[#2A241A] mb-2 px-1">식단 구성 분류</h3>
                    <MenuFilterChips 
                      selectedCategory={calculatorFilter}
                      onSelectCategory={(cat) => setCalculatorFilter(cat)}
                    />
                  </div>

                  {/* Scrollable list catalog */}
                  <div className="space-y-3 flex-grow max-h-[480px] overflow-y-auto pr-1">
                    {filteredCalculatorItems.length > 0 ? (
                      filteredCalculatorItems.map((item) => (
                        <SelectableMenuItem 
                          key={item.id} 
                          item={item} 
                          onToggle={handleToggleCalculatorItem}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 text-[#747967] text-xs">
                        해당 카테고리에 분류된 항목이 없습니다.
                      </div>
                    )}
                  </div>

                  {/* Item Stats counter indicators */}
                  <div className="pt-3 border-t border-[#EEF0EA] mt-4 flex items-center justify-between text-xs text-[#747967]">
                    <span>선택된 갯수: <strong className="text-[#4F6F00]">{selectedItems.length}개</strong></span>
                    <span>메뉴 총합: <strong className="text-[#2A241A]">{calcTotals.calories} kcal</strong></span>
                  </div>

                  {/* Mobile Fixed/Floating Save button inside bottom boundary */}
                  <div className="block lg:hidden pt-4">
                    <button
                      onClick={handleSaveResult}
                      disabled={selectedItems.length === 0}
                      className="w-full bg-[#4F6F00] hover:bg-[#6B7F1A] text-white py-4 rounded-full font-bold shadow-md shadow-[#4F6F00]/20 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 flex items-center justify-center gap-2 text-sm"
                    >
                      <Check size={16} className="stroke-[3]" />
                      <span>계산 결과 저장하기</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB CONTENT 4: PROFILE & SETTINGS (프로필) */}
          {currentTab === "profile" && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              {/* Profile Card with avatar and badge */}
              <section className="bg-gradient-to-br from-white to-[#DDE8B2]/30 rounded-[24px] p-6 sm:p-8 shadow-sm border border-[#EEF0EA] relative overflow-hidden flex flex-col items-center justify-center text-center">
                
                {/* Edit Pencil triggers inline name revision */}
                <button 
                  onClick={() => {
                    setIsEditingName(!isEditingName);
                    setTempName(profile.name);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/70 hover:bg-[#EEF0EA] text-[#4F6F00] transition-colors shadow-sm"
                  title="이름 수정"
                >
                  <Edit3 size={18} />
                </button>

                {/* Oval Avatar container */}
                <div className="w-24 h-24 rounded-full bg-[#DDE8B2] flex items-center justify-center mb-4 shadow rounded-[999px] overflow-hidden border-2 border-white ring-4 ring-[#DDE8B2]/40 relative">
                  <img 
                    alt="김학생 학생 아바타" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkjKgbEXdG6ryVuTZUp2A7qb1EA0diyZ_pRrgfEoZEvmUbC3t8jeR_wS1XxLbVi7Tt5CoD966Hl1c8soqsaek-pHUzKoiYxC7ibo_HB7YNKuBdp8Nkiqk8NEMgcYD0a8wN3INSo5DmffoGBw9wbk7Nu7lK6yTqp-587MLN5D4jVY3fDOIlr9r0QWoQLFxL3X47iWrrmmUQOJoJESs9jbpDJh_-uwaz-YHniyjYZlpp7d-wVUqxFN59A9_mEwhidgYjQ_odoon_EqY"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {isEditingName ? (
                  <form onSubmit={handleUpdateNameSubmit} className="flex items-center gap-2 mt-2 w-full max-w-xs">
                    <input 
                      type="text" 
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="이름 입력"
                      className="flex-grow px-3 py-1.5 border border-[#4F6F00] rounded-xl text-sm focus:outline-none bg-white text-black"
                      maxLength={12}
                    />
                    <button type="submit" className="bg-[#4F6F00] text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#6B7F1A]">
                      저장
                    </button>
                    <button type="button" onClick={() => setIsEditingName(false)} className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-xs">
                      취소
                    </button>
                  </form>
                ) : (
                  <>
                    <h2 className="font-sans text-xl font-bold text-[#4F6F00] mb-1 flex items-center gap-1.5 justify-center">
                      <span>{profile.name}</span>
                      <span className="inline-block bg-[#4F6F00]/10 text-[#4F6F00] px-2 py-0.5 rounded text-[10px] font-bold">학생회원</span>
                    </h2>
                    <p className="text-xs text-[#747967]">{profile.gradeClassNumber}</p>
                  </>
                )}
                
                <p className="text-[11px] text-[#747967]/70 mt-3 flex items-center gap-1">
                  <span>정식 소속: 씨마스고등학교</span>
                </p>
              </section>

              {/* Setting details panel */}
              <section className="space-y-4">
                
                {/* Card 1: Allergy Configuration */}
                <div className="bg-white rounded-[24px] p-6 border border-[#EEF0EA] shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-sans text-[15px] font-bold text-[#2A241A] flex items-center gap-2">
                        <AlertTriangle className="text-[#4F6F00]" size={18} />
                        <span>알레르기 경고 알림</span>
                      </h3>
                      <p className="text-xs text-[#747967]">식단표에 등록된 알레르기 유발 물질이 급식에 포함되면 경보 표시</p>
                    </div>

                    {/* Toggle custom pill switch */}
                    <button 
                      onClick={() => handleToggleNotice("allergy")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        profile.allergyNotice ? "bg-[#4F6F00]" : "bg-gray-200"
                      }`}
                    >
                      <span 
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          profile.allergyNotice ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Registered allergy indicators */}
                  {profile.allergyNotice && (
                    <div className="pt-2">
                      <p className="text-[11px] font-bold text-[#747967] mb-2">필터링 적용 중인 식품:</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.allergies.map((item) => (
                          <span key={item} className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-100 shadow-sm">
                            <span>{item}</span>
                            <button onClick={() => handleRemoveAllergen(item)} className="hover:text-red-900 ml-0.5">
                              <X size={12} className="stroke-[2.5]" />
                            </button>
                          </span>
                        ))}
                        
                        {showAddAllergen ? (
                          <form onSubmit={handleAddAllergen} className="inline-flex gap-1.5 items-center">
                            <input 
                              type="text" 
                              placeholder="직접 입력"
                              value={newAllergen}
                              onChange={(e) => setNewAllergen(e.target.value)}
                              className="px-2.5 py-0.5 text-xs border border-[#4F6F00] rounded-lg w-20 max-w-xs focus:outline-none bg-white text-black"
                              maxLength={8}
                            />
                            <button type="submit" className="bg-[#4F6F00] text-white px-2 py-1 text-[10px] font-bold rounded-lg">+</button>
                            <button type="button" onClick={() => setShowAddAllergen(false)} className="text-[#747967] text-[10px]">X</button>
                          </form>
                        ) : (
                          <button
                            onClick={() => setShowAddAllergen(true)}
                            className="inline-flex items-center gap-1 px-3 py-1 border border-dashed border-[#EEF0EA] text-[#6B7F1A] text-xs font-bold rounded-full bg-white hover:bg-[#FAF7EF]"
                          >
                            <Plus size={12} />
                            <span>추가</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card 2: Daily Notification Setting */}
                <div className="bg-white rounded-[24px] p-6 border border-[#EEF0EA] shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-sans text-[15px] font-bold text-[#2A241A] flex items-center gap-2">
                      <Bell className="text-[#4F6F00]" size={18} />
                      <span>일일 식단 알림</span>
                    </h3>
                    <p className="text-xs text-[#747967]">매일 아침 8시에 오늘의 중식/석식 메뉴 알림 푸시 수신</p>
                  </div>

                  {/* Switch */}
                  <button 
                    onClick={() => handleToggleNotice("daily")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      profile.dailyNotice ? "bg-[#4F6F00]" : "bg-gray-200"
                    }`}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        profile.dailyNotice ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Card 3: Information Links list */}
                <div className="bg-white rounded-[24px] border border-[#EEF0EA] shadow-sm overflow-hidden divide-y divide-[#EEF0EA]/60">
                  
                  <button 
                    onClick={() => showToast("고객센터로 연결할 수 없는 가상 환경입니다.")}
                    className="w-full text-left p-4.5 flex items-center justify-between hover:bg-[#FAF7EF]/40 transition-colors"
                  >
                    <span className="text-[14px] font-semibold text-[#2A241A]">고객센터 / 문의하기</span>
                    <ChevronRight size={16} className="text-[#747967]" />
                  </button>

                  <button 
                    onClick={() => showToast("이용약관 안내: 본 시스템은 씨마스고등학교 교육용 급식 앱 데모 소프트웨어입니다.")}
                    className="w-full text-left p-4.5 flex items-center justify-between hover:bg-[#FAF7EF]/40 transition-colors"
                  >
                    <span className="text-[14px] font-semibold text-[#2A241A]">이용약관</span>
                    <ChevronRight size={16} className="text-[#747967]" />
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="w-full text-left p-4.5 flex items-center justify-between hover:bg-red-50/50 transition-colors text-red-600 font-semibold"
                  >
                    <span className="text-[14px]">로그아웃</span>
                    <LogOut size={16} />
                  </button>

                </div>

              </section>

              {/* Developer / Education footnote wrapper */}
              <div className="rounded-2xl bg-[#EEF0EA]/40 p-4 border border-[#EEF0EA]/70 mt-6 space-y-2">
                <h4 className="text-xs font-bold text-[#4F6F00]">💡 교원 연수용 안내사항 (Teacher Training Toolkit)</h4>
                <p className="text-[11px] text-[#747967] leading-relaxed">
                  본 애플리케이션은 Google AI Studio를 활용하여 교사들이 손쉽게 React 및 NEIS Open API 구조를 실생활 예제로 설계할 수 있도록 뼈대를 잡은 교육용 패키지 소프트웨어입니다.
                  깃허브(GitHub)와의 연동을 가정한 뒤 버셀(Vercel) 배포 스크립트를 작성하여 손쉬운 교육 커리큘럼 작성이 가능합니다.
                </p>
                <div className="flex gap-4 pt-1.5 flex-wrap">
                  <a href="#github" className="text-[11px] font-bold text-[#6B7F1A] flex items-center gap-1 hover:underline">
                    <ExternalLink size={12} />
                    <span>GitHub 레포지토리 연동 가이드</span>
                  </a>
                  <a href="#vercel" className="text-[11px] font-bold text-[#6B7F1A] flex items-center gap-1 hover:underline">
                    <ExternalLink size={12} />
                    <span>Vercel 원클릭 빌드&배포법</span>
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Synchronized Footer */}
      <footer className="bg-[#FAF7EF] py-8 text-center border-t border-[#EEF0EA]/80">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-xs font-semibold text-[#747967] tracking-tight">
            © 2024 씨마스고등학교 급식
          </p>
          <p className="text-[11px] text-[#747967]/75 mt-1.5 leading-relaxed">
            건강하고 맛있는 학교 식단을 지원합니다.<br />
            씨마스 테크스쿨 교육 혁신 지원단
          </p>
        </div>
      </footer>

      {/* Synchronized Bottom Navigation for Mobile screen ranges */}
      <BottomNav currentTab={currentTab} onTabChange={(tab) => setCurrentTab(tab)} />
    </div>
  );
}
