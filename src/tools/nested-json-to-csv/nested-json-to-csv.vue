<script setup lang="ts">
import JSON5 from 'json5';
import { convertNestedJsonArrayToCsv } from './nested-json-to-csv.service';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';
import { ref, computed } from 'vue';

const outputRef = ref('');

function transformer(value: string) {
  const result = withDefaultOnError(() => {
    if (value === '') {
      return '';
    }
    const parsed = JSON5.parse(value);
    return convertNestedJsonArrayToCsv(parsed);
  }, '');
  
  // 更新输出引用，以便下载功能可以访问
  outputRef.value = result;
  return result;
}

// 下载CSV文件的函数
function downloadCsv() {
  if (!outputRef.value) {
    alert('请先转换JSON数据');
    return;
  }
  
  // 为CSV添加BOM（Byte Order Mark）以确保中文字符正确显示
  const BOM = '\uFEFF';
  const csvContent = BOM + outputRef.value;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'converted-data.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: 'Provided JSON is not valid.',
  },
];
</script>

<template>
  <div class="flex flex-col gap-3">
    <format-transformer
      input-label="Your nested JSON"
      input-placeholder="Paste your nested JSON here..."
      output-label="Flattened CSV version of your nested JSON"
      :input-validation-rules="rules"
      :transformer="transformer"
    />
    <n-button @click="downloadCsv" :disabled="!outputRef" secondary>
      Download CSV
    </n-button>
  </div>
</template>