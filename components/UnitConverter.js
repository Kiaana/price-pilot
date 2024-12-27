import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// 单位说明配置
const unitDescriptions = {
    weight: {
        description: '重量单位换算',
        units: {
            kg: { description: '千克 (kilogram)，基本单位' },
            g: { description: '克 (gram)，1千克 = 1000克' },
            mg: { description: '毫克 (milligram)，1克 = 1000毫克' },
            oz: { description: '盎司 (ounce)，1盎司 ≈ 28.3495克' },
            lb: { description: '磅 (pound)，1磅 = 16盎司 ≈ 453.592克' },
        }
    },
    volume: {
        description: '体积单位换算',
        units: {
            l: { description: '升 (liter)，基本单位' },
            ml: { description: '毫升 (milliliter)，1升 = 1000毫升' },
            gal: { description: '加仑 (gallon)，1加仑 ≈ 3.78541升' },
            floz: { description: '液体盎司 (fluid ounce)，1液体盎司 ≈ 29.5735毫升' },
            cup: { description: '杯 (cup)，1杯 ≈ 236.588毫升' },
        }
    },
    area: {
        description: '面积单位换算',
        units: {
            'm2': { description: '平方米 (square meter)，基本单位' },
            'cm2': { description: '平方厘米 (square centimeter)，1平方米 = 10000平方厘米' },
            'ft2': { description: '平方英尺 (square foot)，1平方英尺 ≈ 0.092903平方米' },
        }
    },
    length: {
        description: '长度单位换算',
        units: {
            m: { description: '米 (meter)，基本单位' },
            cm: { description: '厘米 (centimeter)，1米 = 100厘米' },
            mm: { description: '毫米 (millimeter)，1厘米 = 10毫米' },
            km: { description: '千米 (kilometer)，1千米 = 1000米' },
            in: { description: '英寸 (inch)，1英寸 = 2.54厘米' },
            ft: { description: '英尺 (foot)，1英尺 = 12英寸' },
        }
    },
    piece: {
        description: '计件单位换算',
        units: {
            piece: { description: '个，基本计数单位' },
            pack: { description: '包，根据商品包装规格定义' },
            bottle: { description: '瓶，液体包装单位' },
            bag: { description: '袋，散装商品包装单位' },
            box: { description: '盒，包装盒单位' },
            dozen: { description: '打，1打 = 12个' },
            case: { description: '箱，大包装单位' },
        }
    }
};

// 常用转换快捷方式配置
const commonConversions = {
    weight: [
        { from: 'kg', to: 'g', name: '千克转克' },
        { from: 'g', to: 'mg', name: '克转毫克' },
        { from: 'kg', to: 'lb', name: '千克转磅' },
        { from: 'lb', to: 'oz', name: '磅转盎司' },
        { from: 'g', to: 'oz', name: '克转盎司' },
    ],
    volume: [
        { from: 'l', to: 'ml', name: '升转毫升' },
        { from: 'l', to: 'gal', name: '升转加仑' },
        { from: 'ml', to: 'floz', name: '毫升转液体盎司' },
        { from: 'l', to: 'cup', name: '升转杯' },
        { from: 'ml', to: 'cup', name: '毫升转杯' },
    ],
    length: [
        { from: 'm', to: 'cm', name: '米转厘米' },
        { from: 'km', to: 'm', name: '千米转米' },
        { from: 'm', to: 'ft', name: '米转英尺' },
        { from: 'cm', to: 'in', name: '厘米转英寸' },
        { from: 'ft', to: 'in', name: '英尺转英寸' },
    ],
    area: [
        { from: 'm2', to: 'cm2', name: '平方米转平方厘米' },
        { from: 'm2', to: 'ft2', name: '平方米转平方英尺' },
        { from: 'ft2', to: 'cm2', name: '平方英尺转平方厘米' },
    ],
};

