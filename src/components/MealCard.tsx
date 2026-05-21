/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sun, Moon } from "lucide-react";
import { cleanDishName } from "../utils";

interface MealCardProps {
  mealType: "중식" | "석식";
  title: string;
  dishes: string[];
  totalCalories: number;
  allergens: string[];
  proteinRate?: number; // % 달성도 (예: 85, 60 등)
  highlightedDish?: string; // 예: "매콤돈육강정" 이나 "수제함박스테이크"
  badgeText?: "추천" | "특식";
}

export default function MealCard({
  mealType,
  title,
  dishes,
  totalCalories,
  allergens,
  proteinRate = 75,
  highlightedDish,
  badgeText = "추천",
}: MealCardProps) {
  const isLunch = mealType === "중식";
  
  // Choose icon based on mealType
  const Icon = isLunch ? Sun : Moon;
  const iconColor = isLunch ? "text-amber-500" : "text-[#6B7F1A]";

  return (
    <article className="meal-card flex flex-col justify-between rounded-[24px] border border-[#EEF0EA] bg-white p-6 shadow-[0_4px_20px_rgb(79,111,0,0.02)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(79,111,0,0.06)]">
      <div>
        
        {/* Header section of the meal card */}
        <div className="flex items-center justify-between border-b border-[#EEF0EA] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF7EF] ${iconColor}`}>
              <Icon size={18} className="stroke-[2.5]" />
            </span>
            <h4 className="font-sans text-lg font-bold text-[#2A241A]">{mealType}</h4>
          </div>
          <span className="text-[14px] font-semibold text-[#6B7F1A]">
            {totalCalories} <span className="text-xs font-normal text-[#747967]">kcal</span>
          </span>
        </div>

        {/* Dishes list */}
        <ul className="space-y-2.5 mb-5 pl-1">
          {dishes.map((rawDish, idx) => {
            const cleaned = cleanDishName(rawDish);
            // Check if this dish should be highlighted (contains highlightedDish name or matches completely)
            const isHighlighted = highlightedDish && cleaned.includes(cleanDishName(highlightedDish));

            return (
              <li key={idx} className="flex items-center gap-2.5 text-[15px] text-[#2A241A]">
                <span className={`h-1.5 w-1.5 rounded-full ${isHighlighted ? 'bg-[#4F6F00]' : 'bg-[#DDE8B2]'}`}></span>
                <span className={isHighlighted ? "font-bold text-[#4F6F00]" : "text-[#2A241A]/90"}>
                  {cleaned}
                </span>
                {isHighlighted && (
                  <span className={`inline-block scale-90 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    badgeText === "추천" 
                      ? "bg-[#FFE7DD] text-amber-700" 
                      : "bg-[#DDE8B2] text-[#4F6F00]"
                  }`}>
                    {badgeText}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Allergens & Nutrition Progress */}
      <div className="space-y-4">
        {/* Allergens Chip block */}
        <div className="rounded-xl bg-[#FAF7EF] p-3 text-xs border border-[#EEF0EA]/60">
          <span className="block text-[10px] font-bold text-[#747967] uppercase tracking-wide mb-1">
            알레르기 정보
          </span>
          <span className="text-[#2A241A]/85 font-medium leading-relaxed">
            {allergens && allergens.length > 0 ? allergens.join(", ") : "없음"}
          </span>
        </div>

        {/* Protein Progress range */}
        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-[#747967]">단백질 달성률</span>
            <span className="font-bold text-[#4F6F00]">{proteinRate}%</span>
          </div>
          <div className="w-full h-2 bg-[#EEF0EA] rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isLunch ? "bg-[#4F6F00]" : "bg-[#6B7F1A]"
              }`}
              style={{ width: `${proteinRate}%` }}
            ></div>
          </div>
        </div>
      </div>

    </article>
  );
}
