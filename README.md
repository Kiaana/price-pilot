# Price Pilot 智能商品单价对比工具

Price Pilot 是一个基于 Next.js 开发的智能商品单价对比工具,帮助用户轻松对比不同商品的性价比。

## ✨ 主要特性

- 🧮 智能计算 - 自动转换单位和货币,精确计算单价
- 💱 多币种支持 - 支持人民币、美元、欧元等多种货币自由转换
- 📊 单位转换 - 内置重量、体积、面积等多种计量单位换算
- 💾 本地存储 - 自动保存数据,随时查看比价历史
- 📱 响应式设计 - 完美支持移动端和桌面端显示

## 🛠️ 技术栈

- Next.js
- React
- Tailwind CSS
- React Hot Toast
- LocalStorage API

## 🚀 快速开始

1. 克隆项目

    ```bash
    git clone https://github.com/yourusername/price-pilot.git
    cd price-pilot
    ```

2. 安装依赖

    ```bash
    npm install
    # 或
    yarn install
    ```

3. 启动开发服务器

    ```bash
    npm run dev
    # 或
    yarn dev
    ```

4. 打开浏览器访问 `http://localhost:3000`

## 📦 项目结构

```text
price-pilot/
├── components/           # React 组件
│   ├── AddProductForm/   # 添加商品表单
│   ├── CurrencySelector/ # 货币选择器
│   ├── ProductList/      # 商品列表
│   ├── UnitManager/      # 单位管理
│   └── UnitConverter/    # 单位转换
├── pages/               # Next.js 页面
│   └── index.js        # 主页面
├── public/             # 静态资源
└── styles/             # 样式文件
```

## 💡 主要功能

### 商品管理

- 添加商品信息(名称、价格、数量、单位)
- 支持多种计量单位
- 自动计算单价并排序
- 删除商品记录

### 单位转换

- 支持重量、体积、面积、长度等单位转换
- 内置常用单位换算关系
- 可自定义添加新单位
- 保存转换历史记录

### 货币转换

- 支持多种国际货币
- 实时转换不同币种价格
- 统一基准货币显示

## 📝 使用说明

1. 选择基准货币
2. 添加商品信息
3. 系统自动计算并显示单价
4. 可按名称、价格、单价等排序
5. 使用单位转换工具进行快速换算

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 📄 开源协议

本项目基于 MIT 协议开源。
