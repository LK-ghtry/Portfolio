# -*- coding: utf-8 -*-
from models import db, PersonalInfo, TimelineItem, Project, Competition
from models import Skill, Certification, Interest, TravelPhoto, Playlist
from models import GuestbookMessage, AdminUser, Writing
from werkzeug.security import generate_password_hash


def seed_if_empty():
    if PersonalInfo.query.first() is not None:
        return

    # --- Personal Info ---
    db.session.add(PersonalInfo(
        id=1,
        name_cn='李国宽',
        name_en='Li Guokuan',
        title='AI Product Operations',
        subtitle='AI产品运营 / 内容运营 / 产品运营',
        location='深圳市',
        email='610013559@qq.com',
        phone='13032872890',
        bio='具备AIGC内容产品的完整实战经验，擅长发现问题并推动产品改进。跨学科背景（医学+传播+AI）有助于同时理解用户、内容与技术三端逻辑。情绪稳定，抗压能力强，善于在复杂环境下协调资源、高效推动目标达成。',
        career_goal='AI产品运营、产品运营、内容运营',
        github_url='https://github.com/',
        linkedin_url='https://linkedin.com/in/',
        twitter_url='',
    ))

    # --- Timeline: Education ---
    educations = [
        {'category': 'education', 'title': '四川大学',
         'subtitle': '新闻与传播 · 硕士研究生',
         'description': '', 'start_date': '2024.09',
         'end_date': '2027.06', 'sort_order': 1},
        {'category': 'education', 'title': '四川大学',
         'subtitle': '预防医学 · 本科',
         'description': '', 'start_date': '2017.09',
         'end_date': '2022.06', 'sort_order': 0},
    ]
    for e in educations:
        db.session.add(TimelineItem(**e))

    # --- Timeline: Experience ---
    exp1_desc = (
        '负责AIGC视频产品“探光”的内容质量管控模块，'
        '专项负责AI生成画面失真问题，系统整理问题案例与复现规律，'
        '形成结构化反馈文档；推动产品侧更新内容生成规则，'
        '同步承担prompt优化工作\n'
        '作为快手平台全链路负责人，主导确立账号内容调性，'
        '联动算法团队开发自动分发机制\n'
        '千万级粉丝微信公众号“安逸花”运营，'
        '累计发布推文62篇，阅读量100万+'
    )
    exp3_desc = (
        '百家号“多特体育”通过内容风格打磨与标题策略优化'
        '持续获取算法流量，产出10万+阅读爆文12篇，粉丝增长2.1万\n'
        '个人体育垂类知乎账号，单平台粉丝超6000+，累计阅读量突破100万+'
    )

    experiences = [
        {'category': 'experience', 'title': '马上消费金融有限公司（已上市）',
         'subtitle': 'AI产品运营实习生', 'description': exp1_desc,
         'start_date': '2025.09', 'end_date': '2025.12', 'sort_order': 2},
        {'category': 'experience', 'title': '华西医院健康管理中心',
         'subtitle': '新媒体运营',
         'description': '独立负责公众号全流程运营、活动策划、推文创作、招投标项目书撰写等，实现百万级内容传播',
         'start_date': '2023.04', 'end_date': '2023.08', 'sort_order': 1},
        {'category': 'experience', 'title': '自媒体运营',
         'subtitle': '内容创作者', 'description': exp3_desc,
         'start_date': '2018.02', 'end_date': '2019.09', 'sort_order': 0},
    ]
    for exp in experiences:
        db.session.add(TimelineItem(**exp))

    # --- Projects ---
    projects = [
        {'title': '《“AI”上唐宋，文脉中国》研究生全国双创大赛',
         'category': 'AI/ML',
         'short_description': '牵头完成团队组建与任务分工，主导开发“地方文脉与诗歌元宇宙”网站',
         'full_description': '牵头完成团队组建与任务分工，主导开发“地方文脉与诗歌元宇宙”网站。项目融合AI技术与传统文化，构建了诗歌与地方文脉的数字化展示平台。',
         'sort_order': 2, 'featured': True},
        {'title': 'AI语音信任神经机制研究',
         'category': 'Research',
         'short_description': '独立领导关于AI聊天机器人音色如何影响人类信任度的前沿研究',
         'full_description': '独立领导关于AI聊天机器人音色如何影响人类信任度的前沿研究，构建了从理论到实证的完整研究链路，包括系统梳理100+篇英文文献综述，设计执行60人次脑电实验，综合运用Python、Matlab、SPSS等工具，完成了从实验编程、数据采集到统计分析的全过程。',
         'sort_order': 1, 'featured': True},
        {'title': '《靠“谱”的中国诗》大学生“挑战杯”',
         'category': 'Research',
         'short_description': '省级特等奖 · 负责两轮调研的数据分析（68场访谈+4000份问卷）',
         'full_description': '省级特等奖。负责两轮调研的数据分析（68场访谈+4000份问卷），为研究框架的搭建与迭代提供关键方向。',
         'sort_order': 0, 'featured': False},
    ]
    for p in projects:
        db.session.add(Project(**p))

    # --- Competitions ---
    competitions = [
        {'title': '《靠“谱”的中国诗》大学生“挑战杯”',
         'award': '省级特等奖', 'date': '2025', 'icon': '\U0001f3c6', 'sort_order': 1},
        {'title': '《“AI”上唐宋，文脉中国》双创大赛',
         'award': '参赛', 'date': '2025', 'icon': '\U0001f3af', 'sort_order': 0},
    ]
    for c in competitions:
        db.session.add(Competition(**c))

    # --- Skills ---
    skills = [
        {'name': 'Python', 'category': 'programming', 'sort_order': 0},
        {'name': 'Matlab', 'category': 'programming', 'sort_order': 1},
        {'name': 'SPSS', 'category': 'tools', 'sort_order': 2},
        {'name': 'AMOS', 'category': 'tools', 'sort_order': 3},
        {'name': 'Neuroscan', 'category': 'tools', 'sort_order': 4},
        {'name': 'MS Office', 'category': 'tools', 'sort_order': 5},
        {'name': 'Prompt Engineering', 'category': 'AI', 'sort_order': 6},
        {'name': 'AIGC', 'category': 'AI', 'sort_order': 7},
        {'name': '新媒体运营', 'category': 'marketing', 'sort_order': 8},
        {'name': '数据分析', 'category': 'general', 'sort_order': 9},
        {'name': '内容创作', 'category': 'general', 'sort_order': 10},
    ]
    for s in skills:
        db.session.add(Skill(**s))

    # --- Certifications ---
    certifications = [
        {'title': '大学英语六级 (CET-6)', 'issuer': '教育部',
         'date': '500+分', 'icon': '\U0001f310', 'sort_order': 0},
        {'title': '普通话二级甲等', 'issuer': '国家语言文字工作委员会',
         'date': '', 'icon': '\U0001f5e3', 'sort_order': 1},
        {'title': '全国计算机二级', 'issuer': '教育部',
         'date': '', 'icon': '\U0001f4bb', 'sort_order': 2},
        {'title': '校级学业奖学金', 'issuer': '四川大学',
         'date': '', 'icon': '\U0001f393', 'sort_order': 3},
    ]
    for c in certifications:
        db.session.add(Certification(**c))

    # --- Interests (placeholder) ---
    interests = [
        {'title': 'GitHub', 'description': '关注前沿AI项目与技术趋势，持续学习与探索',
         'icon_name': 'Github', 'icon_color': '#333',
         'link_url': 'https://github.com/', 'link_text': '访问主页', 'sort_order': 0},
        {'title': '阅读与写作', 'description': '保持阅读习惯，关注科技与人文交叉领域的内容创作',
         'icon_name': 'BookOpen', 'icon_color': '#8B4513',
         'link_url': '/writing', 'link_text': '进入阅读', 'sort_order': 1},
        {'title': '音乐', 'description': '热爱音乐，常听电子、独立与华语流行',
         'icon_name': 'Music', 'icon_color': '#e60012',
         'link_url': '/music-playlist', 'link_text': '进入歌单', 'sort_order': 2},
    ]
    for i in interests:
        db.session.add(Interest(**i))

    # --- Travel Photos (placeholder) ---
    travel_photos = [
        {'country': '中国', 'image_path': '',
         'caption': '旅行照片待补充', 'sort_order': 0},
    ]
    for tp in travel_photos:
        db.session.add(TravelPhoto(**tp))

    # --- Playlists (placeholder) ---
    playlists = [
        {'title': '工作专注 · Deep Focus', 'platform': '网易云音乐',
         'link_url': '', 'sort_order': 0},
        {'title': '通勤路上 · Commute Vibes', 'platform': 'QQ音乐',
         'link_url': '', 'sort_order': 1},
    ]
    for p in playlists:
        db.session.add(Playlist(**p))

    # --- Writings (placeholder) ---
    writings = [
        {'title': '待添加文章', 'url': '', 'description': '通过管理后台添加你的公众号文章链接',
         'platform': '微信公众号', 'sort_order': 0},
    ]
    for w in writings:
        db.session.add(Writing(**w))

    # --- Guestbook (sample) ---
    db.session.add(GuestbookMessage(
        author_name='访客', message='很棒的网站！祝你求职顺利~',
        is_approved=True, is_pinned=True))

    # --- Admin User ---
    db.session.add(AdminUser(
        username='admin',
        password_hash=generate_password_hash('admin123'),
    ))

    db.session.commit()
    print('Database seeded successfully.')
