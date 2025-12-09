# Correction Loop (纠错循环)

**Correction Loop** 是一个基于 React 开发的个人成长应用，采用独特的**新拟态（Neo-Brutalism）**视觉风格，配以动态的太空主题背景。它的设计初衷是通过"输入、系统、输出、复习"的循环，帮助用户优化学习流程。

## 🚀 核心功能

*   **间隔重复 (词汇系统)**：应用艾宾浩斯遗忘曲线（Ebbinghaus Forgetting Curve）来安排词汇的复习计划。
*   **算法日志 (算法系统)**：支持 Markdown 语法的错题记录器，用于追踪编程挑战和解决方案。
*   **AI 集成**：集成 Google **Gemini API**，在批量导入词汇时自动进行翻译。
*   **可视化分析**：带有热力图和统计数据的仪表盘，用于追踪学习势头。
*   **多主题支持**：动态主题引擎，支持多种配色方案（琥珀色、青柠色、天蓝色、玫瑰色等）以及特定的"深/浅"对比模式。

---

## 📂 项目结构

```text
/
├── components/          # 可复用 UI 组件
│   ├── ui/              # 基础元素：按钮、模态框、主题切换器
│   └── visual/          # 视觉特效：角立方体、星球、循环连接线、热力图
├── contexts/            # 全局状态管理
│   └── AppContext.tsx   # 处理语言 (i18n) 和全局主题状态
├── pages/               # 主要应用视图
│   ├── Dashboard.tsx    # 统计数据与热力图
│   ├── VocabSystem.tsx  # 词汇闪卡逻辑
│   ├── AlgoSystem.tsx   # 算法错题记录逻辑
│   └── UserProfile.tsx  # 用户身份管理
├── services/            # 业务逻辑与数据持久化
│   ├── dataService.ts   # LocalStorage 包装器 (模拟后端)
│   └── geminiService.ts # Google Gemini AI 集成
├── types.ts             # TypeScript 接口 (模型)
├── constants.ts         # 配置 (颜色、间隔、图标)
├── translations.ts      # i18n 字典 (中/英)
├── App.tsx              # 主入口与路由逻辑
└── index.html           # HTML 入口与 Tailwind 配置
```

---

## 💾 存储技术

该应用程序目前使用浏览器端的 **LocalStorage** 来持久化数据，模拟关系型数据库的结构。这使得应用可以在离线状态下运行，无需部署后端服务器即可进行演示。

| 存储键 (Key) | 描述 | JSON 结构 (简化) |
| :--- | :--- | :--- |
| `cl_users` | 用户账户与个人资料 | `[{ id, email, password, name, avatar... }]` |
| `cl_systems` | 学习系统 (卡组/分类) | `[{ id, userId, type, name, theme }]` |
| `cl_items` | 闪卡与题目 | `[{ id, systemId, title, content, status, nextReviewAt }]` |

---

## 🔌 服务接口 (内部 API)

由于没有外部后端服务器，`services/dataService.ts` 充当了 API 层。

### 认证与用户 (Authentication & User)

*   **`register(email, password)`**
    *   在 `cl_users` 中创建新用户。
    *   自动初始化默认系统（词汇和算法）。
*   **`login(email, password)`**
    *   验证凭据是否与存储的用户匹配。
*   **`updateUser(userId, updates)`**
    *   更新个人资料字段（头像、地址、性别等）。

### 系统管理 (System Management)

*   **`getSystems(userId)`**
    *   返回属于特定用户的所有学习循环。
*   **`createSystem(system)`**
    *   为项目创建一个新的容器（例如："西班牙语词汇"、"LeetCode"）。
*   **`deleteSystem(systemId)`**
    *   **级联删除**：从 `cl_items` 中移除该系统以及与之关联的所有项目。

### 项目与复习逻辑 (Item & Review Logic)

*   **`getItems(systemId)`**
    *   获取特定系统的所有项目。
*   **`performReview(itemId, success)`**
    *   **核心逻辑**：处理间隔重复算法。
    *   如果 `success` (记得)：增加 `reviewCount` 并根据 **艾宾浩斯间隔** (1, 2, 4, 7, 15, 30 天) 设置 `nextReviewAt`。
    *   如果 `fail` (忘记)：重置 `reviewCount` 为 0 并将 `nextReviewAt` 设置为立即复习。
*   **`batchCreateItems(items)`**
    *   用于在批量导入期间一次性创建多张卡片。

### AI 服务 (`geminiService.ts`)

*   **`translateWords(words: string[])`**
    *   **输入**：英语单词数组。
    *   **处理**：调用 Google Gemini `gemini-2.5-flash` 模型。
    *   **输出**：返回一个通用对象 `{ "apple": "苹果", ... }` 用于填充卡片内容。

---

## 🎨 设计系统

应用使用 **新拟态 (Neo-Brutalism)** 设计语言，定义如下：

1.  **硬阴影**：`box-shadow: Xpx Xpx 0px 0px #000` (无模糊)。
2.  **粗边框**：大多数元素使用 `border-2` 或 `border-4`。
3.  **高对比度**：使用 `constants.ts` 中定义的严格配色方案。
4.  **等宽字体**：`Space Mono` 用于数据/标签，`Work Sans` 用于标题。

### 主题变量
应用根据选定的主题（如 Amber）将 CSS 变量注入到 `:root` 中：
*   `--color-app-bg`: 深色背景（例如 Amber 主题下的深棕色）。
*   `--color-card-bg`: 卡片背景（稍亮）。
*   `--color-accent`: 主要交互颜色（Amber-600）。
*   `--color-border`: 边框颜色（与强调色或黑色匹配）。
