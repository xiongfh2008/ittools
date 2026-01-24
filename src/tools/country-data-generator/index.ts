import { Globe } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.country-data-generator.title'),
  path: '/country-data-generator',
  description: translate('tools.country-data-generator.description'),
  keywords: ['country', 'data', 'generator', 'personal', 'company', 'information', 'mock', 'test', 'faker'],
  component: () => import('./country-data-generator.vue'),
  icon: Globe,
  createdAt: new Date('2024-01-24'),
});
