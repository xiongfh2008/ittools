import messages from '@intlify/unplugin-vue-i18n/messages';
import { get } from '@vueuse/core';
import type { Plugin } from 'vue';
import { createI18n } from 'vue-i18n';

// 获取浏览器语言并映射到支持的语言列表
function getBrowserLocale(): string {
  // 获取浏览器首选语言
  const browserLocale = navigator.language.toLowerCase();
  
  // 支持的语言列表，防止 messages 为 undefined
  const supportedLocales = messages ? Object.keys(messages) : [];
  
  // 检查完整语言标签是否存在 (如 'zh-cn')
  if (supportedLocales.includes(browserLocale)) {
    return browserLocale;
  }
  
  // 检查语言代码前缀是否存在 (如 'zh' for 'zh-cn' or 'zh-tw')
  const languageCode = browserLocale.split('-')[0];
  if (supportedLocales.includes(languageCode)) {
    return languageCode;
  }
  
  // 如果没找到匹配的语言，则返回英语作为默认语言
  return 'en';
}

const i18n = createI18n({
  legacy: false,
  locale: getBrowserLocale(),
  fallbackLocale: 'en',
  messages,
});

export const i18nPlugin: Plugin = {
  install: (app) => {
    app.use(i18n);
  },
};

export const translate = function (localeKey: string) {
  const hasKey = i18n.global.te(localeKey, get(i18n.global.locale));
  return hasKey ? i18n.global.t(localeKey) : localeKey;
};