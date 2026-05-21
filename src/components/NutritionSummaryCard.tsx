/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface NutritionSummaryCardProps {
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function NutritionSummaryCard({
  totalCalories,
  protein,
  carbs,
  fat,
}: NutritionSummaryCardProps) {
  
  // Set percentage limit safeguards (e.g. recommend daily lunch intake targets: protein 25g, carbs 100g, fat 20g)
  const proteinMax = 40;
  const carbsMax = 150;
  const fatMax = 35;

  const proteinPct = Math.min(100, Math.round((protein / proteinMax) * 100));
  const carbsPct = Math.min(100, Math.round((carbs / carbsMax) * 100));
  const fatPct = Math.min(100, Math.round((fat / fatMax) * 100));

  return (
    <section className="nutrition-card relative overflow-hidden rounded-[24px] border border-[#EEF0EA] bg-white p-6 shadow-[0_4px_25px_rgb(79,111,0,0.03)]">
      {/* Tiny decorative gradient blur in background */}
      <div className="absolute top-0 right-0 h-28 w-28 rounded-full bg-[#DDE8B2]/40 blur-2xl pointer-events-none"></div>

      <h2 className="text-lg font-bold text-[#4F6F00] mb-0.5">오늘의 선택 영양</h2>
      <p className="text-xs text-[#747967] mb-4">선택한 메뉴의 총 영양성분입니다.</p>

      {/* Large Big Number Calorie Counter */}
      <div className="flex items-baseline gap-1.5 mb-5">
        <span className="text-3xl font-extrabold text-[#2A241A] tracking-tight">{totalCalories}</span>
        <span className="text-sm font-semibold text-[#747967]">kcal</span>
      </div>

      {/* Progress indicators for Protein, Carbs, Fat */}
      <div className="space-y-4">
        
        {/* Protein (단백질) */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-[#2A241A]/80">단백질</span>
            <span className="text-[#2A241A]">{protein} g</span>
          </div>
          <div className="w-full h-2 bg-[#FAF7EF] rounded-full overflow-hidden border border-[#EEF0EA]/60">
            <div 
              className="h-full bg-[#4F6F00] rounded-full transition-all duration-300"
              style={{ width: `${proteinPct}%` }}
            ></div>
          </div>
        </div>

        {/* Carbs (탄수화물) */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-[#2A241A]/80">탄수화물</span>
            <span className="text-[#2A241A]">{carbs} g</span>
          </div>
          <div className="w-full h-2 bg-[#FAF7EF] rounded-full overflow-hidden border border-[#EEF0EA]/60">
            <div 
              className="h-full bg-[#6B7F1A] rounded-full transition-all duration-300"
              style={{ width: `${carbsPct}%` }}
            ></div>
          </div>
        </div>

        {/* Fat (지방) */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-[#2A241A]/80">지방</span>
            <span className="text-[#2A241A]">{fat} g</span>
          </div>
          <div className="w-full h-2 bg-[#FAF7EF] rounded-full overflow-hidden border border-[#EEF0EA]/60">
            <div 
              className="h-full bg-[#7a2e77] rounded-full transition-all duration-300"
              style={{ width: `${fatPct}%` }}
            ></div>
          </div>
        </div>

      </div>
    </section>
  );
}
