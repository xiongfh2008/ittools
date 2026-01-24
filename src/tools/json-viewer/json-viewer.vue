<script setup lang="ts">
import JSON5 from 'json5';
import { useStorage } from '@vueuse/core';
import { useValidation } from '@/composable/validation';
import JsonTreeView from '@/components/JsonTreeView.vue';

const rawJson = useStorage('json-prettify:raw-json', '{"hello": "world", "foo": "bar"}');
const indentSize = useStorage('json-prettify:indent-size', 3);
const sortKeys = useStorage('json-prettify:sort-keys', true);

// 解析JSON以供树形视图使用
const parsedJson = computed(() => {
  try {
    if (rawJson.value.trim() === '') { return null; }
    const parsed = JSON5.parse(rawJson.value);
    return sortKeys.value ? sortObjectKeys(parsed) : parsed;
  }
  catch {
    return null;
  }
});

const rawJsonValidation = useValidation({
  source: rawJson,
  rules: [
    {
      validator: v => v === '' || JSON5.parse(v),
      message: 'Provided JSON is not valid.',
    },
  ],
});

// 从json.models.ts复制的sortObjectKeys函数，以防直接导入有困难
function sortObjectKeys<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys) as unknown as T;
  }

  return Object.keys(obj)
    .sort((a, b) => a.localeCompare(b))
    .reduce((sortedObj, key) => {
      sortedObj[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
      return sortedObj;
    }, {} as Record<string, unknown>) as T;
}
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 600px" flex justify-center gap-3>
      <n-form-item label="Sort keys :" label-placement="left" label-width="100">
        <n-switch v-model:value="sortKeys" />
      </n-form-item>
      <n-form-item label="Indent size :" label-placement="left" label-width="100" :show-feedback="false">
        <n-input-number v-model:value="indentSize" min="0" max="10" style="width: 100px" />
      </n-form-item>
    </div>
  </div>

  <n-form-item
    label="Your raw JSON"
    :feedback="rawJsonValidation.message"
    :validation-status="rawJsonValidation.status"
  >
    <c-input-text
      v-model:value="rawJson"
      placeholder="Paste your raw JSON here..."
      rows="20"
      multiline
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      monospace
    />
  </n-form-item>
  <n-form-item label="Interactive prettified version of your JSON">
    <div v-if="parsedJson !== null" class="json-display-container">
      <JsonTreeView :value="parsedJson" :level="0" />
    </div>
    <div v-else class="invalid-json-message">
      Invalid JSON format
    </div>
  </n-form-item>
</template>

<style lang="less" scoped>
.json-display-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
  background-color: #fafafa;
  max-height: 500px;
  overflow-y: auto;
  font-family: monospace;
}

.invalid-json-message {
  color: #ff6b6b;
  padding: 1rem;
  text-align: center;
}
</style>
