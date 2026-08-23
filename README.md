# 手帐 Archive

一个手机端手帐归档 App 原型，用原生 HTML / CSS / JavaScript 实现。它用于记录每日手帐页面、管理本子、管理素材，并支持上传图片后调用 remove.bg 抠图，加白描边后展示在卡片和详情页中。

## 功能

- 记录页
  - 日历首页
  - 点击日期查看当天归档手帐
  - 未选择日期时查看当月归档手帐
  - 通过底部加号上传照片，并进入手帐扫描/裁切流程

- 本子页
  - 本子列表
  - 支持全部 / 正在写 / 已归档筛选
  - 可新建本子或从素材库添加本子
  - 支持编辑封面、名称、品牌、规格和状态

- 素材页
  - 支持本子、便签、贴纸、胶带等素材分类
  - 新增素材时可上传图片
  - 上传后通过 remove.bg 抠图，并添加白描边
  - 支持素材详情编辑
  - 长按素材进入删除模式，点击右上角叉号后确认删除

- 我的页
  - 展示归档手帐页数、素材数量、本子数量和今年消费
  - 数据卡片会同步展示最早添加的手帐、本子和非本子素材

## 本地运行

这个项目需要本地服务运行，因为 remove.bg API key 不能直接写在前端页面里。

1. 安装 Node.js

2. 在项目根目录创建 `.env.local`

```bash
REMOVE_BG_API_KEY=你的_remove_bg_api_key
```

3. 启动本地服务

```bash
npm start
```

4. 打开浏览器访问

```text
http://localhost:5177/
```

## 文件说明

- `index.html`：主页面结构
- `styles.css`：样式
- `script.js`：交互逻辑
- `server.js`：本地静态服务和 remove.bg 代理接口
- `package.json`：本地启动脚本
- `handbook-app-single.html`：单文件版本，已内嵌 CSS / JS
- `assets/empty-states/`：缺省状态图片
- `.env.local.example`：环境变量模板
- `.gitignore`：忽略本地密钥和依赖目录

## 注意

- 不要上传 `.env.local`，里面包含真实 API key。
- 用户上传后的本地数据暂时保存在浏览器 `localStorage` 中。
- 如果更换浏览器、清除网站数据、切换端口，之前的本地测试数据可能不会显示。
- `handbook-app-single.html` 适合发给别人快速预览静态界面，但 remove.bg 抠图功能需要通过本地服务运行。

