// 所有支持的货币列表
export const currencies = [
  { code: 'CNY', name: '人民币', symbol: '¥' },
  { code: 'USD', name: '美元', symbol: '$' },
  { code: 'EUR', name: '欧元', symbol: '€' },
  { code: 'JPY', name: '日元', symbol: '¥' },
  { code: 'GBP', name: '英镑', symbol: '£' },
  { code: 'AUD', name: '澳元', symbol: 'A$' },
  { code: 'CAD', name: '加元', symbol: 'C$' },
  { code: 'CHF', name: '瑞士法郎', symbol: 'Fr' },
  { code: 'HKD', name: '港币', symbol: 'HK$' },
  { code: 'NZD', name: '新西兰元', symbol: 'NZ$' },
  { code: 'SGD', name: '新加坡元', symbol: 'S$' },
  // ... 更多货币
];

// 获取汇率的API函数
export async function fetchExchangeRates(baseCurrency = 'CNY') {
  try {
    // 这里使用 ExchangeRate-API 的免费API
    // 你需要注册获取API密钥: https://www.exchangerate-api.com/
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/a6463d646a0ef912f23ef813/latest/${baseCurrency}`
    );
    const data = await response.json();
    return data.conversion_rates;
  } catch (error) {
    console.error('获取汇率失败:', error);
    return null;
  }
} 