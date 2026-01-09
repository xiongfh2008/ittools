<script setup lang="ts">
const { availableLocales, locale } = useI18n();

const localesLong: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  no: 'Norsk',
  pt: 'Português',
  ru: 'Русский',
  uk: 'Українська',
  zh: '中文',
  vi: 'Tiếng Việt',
  ar: 'العربية',
  bn: 'বাংলা',
  he: 'עברית',
  hi: 'हिन्दी',
  id: 'Bahasa Indonesia',
  it: 'Italiano',
  ja: '日本語',
  ko: '한국어',
  ms: 'Bahasa Melayu',
  th: 'ไทย',
  ur: 'اردو',
  tr: 'Türkçe',
  fa: 'فارسی',
  mr: 'मराठी',
  ta: 'தமிழ்',
  pl: 'Polski',
  te: 'తెలుగు',
  ne: 'नेपाली',
  da: 'Dansk',
  fi: 'Suomi',
  nl: 'Nederlands',
};

const localeOptions = computed(() =>
  availableLocales.map(locale => ({
    label: localesLong[locale] ?? locale,
    value: locale,
  })),
);
</script>

<template>
  <c-select
    v-model:value="locale"
    :options="localeOptions"
    placeholder="Select a language"
    w-140px
  />
</template>
