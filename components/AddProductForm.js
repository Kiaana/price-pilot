import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AddProductForm({ onAddProduct, unitSystem }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        unit: '',
        currency: 'CNY',
        description: ''
    });

    const currencies = {
        CNY: '¥',
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥'
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.price || !formData.quantity || !formData.unit) {
            toast.error('请填写所有必填字段');
            return;
        }

        if (isNaN(formData.price) || formData.price <= 0) {
            toast.error('请输入有效的价格');
            return;
        }

        if (isNaN(formData.quantity) || formData.quantity <= 0) {
            toast.error('请输入有效的数量');
            return;
        }

        const newProduct = {
            ...formData,
            price: parseFloat(formData.price),
            quantity: parseFloat(formData.quantity),
            timestamp: new Date().toISOString()
        };

        onAddProduct(newProduct);
        toast.success('商品添加成功');
        
        // 重置表单
        setFormData({
            name: '',
            price: '',
            quantity: '',
            unit: formData.unit, // 保留上次选择的单位
            currency: formData.currency, // 保留上次选择的货币
            description: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 获取当前选择的单位类型的所有单位
    const getUnitsForType = (type) => {
        return Object.entries(unitSystem[type].conversions).map(([code, unit]) => ({
            code,
            displayName: unit.displayName
        }));
    };

    // 获取所有可用的单位
    const getAllUnits = () => {
        return Object.keys(unitSystem).flatMap(type => 
            getUnitsForType(type).map(unit => ({
                ...unit,
                type,
                groupName: unitSystem[type].displayName
            }))
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息区域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        商品名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="输入商品名称"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        商品描述
                    </label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="添加商品描述（可选）"
                    />
                </div>
            </div>

            {/* 价格和数量区域 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        价格 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">
                                {currencies[formData.currency]}
                            </span>
                        </div>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        货币
                    </label>
                    <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {Object.entries(currencies).map(([code, symbol]) => (
                            <option key={code} value={code}>
                                {code} ({symbol})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        数量 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="输入数量"
                        step="any"
                        min="0"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        单位 <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">选择单位</option>
                        {Object.entries(unitSystem).map(([type, info]) => (
                            <optgroup key={type} label={info.displayName}>
                                {Object.entries(info.conversions).map(([code, unit]) => (
                                    <option key={code} value={code}>
                                        {unit.displayName}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    添加商品
                </button>
            </div>

        </form>
    );
}