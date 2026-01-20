<template>
  <div class="json-tree-view">
    <div 
      v-if="isObject(value) || isArray(value)"
      class="json-node"
    >
      <div 
        class="node-header"
        @click="toggleExpanded"
        :class="{ expandable: isExpandable }"
      >
        <span 
          v-if="isExpandable" 
          class="expand-icon"
          :class="{ expanded: expanded }"
        >
          {{ expanded ? '▼' : '▶' }}
        </span>
        <span class="node-key" v-if="showKey">{{ keyName }}:</span>
        <span class="node-type">{{ nodeType }}</span>
        <span v-if="isArray(value)" class="node-length">[{{ value.length }}]</span>
        <span v-if="isObject(value)" class="node-length">{...}</span>
      </div>
      
      <div v-show="expanded" class="node-children">
        <template v-for="(val, key) in value" :key="key">
          <JsonTreeView
            :value="val"
            :key-name="key"
            :level="level + 1"
          />
        </template>
      </div>
    </div>
    <div 
      v-else 
      class="json-leaf"
      :style="{ marginLeft: level * 20 + 'px' }"
    >
      <span class="node-key" v-if="showKey">{{ keyName }}:</span>
      <span class="node-value" :class="valueTypeClass">{{ formattedValue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  value: any;
  keyName?: string;
  level?: number;
}

const props = withDefaults(defineProps<Props>(), {
  level: 0,
});

const expanded = ref(true);

const showKey = computed(() => props.level > 0 && props.keyName !== undefined);

const isObject = (val: any) => val !== null && typeof val === 'object' && !Array.isArray(val);
const isArray = (val: any) => Array.isArray(val);
const isNull = (val: any) => val === null;
const isUndefined = (val: any) => val === undefined;
const isString = (val: any) => typeof val === 'string';
const isNumber = (val: any) => typeof val === 'number';
const isBoolean = (val: any) => typeof val === 'boolean';

const nodeType = computed(() => {
  if (isNull(props.value)) return 'null';
  if (isUndefined(props.value)) return 'undefined';
  if (isArray(props.value)) return 'array';
  if (isObject(props.value)) return 'object';
  return typeof props.value;
});

const isExpandable = computed(() => isObject(props.value) || isArray(props.value));

const formattedValue = computed(() => {
  if (isString(props.value)) {
    return `"${props.value}"`;
  } else if (isBoolean(props.value) || isNull(props.value)) {
    return String(props.value);
  } else if (isNumber(props.value)) {
    return props.value;
  }
  return String(props.value);
});

const valueTypeClass = computed(() => {
  if (isString(props.value)) return 'string-value';
  if (isNumber(props.value)) return 'number-value';
  if (isBoolean(props.value)) return 'boolean-value';
  if (isNull(props.value)) return 'null-value';
  return 'other-value';
});

const toggleExpanded = () => {
  if (isExpandable.value) {
    expanded.value = !expanded.value;
  }
};
</script>

<style scoped>
.json-tree-view {
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
}

.node-header {
  cursor: pointer;
  padding: 2px 0;
  display: flex;
  align-items: center;
}

.node-header.expandable {
  cursor: pointer;
}

.expand-icon {
  margin-right: 5px;
  transition: transform 0.2s;
  width: 16px;
  display: inline-block;
  text-align: center;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.node-key {
  color: #800;
  margin-right: 5px;
  font-weight: bold;
}

.node-type {
  color: #008;
  font-style: italic;
  margin-right: 5px;
}

.node-length {
  color: #080;
  font-size: 0.9em;
}

.node-leaf {
  padding: 2px 0;
  display: flex;
  align-items: center;
}

.string-value {
  color: #080;
}

.number-value {
  color: #00f;
}

.boolean-value {
  color: #808;
}

.null-value {
  color: #888;
}

.node-children {
  padding-left: 20px;
  border-left: 1px dashed #ccc;
}
</style>