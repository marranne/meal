/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Check, Plus } from "lucide-react";
import { NutritionMenuItem } from "../types";

interface SelectableMenuItemProps {
  key?: string;
  item: NutritionMenuItem;
  onToggle: (id: string) => void;
}

export default function SelectableMenuItem({
  item,
  onToggle,
}: SelectableMenuItemProps) {
  const isSelected = !!item.selected;

  return (
    <div
      onClick={() => onToggle(item.id)}
      className={`group relative cursor-pointer rounded-[20px] p-4 shadow-[0_2px_12px_rgb(79,111,0,0.01)] transition-all duration-200 flex items-center justify-between border-2 ${
        isSelected
          ? "border-[#4F6F00] bg-white shadow-[0_4px_15px_rgb(79,111,0,0.04)]"
          : "border-[#EEF0EA]/80 bg-white hover:border-[#4F6F00]/40"
      }`}
    >
      {/* Visual background ripple overlay on select */}
      {isSelected && (
        <div className="absolute inset-0 bg-[#4F6F00]/3 rounded-[18px] pointer-events-none"></div>
      )}

      {/* Item info details */}
      <div className="space-y-1">
        <h3 className="font-sans text-[15px] font-bold text-[#2A241A]">{item.name}</h3>
        <p className="text-xs text-[#747967] leading-relaxed hidden sm:block">{item.description}</p>
        
        <div className="flex gap-2 items-center flex-wrap">
          <span className="rounded-md bg-[#FAF7EF] px-2 py-0.5 text-[11px] font-semibold text-[#4F6F00] border border-[#EEF0EA]/50">
            {item.calories} kcal
          </span>
          {item.category === "밥류" && item.carbs && (
            <span className="text-[11px] text-[#747967]">탄수화물 {item.carbs}g</span>
          )}
          {item.allergens && item.allergens.length > 0 && (
            <span className="text-[11px] text-[#747967]">{item.allergens.join(", ")} 함유</span>
          )}
          {item.category === "반찬" && item.protein && (
            <span className="text-[11px] text-[#747967]">단백질 {item.protein}g</span>
          )}
        </div>
      </div>

      {/* Rounded check/plus bubble */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(item.id);
        }}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 shrink-0 ${
          isSelected
            ? "bg-[#4F6F00] text-white shadow-sm"
            : "border-2 border-[#DDE8B2] text-[#6B7F1A] hover:bg-[#FAF7EF]"
        }`}
      >
        {isSelected ? (
          <Check size={16} className="stroke-[3]" />
        ) : (
          <Plus size={16} className="stroke-[2.5]" />
        )}
      </button>
    </div>
  );
}
