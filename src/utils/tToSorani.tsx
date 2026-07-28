const DICTIONARY: Record<string, string> = {
  Released: 'بڵاوکرایەوە',
  Runtime: 'ماوەی فیلم',
  Status: 'بارودۆخ',
  Genres: 'ژانەرەکان',
  Rating: 'هەڵسەنگاندن',
  Votes: 'دەنگەکان',
  Popularity: 'ناوبانگ',
  Overview: 'کورتە',

  Action: 'ئاکشن',
  Adventure: 'سەرکێشی',
  Animation: 'ئەنیمەیشن',
  Comedy: 'کۆمیدی',
  Crime: 'تاوانکاری',
  Documentary: 'دۆکیۆمێنتاری',
  Drama: 'دراما',
  Family: 'خێزانی',
  Fantasy: 'خەیاڵی',
  History: 'مێژوویی',
  Horror: 'ترسناک',
  Music: 'مۆسیقا',
  Mystery: 'نهێنیئامێز',
  Romance: 'ڕۆمانسی',
  'Science Fiction': 'زانستی خەیاڵی',
  'TV Movie': 'فیلمی تەلەفزیۆنی',
  Thriller: 'سیخوڕی / پڕشۆک',
  War: 'جەنگی',
  Western: 'ڕۆژئاوایی',

  US: 'ئەمریکا',
  GB: 'بریتانیا',
  CA: 'کەنەدا',
  FR: 'فەرەنسا',
  DE: 'ئەڵمانیا',
  JP: 'ژاپۆن',
  KR: 'کۆریای باشوور',
  ES: 'ئیسپانیا',
  IT: 'ئیتالیا',
  AU: 'ئوسترالیا',

  en: 'ئینگلیزی',
  fr: 'فەرەنسی',
  de: 'ئەڵمانی',
  es: 'ئیسپانیا',
  ar: 'عەرەبی',
  it: 'ئیتالیایی',
  ja: 'ژاپۆنی',
  ko: 'کۆریایی',
  pt: 'پۆرتوگالی',
  ru: 'ڕوسی',
  zh: 'چینی',
  hi: 'هەندی',
  tr: 'تورکی',
  pl: 'پۆڵندی',
  sv: 'سویدی',
  nl: 'هۆڵەندی',
  fi: 'فینیشی',
  no: 'نۆرسی',
  da: 'دانمارکی',
  el: 'یۆنانیکی',
  ku: 'کوردی',
};

/**
 * Fast O(1) Single Word Translation
 * Uses nullish coalescing (??) which is faster than logical OR (||)
 * because it skips falsy check evaluation for empty strings.
 */
export const tToSorani = (text: string): string => {
  return DICTIONARY[text] ?? text;
};

/**
 * Super Fast Batch Translation for Large Lists
 * Uses a classic 'for' loop (significantly faster than .map() on large arrays)
 */
export const tToSoraniList = (labels: string[]): string[] => {
  const len = labels.length;
  const result = new Array<string>(len); // Pre-allocate memory array size

  for (let i = 0; i < len; i = (i + 1) | 0) {
    // Bitwise formatting for loop optimization
    const item = labels[i];
    result[i] = DICTIONARY[item] ?? item;
  }

  return result;
};
