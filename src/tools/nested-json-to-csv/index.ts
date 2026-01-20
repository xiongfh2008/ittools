import { Tree } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.nested-json-to-csv.title'),
  path: '/nested-json-to-csv',
  description: translate('tools.nested-json-to-csv.description'),
  keywords: ['nested', 'json', 'to', 'csv', 'convert', 'flatten', 'deep', 'structure'],
  component: () => import('./nested-json-to-csv.vue'),
  icon: Tree,
  createdAt: new Date('2026-01-20'),
});