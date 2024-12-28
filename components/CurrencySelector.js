import { useState, useEffect } from 'react';
import { currencies } from '../constants/currencies';

export default function CurrencySelector({ onCurrencyChange, defaultCurrency = 'CNY' }) {
    const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // 过滤货币列表
    const filteredCurrencies = currencies.filter(currency => 
        currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (currencyCode) => {
        setSelectedCurrency(currencyCode);
        onCurrencyChange(currencyCode);
        setIsOpen(false);
        setSearchTerm('');
    };

    // 点击外部关闭下拉框
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.currency-selector')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="currency-selector relative inline-block w-full">
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
            >
                <span>
                    {currencies.find(c => c.code === selectedCurrency)?.name} 
                    ({selectedCurrency})
                </span>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="p-2 border-b">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="搜索货币代码或名称..."
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {filteredCurrencies.map((currency) => (
                            <div
                                key={currency.code}
                                onClick={() => handleSelect(currency.code)}
                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between
                                    ${selectedCurrency === currency.code ? 'bg-blue-50 text-blue-600' : ''}`}
                            >
                                <span>{currency.name} ({currency.code})</span>
                                <span>{currency.symbol}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}