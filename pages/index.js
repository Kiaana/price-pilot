import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Toaster, toast } from 'react-hot-toast';
import AddProductForm from '../components/AddProductForm';
import CurrencySelector from '../components/CurrencySelector';
import ProductList from '../components/ProductList';
import UnitManager from '../components/UnitManager';
import UnitConverter from '../components/UnitConverter';

// 从 UnitManager 中导入默认单位系统
const defaultUnitSystem = {
  weight: {
    baseUnit: 'kg',
    displayName: '重量',
    conversions: {
      kg: { rate: 1, displayName: '千克' },
      g: { rate: 0.001, displayName: '克' },
      mg: { rate: 0.000001, displayName: '毫克' },
      oz: { rate: 0.0283495, displayName: '盎司' },
      lb: { rate: 0.453592, displayName: '磅' },
    }
  },
  volume: {
    baseUnit: 'l',
    displayName: '体积',
    conversions: {
      l: { rate: 1, displayName: '升' },
      ml: { rate: 0.001, displayName: '毫升' },
      gal: { rate: 3.78541, displayName: '加仑' },
      floz: { rate: 0.0295735, displayName: '液体盎司' },
      cup: { rate: 0.236588, displayName: '杯' },
    }
  },
  area: {
    baseUnit: 'm2',
    displayName: '面积',
    conversions: {
      'm2': { rate: 1, displayName: '平方米' },
      'cm2': { rate: 0.0001, displayName: '平方厘米' },
      'ft2': { rate: 0.092903, displayName: '平方英尺' },
    }
  },
  length: {
    baseUnit: 'm',
    displayName: '长度',
    conversions: {
      m: { rate: 1, displayName: '米' },
      cm: { rate: 0.01, displayName: '厘米' },
      mm: { rate: 0.001, displayName: '毫米' },
      km: { rate: 1000, displayName: '千米' },
      in: { rate: 0.0254, displayName: '英寸' },
      ft: { rate: 0.3048, displayName: '英尺' },
    }
  },
  piece: {
    baseUnit: 'piece',
    displayName: '计件',
    conversions: {
      piece: { rate: 1, displayName: '个' },
      pack: { rate: 1, displayName: '包' },
      bottle: { rate: 1, displayName: '瓶' },
      bag: { rate: 1, displayName: '袋' },
      box: { rate: 1, displayName: '盒' },
      dozen: { rate: 12, displayName: '打' },
      case: { rate: 1, displayName: '箱' },
    }
  }
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState('CNY');
  const [unitSystem, setUnitSystem] = useState(defaultUnitSystem);
  const [showUnitManager, setShowUnitManager] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [showAddForm, setShowAddForm] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // 从 localStorage 加载数据
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedUnitSystem = localStorage.getItem('unitSystem');
    const savedCurrency = localStorage.getItem('baseCurrency');

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    if (savedUnitSystem) {
      setUnitSystem(JSON.parse(savedUnitSystem));
    }
    if (savedCurrency) {
      setBaseCurrency(savedCurrency);
    }
  }, []);

  // 保存数据到 localStorage
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('unitSystem', JSON.stringify(unitSystem));
    localStorage.setItem('baseCurrency', baseCurrency);
  }, [products, unitSystem, baseCurrency]);

  const handleAddProduct = (product) => {
    setProducts([...products, product]);
  };

  const handleRemoveProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleCurrencyChange = (currency) => {
    setBaseCurrency(currency);
  };

  const handleUpdateUnits = (updatedSystem) => {
    setUnitSystem(updatedSystem);
    // 保存到 localStorage
    localStorage.setItem('unitSystem', JSON.stringify(updatedSystem));
    // 可以添加成功提示
    toast.success('单位系统已更新');
  };

  // 添加滚动监听
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Price Pilot - 智能商品单价对比工具</title>
        <meta name="description" content="轻松对比不同商品的单价，支持多种货币和计量单位" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#4CAF50',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#E53E3E',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* 固定顶部导航栏 */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
          }`}>
          <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className={`text-xl font-bold transition-colors duration-300 ${isScrolled ? 'text-gray-800' : 'text-white'
                }`}>
                Price Pilot
              </h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowUnitManager(!showUnitManager)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${showUnitManager
                      ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                      : isScrolled ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>单位管理</span>
                </button>

                <button
                  onClick={() => setShowConverter(!showConverter)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${showConverter
                      ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                      : isScrolled ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span>单位转换</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white pt-24 pb-16">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                智能商品单价对比
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                轻松对比不同商品的性价比，让您的每一分钱都物有所值
              </p>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          {/* 功能区域容器 */}
          <div className="space-y-4">
            {/* 单位管理区域 */}
            <div className={`transition-all duration-300 overflow-hidden bg-white rounded-xl shadow-lg ${showUnitManager ? 'max-h-[1000px] opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-4'
              }`}>
              <UnitManager
                unitSystem={unitSystem}
                onUpdateUnits={handleUpdateUnits}
              />
            </div>

            {/* 单位转换区域 */}
            <div className={`transition-all duration-300 overflow-hidden bg-white rounded-xl shadow-lg ${showConverter ? 'max-h-[2000px] opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-4'
              }`}>
              <UnitConverter unitSystem={unitSystem} />
            </div>

            {/* 添加商品区域 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">添加商品</h2>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showAddForm ? '收起' : '展开'}
                  </button>
                </div>
                <div className={`transition-all duration-300 ${showAddForm ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}>
                  <AddProductForm onAddProduct={handleAddProduct} unitSystem={unitSystem} />
                </div>
              </div>
            </div>

            {/* 货币选择和商品列表区域 */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="w-full sm:w-1/3 md:w-1/4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      选择基准货币
                    </label>
                    <CurrencySelector
                      onCurrencyChange={handleCurrencyChange}
                      defaultCurrency={baseCurrency}
                    />
                  </div>
                  <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                    <span className="text-blue-700 font-medium">
                      当前基准货币：{baseCurrency}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">商品对比</h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      共 {products.length} 个商品
                    </span>
                  </div>
                </div>

                <ProductList
                  products={products}
                  baseCurrency={baseCurrency}
                  onRemoveProduct={handleRemoveProduct}
                  unitSystem={unitSystem}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-600">Price Pilot © 2024 - 让对比购物更简单</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}