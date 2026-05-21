/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export type MenuCategoryFilter = "전체" | "밥류" | "국/찌개" | "반찬" | "디저트";

interface MenuFilterChipsProps {
  selectedCategory: MenuCategoryFilter;
  onSelectCategory: (category: MenuCategoryFilter) => void;
}

export default function MenuFilterChips({
  selectedCategory,
  onSelectCategory,
}: MenuFilterChipsProps) {
  const categories: MenuCategoryFilter[] = [
    "전체",
    "밥류",
    "국/찌개",
    "반찬",
    "디저트",
  ];

  return (
    <nav className="flex gap-2 overflow-x-auto hide-scrollbar py-2 -mx-4 px-4 sm:-mx-0 sm:px-0">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all active:scale-95 duration-100 shadow-sm ${
              isSelected
                ? "bg-[#4F6F00] text-white"
                : "bg-white text-[#747967] hover:bg-[#EEF0EA] border border-[#EEF0EA]"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </nav>
  );
}
