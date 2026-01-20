/**
 * 将嵌套JSON对象展平为单层对象，使用点号分隔路径
 */
export function flattenNestedJson(obj: any, prefix: string = '', result: Record<string, any> = {}): Record<string, any> {
  // 检查是否是基本类型或null
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj) || typeof obj === 'string') {
    // 如果传入的是基本类型，直接返回空对象或仅包含前缀的值
    if (prefix && typeof obj !== 'undefined') {
      result[prefix] = obj;
    }
    return result;
  }
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key]) && typeof obj[key] !== 'string') {
        flattenNestedJson(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}

/**
 * 从对象中提取顶级数组及其上下文信息
 */
function extractTopLevelArrayWithContext(obj: any): { array: any[], context: Record<string, any> } | null {
  if (Array.isArray(obj)) {
    return { array: obj, context: {} };
  }
  
  if (obj !== null && typeof obj === 'object') {
    // 首先检查直接子属性是否为数组
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && Array.isArray(obj[key])) {
        // 提取数组，同时保存其他非数组属性作为上下文
        const context: Record<string, any> = {};
        for (const otherKey in obj) {
          if (obj.hasOwnProperty(otherKey) && otherKey !== key) {
            // 对上下文对象进行展平
            const flattenedContext = flattenNestedJson(obj[otherKey], otherKey);
            Object.assign(context, flattenedContext);
          }
        }
        return { array: obj[key], context };
      }
    }
    
    // 如果直接子属性没有数组，递归查找 - 但也要保留上下文
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const subObj = obj[key];
        if (subObj !== null && typeof subObj === 'object') {
          // 检查子对象是否有数组
          for (const subKey in subObj) {
            if (subObj.hasOwnProperty(subKey) && Array.isArray(subObj[subKey])) {
              // 找到了嵌套数组，收集父级上下文和其他属性
              const context: Record<string, any> = {};
              
              // 添加原始顶层属性作为上下文
              for (const topLevelKey in obj) {
                if (obj.hasOwnProperty(topLevelKey) && topLevelKey !== key) {
                  const flattenedContext = flattenNestedJson(obj[topLevelKey], topLevelKey);
                  Object.assign(context, flattenedContext);
                }
              }
              
              // 添加父对象中的非数组属性作为上下文
              for (const parentKey in subObj) {
                if (subObj.hasOwnProperty(parentKey) && parentKey !== subKey) {
                  const flattenedContext = flattenNestedJson(subObj[parentKey], `${key}.${parentKey}`);
                  Object.assign(context, flattenedContext);
                }
              }
              
              return { array: subObj[subKey], context };
            }
          }
        }
        
        // 继续递归查找
        const extracted = extractTopLevelArrayWithContext(obj[key]);
        if (extracted) {
          return extracted;
        }
      }
    }
  }
  
  return null;
}

/**
 * 将嵌套JSON数组转换为CSV格式
 */
export function convertNestedJsonArrayToCsv(input: any): string {
  let array: any[];
  let context: Record<string, any> = {};
  
  if (Array.isArray(input)) {
    array = input;
  } else {
    // 如果输入不是数组，尝试从中提取数组及其上下文
    const extractedResult = extractTopLevelArrayWithContext(input);
    if (!extractedResult) {
      return '';
    }
    array = extractedResult.array;
    context = extractedResult.context;
  }
  
  if (array.length === 0) {
    return '';
  }

  // 展平数组中的所有对象，并添加上下文信息
  // 为数组元素的键添加数组名前缀
  const arrayKeyName = findArrayKeyName(input, array);
  const flattenedObjects = array.map(obj => {
    const flattenedObj = flattenNestedJson(obj, arrayKeyName ? `${arrayKeyName}` : '');  // 为数组元素添加前缀
    // 将上下文信息合并到每个对象中
    return { ...flattenedObj, ...context };
  });
  
  // 获取所有唯一键并排序
  const allKeys = new Set<string>();
  flattenedObjects.forEach(obj => {
    Object.keys(obj).forEach(key => allKeys.add(key));
  });
  const headers = Array.from(allKeys).sort();

  // 序列化值以处理特殊字符
  function serializeValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    let valueAsString: string;
    
    // 如果是对象或数组，序列化为JSON字符串
    if (typeof value === 'object') {
      valueAsString = JSON.stringify(value);
    } else {
      valueAsString = String(value);
    }

    // 转义换行符和回车符
    valueAsString = valueAsString.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    
    // 如果值包含逗号、引号或换行符，则用引号包围
    if (valueAsString.includes(',') || valueAsString.includes('"') || valueAsString.includes('\n')) {
      valueAsString = `"${valueAsString.replace(/"/g, '""')}"`;
    }

    return valueAsString;
  }

  // 构建CSV行
  const rows = flattenedObjects.map(obj => 
    headers.map(header => serializeValue(obj[header]))
  );

  // 返回CSV格式字符串
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * 查找数组在其父对象中的键名
 */
function findArrayKeyName(obj: any, targetArray: any[]): string | null {
  if (obj !== null && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === targetArray) {
          return key;
        }
        // 如果当前值是对象，递归搜索
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          const result = findArrayKeyName(obj[key], targetArray);
          if (result) {
            return `${key}.${result}`;
          }
        }
      }
    }
  }
  return null;
}

/**
 * 检测JSON字符串是否包含嵌套结构
 */
export function hasNestedStructure(json: any): boolean {
  if (Array.isArray(json)) {
    return json.some(item => hasNestedStructure(item));
  } else if (typeof json === 'object' && json !== null) {
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        if (typeof json[key] === 'object' && json[key] !== null && !Array.isArray(json[key])) {
          return true;
        }
        if (Array.isArray(json[key]) && json[key].length > 0) {
          return hasNestedStructure(json[key]);
        }
      }
    }
  }
  return false;
}