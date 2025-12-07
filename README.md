
# Correction Loop

Correction Loop is a React-based personal growth application using a Neo-Brutalism design style. It helps users manage vocabulary with spaced repetition, track algorithm problems, and create custom review loops.

## Database Schema (PostgreSQL)

To deploy with a real backend, use the following schema:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) DEFAULT 'Asig',
    avatar_url TEXT,
    address VARCHAR(255),
    birth_date DATE,
    gender VARCHAR(20), -- 'male', 'female', 'other', 'secret'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE systems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'vocab', 'algo', 'custom'
    name VARCHAR(100) NOT NULL,
    theme_color VARCHAR(50) DEFAULT 'amber',
    icon VARCHAR(50) DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE review_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_id UUID REFERENCES systems(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL, -- The word or problem title
    content TEXT, -- Translation, Markdown notes, or details
    group_name VARCHAR(100), -- e.g., "Chapter 1"
    
    -- Spaced Repetition Fields
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'learning', 'mastered'
    review_count INTEGER DEFAULT 0,
    next_review_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Interfaces

### `POST /api/auth/register`
- Body: `{ email, password }`
- Response: `{ token, user }`

### `POST /api/auth/login`
- Body: `{ email, password }`
- Response: `{ token, user }`

### `GET /api/users/me`
- Headers: `Authorization: Bearer <token>`
- Response: `User` (including profile fields)

### `PUT /api/users/me`
- Headers: `Authorization: Bearer <token>`
- Body: `{ name, avatar, address, birthDate, gender }`
- Description: Updates user profile information.
- Response: `User`

### `POST /api/upload/avatar`
- Headers: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- Body: Form data with file field `file`
- Description: Uploads an image file to Object Storage (S3/OSS).
- Response: 
  ```json
  {
    "url": "https://your-bucket.s3.region.amazonaws.com/uploads/user_123_avatar.jpg"
  }
  ```

### `DELETE /api/users/me`
- Headers: `Authorization: Bearer <token>`
- Description: Deletes user account and all data.
- Response: `204 No Content`

### `GET /api/systems`
- Headers: `Authorization: Bearer <token>`
- Response: `System[]`

### `POST /api/systems`
- Headers: `Authorization: Bearer <token>`
- Body: `{ name, type, theme }`
- Response: `System`

### `DELETE /api/systems/:id`
- Headers: `Authorization: Bearer <token>`
- Description: Deletes a system and all its associated review items.
- SQL: `DELETE FROM systems WHERE id = $1 AND user_id = $2;`
- Response: `204 No Content`

### `POST /api/systems/:id/items/batch`
- Body: `{ items: [{ title, content, group_name }] }`
- Response: `ReviewItem[]`

### `PATCH /api/items/:id/review`
- Body: `{ success: boolean }`
- Response: `ReviewItem` (updated dates)














<!-- 
你觉得这项目在主页ui上还有什么可以修改的（你只需要给建议，不用直接更改）
Gemini 3 Pro Preview
Ran for 77s
lightbulb
Thought for 77 seconds
这是一个非常棒的项目！结合了 Neo-Brutalism（新拟态/新粗野主义） 和 太空/星际 主题，视觉冲击力很强。
基于目前的代码和视觉效果，为了让主页（登录/注册页）更加惊艳且符合“纠错循环（Correction Loop）”的核心概念，我有以下几个 UI/UX 方面的优化建议：
1. 强化“流动”与“循环”的视觉隐喻 (The "Loop" Metaphor)
目前四周有四个方块（INPUT, SYSTEM, OUTPUT, REVIEW）和连接线，这很好，但可以更动感：
流动的管道 (Flowing Pipelines)：连接这四个方块的虚线不应该是静止的，建议添加 stroke-dashoffset 动画，让虚线像数据流一样顺时针不断流动。这能直观地传达“循环”的概念。
脉冲信号 (Data Pulse)：偶尔可以在线条上生成一个高亮的“光点”，从 Input 跑到 Review，模拟数据处理的过程。
2. 增强交互反馈 (Micro-Interactions)
让背景的装饰物与用户的操作产生联系，而不仅仅是背景：
表单与方块联动：
当用户聚焦 Email 输入框 时，左上角的 INPUT 方块 可以高亮或变大。
当用户点击 登录按钮 时，右上角的 SYSTEM 方块 开始旋转加速。
登录成功的一瞬间，OUTPUT 方块 发光。
视差效果 (Parallax)：目前的星空背景是自动飘动的。如果能加入鼠标跟随的视差效果（鼠标移动时，近处的方块移动快，远处的星星移动慢），会瞬间增加空间的深邃感。
3. 深化 Neo-Brutalism 风格细节
新粗野主义强调高对比、粗边框和几何感：
更硬朗的阴影：目前的 shadow-nb 看起来还不错，但可以尝试移除所有模糊（blur），使用纯粹的硬阴影（solid drop shadow），例如 box-shadow: 6px 6px 0px 0px #000。这会让 UI 看起来更“脆”、更有力量感。
装饰性网格 (Grid Lines)：在背景的最底层叠加一层极淡的工程网格线（就像蓝图纸或示波器背景），配合偶尔闪烁的坐标数字，能增强“系统”、“工程”和“严谨”的氛围。
Glitch / CRT 效果：在 Logo (Asig) 或者卡片的边框上，添加轻微的 RGB 色散 或 Glitch（故障）效果，增加一种复古科幻（Retro-SciFi）的味道。
4. 排版与文字 (Typography)
打字机效果：副标题 "Optimization Protocol Initiated" 既然是代码风格的文字，可以加上打字机动画（Typewriter effect），让它像终端机一样一个字一个字打出来，最后光标闪烁。
标签化设计：在卡片的角落或边缘增加一些看起来像“系统状态标签”的小元素，比如 [STATUS: ONLINE], [v1.0.2], [SECURE]，使用极小的等宽字体，增加精密仪器的感觉。
5. 登录卡片的质感
毛玻璃的边界：目前的卡片背景是纯色的（或轻微渐变）。可以尝试让卡片的边框（Border）本身发光，或者给卡片加一个极细的内发光（Inner Glow），让它看起来像是一块悬浮在太空中的显示屏。
加载状态可视化：当用户点击登录等待 API 响应时，不要只转圈圈。可以让连接四个方块的线条疯狂加速流动，或者卡片本身进行一次“系统自检”的进度条扫描。





 -->
