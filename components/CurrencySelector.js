import { useState } from 'react';

export default function CurrencySelector({ onCurrencyChange, defaultCurrency = 'CNY' }) {
    const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);

    const handleChange = (e) => {
        setSelectedCurrency(e.target.value);
        onCurrencyChange(e.target.value);
    };

    const currencies = [
        { code: 'CNY', name: '人民币' },
        { code: 'USD', name: '美元' },
        { code: 'EUR', name: '欧元' },
        { code: 'JPY', name: '日元' },
        { code: 'GBP', name: '英镑' },
        { code: 'KRW', name: '韩元' },
        { code: 'HKD', name: '港币' }
        // ... 其他货币
    ];

    return (
        <div className="relative inline-block w-full"> {/* 添加相对定位 */}
            <select
                value={selectedCurrency}
                onChange={handleChange}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
                {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                        {currency.name} ({currency.code})
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"> {/* 添加下拉箭头 */}
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
            </div>
        </div>
    );
}