export default function UnitConverter({ unitSystem }) {
    const [selectedType, setSelectedType] = useState('weight');
    const [fromUnit, setFromUnit] = useState('');
    const [toUnit, setToUnit] = useState('');
    const [value, setValue] = useState('');
    const [result, setResult] = useState(null);
    const [recentConversions, setRecentConversions] = useState([]);
    const [showBatchConvert, setShowBatchConvert] = useState(false);
    const [batchValues, setBatchValues] = useState('');
    const [batchResults, setBatchResults] = useState([]);
    const [showFormula, setShowFormula] = useState(false);
    const [showUnitInfo, setShowUnitInfo] = useState(false);
    const [customShortcuts, setCustomShortcuts] = useState([]);
    const [showAddShortcut, setShowAddShortcut] = useState(false);
    const [newShortcut, setNewShortcut] = useState({
        name: '',
        from: '',
        to: '',
        type: ''
    });
    const [showHistory, setShowHistory] = useState(true);

    // 当单位类型改变时，重置单位选择和批量转换结果
    useEffect(() => {
        const units = Object.keys(unitSystem[selectedType].conversions);
        setFromUnit(units[0]);
        setToUnit(units[1] || units[0]);
        setValue('');
        setResult(null);
        setBatchResults([]); // 清除批量转换结果
        setBatchValues(''); // 清除批量转换输入
    }, [selectedType, unitSystem]);

    const handleConvert = (e) => {
        e.preventDefault();
        
        if (!value || isNaN(value) || value <= 0) {
            toast.error('请输入有效的数值');
            return;
        }

        const fromRate = unitSystem[selectedType].conversions[fromUnit].rate;
        const toRate = unitSystem[selectedType].conversions[toUnit].rate;
        const baseValue = value * fromRate;
        const convertedValue = baseValue / toRate;

        const newConversion = {
            from: {
                value: parseFloat(value),
                unit: fromUnit,
                displayName: unitSystem[selectedType].conversions[fromUnit].displayName
            },
            to: {
                value: convertedValue,
                unit: toUnit,
                displayName: unitSystem[selectedType].conversions[toUnit].displayName
            },
            type: unitSystem[selectedType].displayName,
            timestamp: new Date().toISOString()
        };

        setResult(convertedValue);
        setRecentConversions(prev => {
            const updated = [newConversion, ...prev].slice(0, 5);
            localStorage.setItem('recentConversions', JSON.stringify(updated));
            return updated;
        });
    };

    // 加载最近的转换记录
    useEffect(() => {
        const saved = localStorage.getItem('recentConversions');
        if (saved) {
            setRecentConversions(JSON.parse(saved));
        }
    }, []);

    const formatNumber = (num) => {
        return new Intl.NumberFormat('zh-CN', {
            maximumSignificantDigits: 6,
            minimumSignificantDigits: 1
        }).format(num);
    };

    // 计算并显示转换公式
    const getConversionFormula = () => {
        if (!fromUnit || !toUnit) return null;
        
        const fromRate = unitSystem[selectedType].conversions[fromUnit].rate;
        const toRate = unitSystem[selectedType].conversions[toUnit].rate;
        const fromName = unitSystem[selectedType].conversions[fromUnit].displayName;
        const toName = unitSystem[selectedType].conversions[toUnit].displayName;
        
        const formula = `1 ${fromName} = ${(fromRate / toRate).toFixed(6)} ${toName}`;
        const calculation = value ? `${value} × ${(fromRate / toRate).toFixed(6)} = ${formatNumber(result)}` : '';
        
        return { formula, calculation };
    };

    // 处理批量转换
    const handleBatchConvert = () => {
        const values = batchValues.split('\n').map(v => v.trim()).filter(v => v);
        
        if (values.length === 0) {
            toast.error('请输入要转换的数值');
            return;
        }

        const fromRate = unitSystem[selectedType].conversions[fromUnit].rate;
        const toRate = unitSystem[selectedType].conversions[toUnit].rate;
        
        const results = values.map(v => {
            const num = parseFloat(v);
            if (isNaN(num) || num <= 0) return { input: v, error: '无效数值' };
            
            const baseValue = num * fromRate;
            const converted = baseValue / toRate;
            return {
                input: v,
                result: converted,
                error: null
            };
        });

        setBatchResults(results);
    };

    // 处理快捷方式转换
    const handleQuickConvert = (from, to) => {
        setFromUnit(from);
        setToUnit(to);
        if (value) {
            const fromRate = unitSystem[selectedType].conversions[from].rate;
            const toRate = unitSystem[selectedType].conversions[to].rate;
            const baseValue = value * fromRate;
            const convertedValue = baseValue / toRate;
            setResult(convertedValue);
        }
    };

    // 加载自定义快捷方式
    useEffect(() => {
        const saved = localStorage.getItem('customShortcuts');
        if (saved) {
            setCustomShortcuts(JSON.parse(saved));
        }
    }, []);

    // 保存自定义快捷方式
    const handleAddShortcut = () => {
        if (!newShortcut.name || !newShortcut.from || !newShortcut.to || !newShortcut.type) {
            toast.error('请填写完整的快捷方式信息');
            return;
        }

        const updated = [...customShortcuts, newShortcut];
        setCustomShortcuts(updated);
        localStorage.setItem('customShortcuts', JSON.stringify(updated));
        setNewShortcut({ name: '', from: '', to: '', type: '' });
        setShowAddShortcut(false);
        toast.success('快捷方式添加成功');
    };

    // 删除自定义快捷方式
    const handleDeleteShortcut = (index) => {
        const updated = customShortcuts.filter((_, i) => i !== index);
        setCustomShortcuts(updated);
        localStorage.setItem('customShortcuts', JSON.stringify(updated));
        toast.success('快捷方式已删除');
    };

    // 删除单条转换记录
    const handleDeleteConversion = (index) => {
        const updated = recentConversions.filter((_, i) => i !== index);
        setRecentConversions(updated);
        localStorage.setItem('recentConversions', JSON.stringify(updated));
        toast.success('记录已删除');
    };

    // 清除所有转换记录
    const handleClearHistory = () => {
        setRecentConversions([]);
        localStorage.removeItem('recentConversions');
        toast.success('所有记录已清除');
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">单位转换计算器</h2>
            
            {/* 单位类型选择 */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                        选择单位类型
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowUnitInfo(!showUnitInfo)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                    >
                        {showUnitInfo ? '隐藏单位说明' : '查看单位说明'}
                    </button>
                </div>
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

                {/* 单位说明 */}
                {showUnitInfo && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                            {unitDescriptions[selectedType].description}
                        </h3>
                        <div className="space-y-2">
                            {Object.entries(unitDescriptions[selectedType].units).map(([unit, info]) => (
                                <div key={unit} className="text-sm">
                                    <span className="font-medium">{unit}:</span> {info.description}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 常用转换快捷方式 */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                        常用转换
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowAddShortcut(!showAddShortcut)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                    >
                        {showAddShortcut ? '取消添加' : '添加快捷方式'}
                    </button>
                </div>

                {/* 添加快捷方式表单 */}
                {showAddShortcut && (
                    <div className="mb-4 bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    快捷方式名称
                                </label>
                                <input
                                    type="text"
                                    value={newShortcut.name}
                                    onChange={(e) => setNewShortcut({ ...newShortcut, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="例如：公斤转磅"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    单位类型
                                </label>
                                <select
                                    value={newShortcut.type}
                                    onChange={(e) => setNewShortcut({ ...newShortcut, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">选择类型</option>
                                    {Object.entries(unitSystem).map(([type, info]) => (
                                        <option key={type} value={type}>
                                            {info.displayName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    从
                                </label>
                                <select
                                    value={newShortcut.from}
                                    onChange={(e) => setNewShortcut({ ...newShortcut, from: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">选择单位</option>
                                    {newShortcut.type && Object.entries(unitSystem[newShortcut.type].conversions).map(([code, unit]) => (
                                        <option key={code} value={code}>
                                            {unit.displayName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    到
                                </label>
                                <select
                                    value={newShortcut.to}
                                    onChange={(e) => setNewShortcut({ ...newShortcut, to: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">选择单位</option>
                                    {newShortcut.type && Object.entries(unitSystem[newShortcut.type].conversions).map(([code, unit]) => (
                                        <option key={code} value={code}>
                                            {unit.displayName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={handleAddShortcut}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                添加
                            </button>
                        </div>
                    </div>
                )}

                {/* 快捷方式列表 */}
                <div className="flex flex-wrap gap-2">
                    {/* 系统预设快捷方式 */}
                    {commonConversions[selectedType]?.map((conversion, index) => (
                        <button
                            key={`preset-${index}`}
                            onClick={() => handleQuickConvert(conversion.from, conversion.to)}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 transition-colors duration-150"
                        >
                            {conversion.name}
                        </button>
                    ))}
                    {/* 自定义快捷方式 */}
                    {customShortcuts
                        .filter(shortcut => shortcut.type === selectedType)
                        .map((shortcut, index) => (
                            <div key={`custom-${index}`} className="relative group">
                                <button
                                    onClick={() => handleQuickConvert(shortcut.from, shortcut.to)}
                                    className="px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-md text-sm text-blue-700 transition-colors duration-150"
                                >
                                    {shortcut.name}
                                </button>
                                <button
                                    onClick={() => handleDeleteShortcut(index)}
                                    className="absolute -top-2 -right-2 hidden group-hover:block bg-red-100 hover:bg-red-200 rounded-full p-1"
                                >
                                    <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                </div>
            </div>

            {/* 转换表单 */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="space-x-2">
                        <button
                            type="button"
                            onClick={() => setShowBatchConvert(!showBatchConvert)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {showBatchConvert ? '单个转换' : '批量转换'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowFormula(!showFormula)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {showFormula ? '隐藏公式' : '显示公式'}
                        </button>
                    </div>
                </div>

                {/* 转换公式显示 */}
                {showFormula && result !== null && (
                    <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                        <div className="text-sm text-blue-700">
                            <span className="font-medium">转换公式：</span>
                            {getConversionFormula()?.formula}
                        </div>
                        {getConversionFormula()?.calculation && (
                            <div className="text-sm text-blue-700">
                                <span className="font-medium">计算过程：</span>
                                {getConversionFormula()?.calculation}
                            </div>
                        )}
                    </div>
                )}

                {!showBatchConvert ? (
                    // 单个转换表单
                    <form onSubmit={handleConvert} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* 输入值和单位 */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    从
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="输入数值"
                                        step="any"
                                        min="0"
                                    />
                                    <select
                                        value={fromUnit}
                                        onChange={(e) => setFromUnit(e.target.value)}
                                        className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {Object.entries(unitSystem[selectedType].conversions).map(([code, unit]) => (
                                            <option key={code} value={code}>
                                                {unit.displayName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 转换箭头 */}
                            <div className="flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>

                            {/* 目标单位 */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    到
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={result !== null ? formatNumber(result) : ''}
                                        readOnly
                                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm"
                                        placeholder="转换结果"
                                    />
                                    <select
                                        value={toUnit}
                                        onChange={(e) => setToUnit(e.target.value)}
                                        className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {Object.entries(unitSystem[selectedType].conversions).map(([code, unit]) => (
                                            <option key={code} value={code}>
                                                {unit.displayName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            转换
                        </button>
                    </form>
                ) : (
                    // 批量转换表单
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    输入多个数值（每行一个）
                                </label>
                                <textarea
                                    value={batchValues}
                                    onChange={(e) => setBatchValues(e.target.value)}
                                    className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="例如：&#13;&#10;1&#13;&#10;2.5&#13;&#10;3.7"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    转换结果
                                </label>
                                <div className="w-full h-40 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md overflow-y-auto">
                                    {batchResults.length > 0 ? (
                                        batchResults.map((item, index) => (
                                            <div key={index} className={`text-sm ${item.error ? 'text-red-600' : 'text-gray-900'}`}>
                                                {item.error ? 
                                                    `${item.input}: ${item.error}` :
                                                    `${item.input} ${unitSystem[selectedType]?.conversions[fromUnit]?.displayName || ''} = ${formatNumber(item.result)} ${unitSystem[selectedType]?.conversions[toUnit]?.displayName || ''}`
                                                }
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm text-gray-500 text-center py-4">
                                            转换结果将显示在这里
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <select
                                value={fromUnit}
                                onChange={(e) => setFromUnit(e.target.value)}
                                className="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                {Object.entries(unitSystem[selectedType].conversions).map(([code, unit]) => (
                                    <option key={code} value={code}>
                                        {unit.displayName}
                                    </option>
                                ))}
                            </select>
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <select
                                value={toUnit}
                                onChange={(e) => setToUnit(e.target.value)}
                                className="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                {Object.entries(unitSystem[selectedType].conversions).map(([code, unit]) => (
                                    <option key={code} value={code}>
                                        {unit.displayName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={handleBatchConvert}
                            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            批量转换
                        </button>
                    </div>
                )}
            </div>

            {/* 最近的转换记录 */}
            {recentConversions.length > 0 && !showBatchConvert && (
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-4">
                            <h3 className="text-sm font-medium text-gray-700">最近的转换记录</h3>
                            <button
                                type="button"
                                onClick={() => setShowHistory(!showHistory)}
                                className="text-sm text-blue-600 hover:text-blue-700"
                            >
                                {showHistory ? '隐藏记录' : '显示记录'}
                            </button>
                        </div>
                        {showHistory && (
                            <button
                                type="button"
                                onClick={handleClearHistory}
                                className="text-sm text-red-600 hover:text-red-700"
                            >
                                清除所有记录
                            </button>
                        )}
                    </div>
                    {showHistory && (
                        <div className="space-y-2">
                            {recentConversions.map((conversion, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-lg p-3 text-sm relative group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-600">
                                                {formatNumber(conversion.from.value)} {conversion.from.displayName}
                                            </span>
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                            <span className="text-gray-900 font-medium">
                                                {formatNumber(conversion.to.value)} {conversion.to.displayName}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-gray-500">
                                                {conversion.type}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteConversion(index)}
                                                className="hidden group-hover:block text-red-500 hover:text-red-700 transition-colors duration-150"
                                                title="删除记录"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {new Date(conversion.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 