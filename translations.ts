
import { Language } from './types';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Auth
    'app.title': 'CORRECTION LOOP',
    'app.subtitle': 'Neo-Brutalism Growth Tool',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.login': 'Enter Loop',
    'auth.register': 'Start Journey',
    'auth.needAccount': 'Need an account? Register',
    'auth.haveAccount': 'Have an account? Login',
    'auth.initializing': 'INITIALIZING CORRECTION LOOP...',
    
    // Sidebar
    'nav.dashboard': 'Dashboard',
    'nav.systems': 'Your Systems',
    'nav.newSystem': '+ New System',
    'nav.logout': 'Log Out',
    'nav.deleteAccount': 'Delete Account',
    'nav.settings': 'Settings',

    // Dashboard
    'dash.welcome': 'Welcome back,',
    'dash.heatmapTitle': 'Activity Log',
    'dash.totalReviews': 'Total Reviews',
    'dash.activeDays': 'Active Days',
    'dash.itemsMastered': 'Mastered Items',
    'dash.todayDue': 'Due Today',
    'dash.less': 'Less',
    'dash.more': 'More',

    // User Profile
    'profile.title': 'User Profile',
    'profile.edit': 'Edit Profile',
    'profile.username': 'Username',
    'profile.email': 'Email',
    'profile.password': 'Password',
    'profile.address': 'Address',
    'profile.birthDate': 'Birth Date',
    'profile.age': 'Age',
    'profile.gender': 'Gender',
    'profile.gender.male': 'Male',
    'profile.gender.female': 'Female',
    'profile.gender.other': 'Other',
    'profile.gender.secret': 'Secret',
    'profile.notSet': 'Not set',
    'profile.edit.title': 'Edit User Profile',
    'profile.btn.save': 'Save Changes',
    'profile.btn.cancel': 'Cancel',
    'profile.avatar.modalTitle': 'Edit Avatar',
    'profile.avatar.upload': 'Upload Image',
    'profile.avatar.link': 'Image Link (URL)',
    'profile.avatar.save': 'Update Avatar',
    'profile.avatar.placeholder': 'https://example.com/image.png',

    // Vocab System
    'vocab.due': 'Due',
    'vocab.mastered': 'Mastered',
    'vocab.showDue': 'Show Due Only',
    'vocab.showAll': 'Show All',
    'vocab.import': '+ Import',
    'vocab.emptyReview': 'No cards due for review! 🎉',
    'vocab.emptyAll': 'No cards added yet.',
    'vocab.flip': 'Tap to flip',
    'vocab.btn.forgot': 'Forgot',
    'vocab.btn.gotIt': 'Got it',
    'vocab.import.title': 'Import Vocabulary',
    'vocab.import.desc': "Format: Chapter Title followed by words on new lines. Separate chapters with '---' or new titles.",
    'vocab.import.placeholder': "Chapter 1\napple\nbanana\n\nChapter 2\ncomputer\ncode",
    'vocab.import.btn': 'Start Import',
    'vocab.import.textColors': 'Text Color',
    'vocab.import.processing': 'AI Processing...',

    // Algo System
    'algo.newProblem': '+ New Problem',
    'algo.editNotes': 'Edit Notes',
    'algo.markReviewed': 'Mark Reviewed',
    'algo.reviews': 'Reviews',
    'algo.last': 'Last',
    'algo.never': 'Never',
    'algo.modal.editTitle': 'Edit Problem',
    'algo.modal.newTitle': 'New Problem',
    'algo.form.title': 'Problem Title',
    'algo.form.notes': 'Notes / Solution (Markdown)',
    'algo.form.placeholder': 'e.g. Two Sum',
    'algo.btn.save': 'Save Item',

    // Create System Modal
    'sys.modal.title': 'Create New Loop',
    'sys.form.name': 'System Name',
    'sys.form.placeholder': 'e.g. Life Mistakes',
    'sys.form.type': 'Type',
    'sys.form.theme': 'Theme',
    'sys.btn.create': 'Create',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.lang.en': 'English',
    'settings.lang.zh': 'Chinese (中文)',
    'settings.select': 'Select Language',
    'settings.viewProfile': 'View User Profile',
    'settings.editProfile': 'Edit User Profile',
    'settings.close': 'Close',

    // Misc
    'common.selectSystem': 'Select or create a system to begin correction.',
    'common.user': 'User',
    'common.yearsOld': 'years old'
  },
  zh: {
    // Auth
    'app.title': '纠错循环',
    'app.subtitle': '新拟态个人成长工具',
    'auth.email': '邮箱',
    'auth.password': '密码',
    'auth.login': '进入循环',
    'auth.register': '开启旅程',
    'auth.needAccount': '没有账号？去注册',
    'auth.haveAccount': '已有账号？去登录',
    'auth.initializing': '系统初始化中...',

    // Sidebar
    'nav.dashboard': '总览仪表盘',
    'nav.systems': '我的纠错系统',
    'nav.newSystem': '+ 新建系统',
    'nav.logout': '退出登录',
    'nav.deleteAccount': '注销账号',
    'nav.settings': '设置',

    // Dashboard
    'dash.welcome': '欢迎回来，',
    'dash.heatmapTitle': '学习热力图',
    'dash.totalReviews': '总复习次数',
    'dash.activeDays': '活跃天数',
    'dash.itemsMastered': '已斩杀项目',
    'dash.todayDue': '今日待办',
    'dash.less': '少',
    'dash.more': '多',

    // User Profile
    'profile.title': '用户信息',
    'profile.edit': '修改信息',
    'profile.username': '用户名',
    'profile.email': '邮箱',
    'profile.password': '密码',
    'profile.address': '地址',
    'profile.birthDate': '出生日期',
    'profile.age': '年龄',
    'profile.gender': '性别',
    'profile.gender.male': '男',
    'profile.gender.female': '女',
    'profile.gender.other': '其他',
    'profile.gender.secret': '保密',
    'profile.notSet': '未设置',
    'profile.edit.title': '修改用户信息',
    'profile.btn.save': '保存修改',
    'profile.btn.cancel': '取消',
    'profile.avatar.modalTitle': '修改头像',
    'profile.avatar.upload': '上传图片',
    'profile.avatar.link': '图片链接 (URL)',
    'profile.avatar.save': '保存头像',
    'profile.avatar.placeholder': 'https://example.com/image.png',

    // Vocab System
    'vocab.due': '待复习',
    'vocab.mastered': '已斩杀',
    'vocab.showDue': '只看待复习',
    'vocab.showAll': '查看全部',
    'vocab.import': '+ 批量导入',
    'vocab.emptyReview': '暂无待复习单词！🎉',
    'vocab.emptyAll': '暂无单词，请先导入。',
    'vocab.flip': '点击翻转',
    'vocab.btn.forgot': '忘记了',
    'vocab.btn.gotIt': '记住了',
    'vocab.import.title': '批量导入单词',
    'vocab.import.desc': "格式：章节标题后换行输入单词。不同章节可用 '---' 分隔或直接写新标题。",
    'vocab.import.placeholder': "第1章\napple\nbanana\n\n第2章\ncomputer\ncode",
    'vocab.import.btn': '开始导入',
    'vocab.import.textColors': '字体颜色',
    'vocab.import.processing': 'AI 处理中...',

    // Algo System
    'algo.newProblem': '+ 新建题目',
    'algo.editNotes': '编辑笔记',
    'algo.markReviewed': '打卡复习',
    'algo.reviews': '复习次数',
    'algo.last': '上次',
    'algo.never': '从未',
    'algo.modal.editTitle': '编辑题目',
    'algo.modal.newTitle': '新建题目',
    'algo.form.title': '题目名称',
    'algo.form.notes': '笔记 / 题解 (Markdown)',
    'algo.form.placeholder': '例如：两数之和',
    'algo.btn.save': '保存',

    // Create System Modal
    'sys.modal.title': '创建新循环',
    'sys.form.name': '系统名称',
    'sys.form.placeholder': '例如：生活错题本',
    'sys.form.type': '类型',
    'sys.form.theme': '主题色',
    'sys.btn.create': '创建',

    // Settings
    'settings.title': '设置',
    'settings.language': '语言',
    'settings.lang.en': 'English',
    'settings.lang.zh': '中文 (Chinese)',
    'settings.select': '选择语言',
    'settings.viewProfile': '查看用户信息',
    'settings.editProfile': '修改用户信息',
    'settings.close': '关闭',

    // Misc
    'common.selectSystem': '请选择或创建一个系统开始纠错。',
    'common.user': '用户',
    'common.yearsOld': '岁'
  }
};