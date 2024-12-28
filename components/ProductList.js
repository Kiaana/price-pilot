import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { fetchExchangeRates } from '../constants/currencies';

// 分组类型配置
const groupTypes = {
    weight: {
        key: 'weight',
        label: '重量类商品',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
        )
    },
    volume: {
        key: 'volume',
        label: '体积类商品',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        )
    },
    area: {
        key: 'area',
        label: '面积类商品',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
            </svg>
        )
    },
    length: {
        key: 'length',
        label: '长度类商品',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        )
    },
    piece: {
        key: 'piece',
        label: '计件类商品',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        )
    }
};

export default function ProductList({ products, baseCurrency, onRemoveProduct, unitSystem }) {
    const [sortConfig, setSortConfig] = useState({ key: 'unitPrice', direction: 'asc' });
    const [convertedProducts, setConvertedProducts] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [groupedProducts, setGroupedProducts] = useState({});
    const [activeTab, setActiveTab] = useState(null);
    const [exchangeRates, setExchangeRates] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 获取最新汇率
    useEffect(() => {
        const getLatestRates = async () => {
            setIsLoading(true);
            const rates = await fetchExchangeRates(baseCurrency);
            if (rates) {
                setExchangeRates(rates);
                setIsLoading(false);
            } else {
                toast.error('获取汇率失败，请稍后重试');
                setIsLoading(false);
            }
        };

        getLatestRates();
    }, [baseCurrency]);

    // 转换商品数据
    useEffect(() => {
        // 如果还没有汇率数据，等待数据加载
        if (!exchangeRates) {
            return;
        }

        const convertProducts = () => {
            let converted = products.map(product => {
                try {
                    // 货币转换
                    const productRate = exchangeRates[product.currency] || 1;
                    const baseRate = exchangeRates[baseCurrency] || 1;
                    const convertedPrice = product.price * (baseRate / productRate);
                    
                    // 获取单位信息和转换
                    let unitType = null;
                    let conversionRate = 1;
                    let baseUnit = '';
                    let displayName = '';

                    // 查找单位所属类型和转换率
                    for (const [type, info] of Object.entries(unitSystem)) {
                        if (info.conversions[product.unit]) {
                            unitType = type;
                            conversionRate = info.conversions[product.unit].rate;
                            baseUnit = info.baseUnit;
                            displayName = info.displayName;
                            break;
                        }
                    }

                    // 如果找不到对应的单位类型，默认为计件
                    if (!unitType) {
                        unitType = 'piece';
                        conversionRate = 1;
                        baseUnit = unitSystem.piece.baseUnit;
                        displayName = unitSystem.piece.displayName;
                    }

                    // 计算标准化数量和单价
                    const standardQuantity = product.quantity * conversionRate;
                    const unitPrice = convertedPrice / standardQuantity;

                    return { 
                        ...product, 
                        convertedPrice, 
                        unitPrice,
                        standardQuantity,
                        unitType,
                        baseUnit,
                        displayName
                    };
                } catch (error) {
                    console.error('转换商品数据时出错:', error);
                    return {
                        ...product,
                        convertedPrice: product.price,
                        unitPrice: product.price / product.quantity,
                        standardQuantity: product.quantity,
                        unitType: 'piece',
                        baseUnit: 'piece',
                        displayName: '计件'
                    };
                }
            });

            // 应用排序
            converted.sort((a, b) => {
                if (sortConfig.direction === 'asc') {
                    return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
                }
                return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
            });

            // 按单位类型分组
            const grouped = converted.reduce((acc, product) => {
                const type = product.unitType;
                if (!acc[type]) {
                    acc[type] = [];
                }
                acc[type].push(product);
                return acc;
            }, {});

            setConvertedProducts(converted);
            setGroupedProducts(grouped);

            // 设置默认活动标签
            if (!activeTab || !grouped[activeTab]) {
                const firstGroupWithProducts = Object.keys(grouped)[0];
                setActiveTab(firstGroupWithProducts);
            }
        };

        convertProducts();
    }, [products, baseCurrency, sortConfig, unitSystem, exchangeRates]);

    // 排序处理函数
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // 获取排序图标
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        return sortConfig.direction === 'asc' ? (
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    const handleDelete = (index) => {
        if (deleteConfirm === index) {
            onRemoveProduct(index);
            setDeleteConfirm(null);
            toast.success('商品已删除');
        } else {
            setDeleteConfirm(index);
            setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('zh-CN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    if (convertedProducts.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4M12 20V4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">暂无商品</h3>
                <p className="mt-1 text-sm text-gray-500">开始添加商品来进行比较</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* 分组标签导航 */}
            <div className="border-b border-gray-200">
                <nav className="flex -mb-px space-x-8 overflow-x-auto">
                    {Object.entries(groupTypes).map(([type, info]) => {
                        const isActive = activeTab === type;
                        const hasProducts = groupedProducts[type]?.length > 0;
                        
                        if (!hasProducts) return null;

                        return (
                            <button
                                key={type}
                                onClick={() => setActiveTab(type)}
                                className={`
                                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                                    ${isActive
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                                    transition-colors duration-200
                                `}
                            >
                                {info.icon}
                                <span>{info.label}</span>
                                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                    {groupedProducts[type]?.length || 0}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* 当前分组的商品列表 */}
            {activeTab && groupedProducts[activeTab] && (
                <div className="bg-white rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>商品名称</span>
                                            {getSortIcon('name')}
                                        </div>
                                    </th>
                                    <th scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('convertedPrice')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>价格 ({baseCurrency})</span>
                                            {getSortIcon('convertedPrice')}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        数量
                                    </th>
                                    <th scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('unitPrice')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>单价 ({baseCurrency}/{unitSystem[activeTab].baseUnit})</span>
                                            {getSortIcon('unitPrice')}
                                        </div>
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">操作</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {groupedProducts[activeTab].map((product, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {formatPrice(product.convertedPrice)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                原价: {product.price} {product.currency}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {product.quantity} {product.unit}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {formatPrice(product.standardQuantity)} {unitSystem[activeTab].baseUnit}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatPrice(product.unitPrice)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                每{unitSystem[activeTab].baseUnit}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDelete(index)}
                                                className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors duration-150
                                                    ${deleteConfirm === index
                                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        : 'text-gray-400 hover:text-red-600'
                                                    }`}
                                            >
                                                {deleteConfirm === index ? '确认删除？' : '删除'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}