/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// KST (Korea Standard Time) Date getter
export function getTodayKST(): Date {
  // AI Studio backend might be in UTC, convert to Asia/Seoul
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000; // in ms
  const utcNow = now.getTime() + tzOffset;
  const kstOffset = 9 * 60 * 60 * 1000; // KST is UTC+9
  return new Date(utcNow + kstOffset);
}

// "M월 D일 요일" Format
export function formatKoreanDate(date: Date): string {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dayName = days[date.getDay()];
  return `${m}월 ${d}일 ${dayName}요일`;
}

// "YYYYMMDD" Date Key Format
export function formatDateKey(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

// Get Monday to Friday dates for the week that the 'date' belongs to
export function getWeekDates(baseDate: Date): Date[] {
  const result: Date[] = [];
  const currentDay = baseDate.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  // Distance from Monday
  const distance = currentDay === 0 ? -6 : 1 - currentDay;
  
  // Calculate Monday
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() + distance);
  
  // Create Mon to Fri
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    result.push(d);
  }
  return result;
}

// "M월 N주차" Parser
export function getWeekOfMonth(date: Date): string {
  const m = date.getMonth() + 1;
  
  // To evaluate week of month: 
  // Let's calculate the ordinal week index in that month.
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0-6
  
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // offset so Monday is index 0
  const dayOfMonth = date.getDate();
  const weekNum = Math.ceil((dayOfMonth + offset) / 7);
  
  return `${m}월 ${weekNum}주차`;
}

// Default Selected Date logic:
// If weekday (Mon-Fri), return today.
// If weekend (Sat-Sun), return next Monday.
export function getDefaultSelectedDate(): { date: Date; isWeekendAdjustment: boolean } {
  const today = getTodayKST();
  const day = today.getDay(); // 0 = Sun, 6 = Sat
  
  if (day === 0) { // Sunday
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + 1);
    return { date: nextMonday, isWeekendAdjustment: true };
  } else if (day === 6) { // Saturday
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + 2);
    return { date: nextMonday, isWeekendAdjustment: true };
  }
  
  return { date: today, isWeekendAdjustment: false };
}

// NEIS Dish Name Sanitizer
export function cleanDishName(rawName: string): string {
  if (!rawName) return "";
  
  let cleaned = rawName;
  
  // 1. Remove HTML line breaks if any
  cleaned = cleaned.replace(/<br\s*\/?>/gi, " ");
  
  // 2. Remove trailing/wrapping numeric allergy markers like (1.2.5.10.) or (13.) or (대두.밀.우유)
  // Usually in NEIS format: "치즈돈까스(1.2.5.6.10.12.18)"
  cleaned = cleaned.replace(/\([\d\s\.]+\)/g, ""); // matches numbers and dots inside parenthesis
  cleaned = cleaned.replace(/\([가-힣\s,\/·\.]+\)/g, ""); // matches words inside parenthesis if any
  
  // 3. Remove asterisk marks (e.g. "*친환경현미밥", "*수제돈까스")
  cleaned = cleaned.replace(/\*/g, "");
  
  // 4. Remove unnecessary dots and middle dots (. or ㆍ etc.)
  cleaned = cleaned.replace(/\./g, "");
  cleaned = cleaned.replace(/ㆍ/g, "");
  cleaned = cleaned.replace(/•/g, "");
  cleaned = cleaned.replace(/·/g, "");
  
  // 5. Remove common bullet characters/special chars like - , * , _
  cleaned = cleaned.replace(/[-*_•▶■●◆▲○]/g, "");
  
  // 6. Clean double/excessive whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  
  return cleaned;
}
