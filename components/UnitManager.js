import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { defaultUnitSystem } from '../constants/unitSystem';

export default function UnitManager({ unitSystem, onUnitSystemChange }) {
    const [selectedType, setSelectedType] = useState('weight');
    const [showAddUnit, setShowAddUnit] = useState(false);
    const [newUnit, setNewUnit] = useState({
        code: '',
        displayName: '',
        rate: '',
        type: 'weight'
    });

    const handleAddUnit = (e) => {
        e.preventDefault();
        
        if (!newUnit.code || !newUnit.displayName || !newUnit.rate || !newUnit.type) {
            toast.error('请填写完整的单位信息');
            return;
        }

        const rate = parseFloat(newUnit.rate);
        if (isNaN(rate) || rate <= 0) {
            toast.error('请输入有效的转换率');
            return;
        }

        const updatedSystem = { ...unitSystem };
        updatedSystem[newUnit.type].conversions[newUnit.code] = {
            rate,
            displayName: newUnit.displayName
        };

        onUnitSystemChange(updatedSystem);
        setNewUnit({ code: '', displayName: '', rate: '', type: selectedType });
        setShowAddUnit(false);
        toast.success('单位添加成功');
    };

    const handleDeleteUnit = (type, unitCode) => {
        if (unitCode === unitSystem[type].baseUnit) {
            toast.error('不能删除基准单位');
            return;
        }

        const updatedSystem = { ...unitSystem };
        delete updatedSystem[type].conversions[unitCode];
        onUnitSystemChange(updatedSystem);
        toast.success('单位删除成功');
    };

    const resetToDefault = () => {
        if (window.confirm('确定要重置所有单位设置吗？这将删除所有自定义单位。')) {
            onUnitSystemChange(defaultUnitSystem);
            toast.success('单位系统已重置为默认设置');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">单位管理</h2>
                <button
                    onClick={resetToDefault}
                    className="text-sm text-gray-600 hover:text-red-600 transition-colors duration-150"
                >
                    重置为默认
                </button>
            </div>

            {/* 单位类型选择 */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    {Object.entries(unitSystem).map(([type, info]) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150
                                ${selectedType === type
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {info.displayName}
                        </button>
                    ))}
                </div>
            </div>

            {/* 当前类型的单位列表 */}
            <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                        {unitSystem[selectedType].displayName}单位列表
                        <span className="text-gray-500 text-xs ml-2">
                            (基准单位: {unitSystem[selectedType].baseUnit})
                        </span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(unitSystem[selectedType].conversions).map(([code, unit]) => (
                            <div
                                key={code}
                                className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm"
                            >
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {unit.displayName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {code} ({unit.rate} {unitSystem[selectedType].baseUnit})
                                    </div>
                                </div>
                                {code !== unitSystem[selectedType].baseUnit && (
                                    <button
                                        onClick={() => handleDeleteUnit(selectedType, code)}
                                        className="text-gray-400 hover:text-red-600 transition-colors duration-150"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 添加新单位 */}
            <div>
                {!showAddUnit ? (
                    <button
                        onClick={() => setShowAddUnit(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        添加新单位
                    </button>
                ) : (
                    <form onSubmit={handleAddUnit} className="space-y-4 bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    单位代码
                                </label>
                                <input
                                    type="text"
                                    value={newUnit.code}
                                    onChange={(e) => setNewUnit({ ...newUnit, code: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="例如: ml"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    显示名称
                                </label>
                                <input
                                    type="text"
                                    value={newUnit.displayName}
                                    onChange={(e) => setNewUnit({ ...newUnit, displayName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="例如: 毫升"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    转换率 (相对于基准单位)
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={newUnit.rate}
                                    onChange={(e) => setNewUnit({ ...newUnit, rate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="例如: 0.001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    单位类型
                                </label>
                                <select
                                    value={newUnit.type}
                                    onChange={(e) => setNewUnit({ ...newUnit, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {Object.entries(unitSystem).map(([type, info]) => (
                                        <option key={type} value={type}>
                                            {info.displayName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowAddUnit(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                取消
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                添加
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
} 