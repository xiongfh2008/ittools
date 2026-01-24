import type { Plugin } from 'vue';
import { useHead } from '@vueuse/head';

export const headPlugin: Plugin = {
  install: (/* app */) => {
    // 设置基础头部标签
    useHead({
      title: 'IT Tools - Handy online tools for developers',
      meta: [
        {
          name: 'description',
          content: 'Collection of handy online tools for developers, with great UX. IT Tools is a free and open-source collection of handy online tools for developers & people working in IT.',
        },
        {
          name: 'itemprop',
          content: 'name',
        },
        {
          name: 'itemprop',
          content: 'IT Tools - Handy online tools for developers',
        },
        {
          name: 'itemprop',
          content: 'description',
        },
        {
          name: 'itemprop',
          content: 'Collection of handy online tools for developers, with great UX. IT Tools is a free and open-source collection of handy online tools for developers & people working in IT.',
        },
        {
          name: 'google-site-verification',
          content: 'eX5OcXVX8zIWXgwLuk5jKe9aJsjky8A9T9SaYqcfcCs',
        },
        {
          name: 'msvalidate.01',
          content: '637B49DDC622A1D04AD4DDB6345E9C65',
        },
        // Open Graph 标签
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:title',
          content: 'IT Tools - Handy online tools for developers',
        },
        {
          property: 'og:description',
          content: 'Collection of handy online tools for developers, with great UX. IT Tools is a free and open-source collection of handy online tools for developers & people working in IT.',
        },
        {
          property: 'og:image',
          content: '/banner.png?v=2',
        },
        // Twitter Card 标签
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:site',
          content: '@ittoolsdottech',
        },
        {
          name: 'twitter:creator',
          content: '@cthmsst',
        },
        {
          name: 'twitter:title',
          content: 'IT Tools - Handy online tools for developers',
        },
        {
          name: 'twitter:description',
          content: 'Collection of handy online tools for developers, with great UX. IT Tools is a free and open-source collection of handy online tools for developers & people working in IT.',
        },
        {
          name: 'twitter:image',
          content: '/banner.png?v=2',
        },
        {
          name: 'twitter:image:alt',
          content: 'IT Tools - Handy online tools for developers',
        },
      ],
      link: [
        {
          rel: 'author',
          href: 'humans.txt',
        },
        // 规范链接将根据当前URL动态设置
      ],
    });

    // 动态设置 canonical 和 og:url 标签
    const setDynamicUrls = () => {
      if (typeof window !== 'undefined') {
        const currentUrl = window.location.href;

        // 更新 canonical 链接
        useHead({
          link: [
            {
              rel: 'canonical',
              href: currentUrl,
            },
          ],
          meta: [
            {
              property: 'og:url',
              content: currentUrl,
            },
          ],
        });
      }
    };

    // 在页面加载后设置动态URL
    if (typeof window !== 'undefined') {
      if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', setDynamicUrls);
      }
      else {
        setDynamicUrls();
      }
    }
  },
};
