<script setup lang="ts">
import { ref, watch } from 'vue';
import { Copy } from '@vicons/tabler';
import JSON5 from 'json5';
import { convertNestedJsonArrayToCsv } from './nested-json-to-csv.service';
import { useCopy } from '@/composable/copy';
import { withDefaultOnError } from '@/utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const input = ref('');
const outputRef = ref('');
const inputValidationRules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: 'Provided JSON is not valid.',
  },
];

// 监听输入变化并执行转换
watch(input, (newValue) => {
  const result = withDefaultOnError(() => {
    if (newValue === '') {
      return '';
    }
    const parsed = JSON5.parse(newValue);
    return convertNestedJsonArrayToCsv(parsed);
  }, '');

  // 更新输出引用，以便下载功能可以访问
  outputRef.value = result;
}, { immediate: true });

// 下载CSV文件的函数
function downloadCsv() {
  if (!outputRef.value) {
    // 显示错误消息而不是alert
    console.error('请先转换JSON数据');
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

// 复制到剪贴板功能
const { copy } = useCopy({ source: outputRef, createToast: false });
const isJustCopied = ref(false);

async function copyToClipboard() {
  await copy();
  isJustCopied.value = true;
  setTimeout(() => {
    isJustCopied.value = false;
  }, 2000);
}
</script>

<template>
  <div class="nested-json-to-csv-container">
    <div class="input-section">
      <c-input-text
        v-model:value="input"
        placeholder="Paste your nested JSON here..."
        label="Your nested JSON"
        rows="20"
        autosize
        raw-text
        multiline
        test-id="input"
        :validation-rules="inputValidationRules"
        monospace
        class="json-input"
      />
    </div>

    <div class="controls-section">
      <div class="output-header">
        <div class="output-label">
          Flattened CSV version of your nested JSON
        </div>
        <n-button :disabled="!outputRef" secondary class="download-btn" @click="downloadCsv">
          Download CSV
        </n-button>
      </div>
    </div>

    <div class="output-section">
      <div class="output-wrapper">
        <c-card class="csv-output-container">
          <div class="csv-content-wrapper">
            <pre class="csv-output">{{ outputRef }}</pre>
          </div>
          <div class="copy-button-overlay">
            <c-tooltip v-if="outputRef" :tooltip="isJustCopied ? 'Copied!' : 'Copy to clipboard'" position="left">
              <c-button circle important:h-10 important:w-10 @click="copyToClipboard">
                <n-icon size="22" :component="Copy" />
              </c-button>
            </c-tooltip>
          </div>
        </c-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nested-json-to-csv-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 100%;
}

.input-section {
  width: 100%;
}

.json-input {
  width: 100%;
}

.controls-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.output-label {
  font-weight: bold;
  white-space: nowrap;
}

.download-btn {
  flex-shrink: 0;
}

.output-section {
  width: 100%;
  overflow: hidden;
}

.output-wrapper {
  width: 100%;
  overflow-x: auto;
}

.csv-output-container {
  position: relative;
  width: 100%;
  min-height: 200px;
  max-height: 60vh;
  overflow: auto;
  padding: 0;
}

.csv-content-wrapper {
  padding: 10px;
  max-width: 100%;
  overflow-x: auto;
}

.csv-output {
  white-space: pre;
  word-wrap: break-word;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  overflow-x: auto;
  min-height: 180px;
}

.copy-button-overlay {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 10;
}
</style>
