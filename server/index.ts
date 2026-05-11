import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PETS } from '../src/data/mockData';
import { db } from './supabaseRest';

type UserRow = {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  avatar: string;
  created_at?: string;
};

type PetRow = (typeof PETS)[number] & { created_at?: string };

type ApplicationRow = {
  id: string;
  user_id: string;
  pet_id: string;
  status: '正在审核' | '已结束';
  date: string;
  payload: Record<string, unknown>;
  created_at: string;
};

type NotificationRow = {
  id: string;
  user_id: string;
  category: '申请' | '健康' | '活动' | '进度' | '目击';
  title: string;
  body: string;
  image: string;
  action_label: string;
  action_url: string;
  status: 'unread' | 'read' | 'archived';
  metadata: Record<string, unknown>;
  created_at: string;
};

type NotificationPreferenceRow = {
  user_id: string;
  adoption_updates: boolean;
  sighting_reports: boolean;
  updated_at?: string;
};

type EventRow = {
  id: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  image: string;
  location: string;
  starts_at: string;
  capacity: number;
  created_at?: string;
};

type ReportRow = {
  id: string;
  user_id?: string | null;
  title: string;
  report_type: '丢失' | '目击' | '随手拍' | '已团聚';
  species: string;
  location: string;
  happened_at: string;
  description: string;
  image: string;
  reward?: number | null;
  status: 'open' | 'resolved' | 'archived';
  created_at: string;
};

const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCtg2VttarLLNwqOcYuy2-jmU7KYBFATB8a5YXDjufFWtO0_Wu6O57ujSke5WB1FIJ1D-grqDPH5n4j_1d97v53obwY1yk3PFX1aY3UTYfEEvEQNbTJNN-EGx2CHeKuB-ASL5jg5pyoU5wXt7yf-seDp9y2v2XOPmVApY4qjx51hzKEz4qN80fY3U-O3ePjV12BFQiaZFjioGYlzpCsIw4Tbenlsmi1xL1HusCCOvYmloZe3Y4nsGhFFZrkzRiwlF-dNgRNUYCvc-M';

const SEED_EVENTS = [
  {
    id: 'spring-adoption-gala',
    title: '春日领养嘉年华',
    category: '领养',
    summary: '在樱花树下，为它们寻找一个温暖的家。',
    description: '现场会有待领养犬猫、志愿者咨询、基础照护讲座和领养审核说明。适合第一次了解领养流程的家庭参加。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6dpf_SldRo5VMb1aGvjqBuC_kVwHgGyCGirjCySZFN-LlGJJLm0ZRuVmWe1x1-Z0xuLwI4NdtFKZBg-qT4Nd35baZhkwe4BTa7qpqZbGcrPMpRZ97k_VixUAi4RZqPNBJV55fITsfdDvcfNjGDFFh37sf5TnOWSAjyWeesV36hg6lo_9fGNMkEl6VxROiO5yjmP6CCaEuwkBiTSNd2sfxD6Sxw0gOY73RrfZuvD93aPqQMvBDnYz7SLWo0yKLWAqJWEBlIueOCec',
    location: '中央公园樱花广场',
    starts_at: '2026-05-15T14:00:00+08:00',
    capacity: 80,
  },
  {
    id: 'tnr-workshop',
    title: '流浪猫 TNR 讲座',
    category: '训练',
    summary: '学习安全诱捕、绝育和放归的社区协作流程。',
    description: '兽医与资深志愿者会拆解 TNR 的工具准备、风险识别、术后护理和邻里沟通要点。',
    image: '',
    location: '社区动物服务站',
    starts_at: '2026-05-18T10:00:00+08:00',
    capacity: 40,
  },
  {
    id: 'volunteer-meetup',
    title: '志愿者交流会',
    category: '志愿者',
    summary: '认识附近救助伙伴，加入投喂、转运和回访小组。',
    description: '适合新志愿者了解任务排班、救助边界、沟通模板和基础安全规范。',
    image: '',
    location: '幸福社区活动室',
    starts_at: '2026-05-20T18:00:00+08:00',
    capacity: 50,
  },
  {
    id: 'pet-portrait-fundraiser',
    title: '宠物肖像义卖',
    category: '见面会',
    summary: '用一张肖像支持流浪动物医疗基金。',
    description: '摄影师现场拍摄宠物肖像，义卖收入将用于紧急医疗和绝育补贴。',
    image: '',
    location: '月光咖啡馆',
    starts_at: '2026-05-22T09:00:00+08:00',
    capacity: 60,
  },
];

const SEED_REPORTS = [
  {
    title: '小乐 (Lele)',
    report_type: '丢失',
    species: '比格犬',
    location: '朝阳区 幸福小区东门附近',
    happened_at: '2026-05-10T13:30:00+08:00',
    description: '小乐从小区东门附近走失，戴红色项圈，胆子小但会回应名字。请看到后不要追赶，先拍照联系主人。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2mjFj-OBadwlFMxoZNvC8hEjby10oeVHKchbHhaO0VeOxVtj51E2NYZxGHvJz6E0g5lBPhGlLXgHGTkKHj8EjXBPdDvGxbsXWUgVjQq_4lMKjqS-UrSndYDY2vx2ti2w-AxJL-O1T2vA2KbUvJAZiqx3B1f-Fp6sFPNCW4r0lGJSw-xjm_eOBDKqmeej_Se03loxiiUOEs0aONwqXP290oXEtgraTsuvReG63BqP2nP8O7Uf6ubw5YkXgk7yTc7QyN37PvmrUTEQ',
    reward: 500,
    status: 'open',
  },
  {
    title: '橘色田园猫',
    report_type: '目击',
    species: '中华田园猫',
    location: '海淀区 翠微公园南门',
    happened_at: '2026-05-10T10:00:00+08:00',
    description: '在公园南侧灌木丛看到，颈部带有红色项圈，看起来健康但有些怕人。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMfNSOXUQS3J0rVvDUBLC1DzQDmdsZ4qNXUrLDZ9kfNqQzV0zzFMxjN6bK-VaKT7M6N9ALY6wJcNHd3OMO2NrfEPiawm5XfUxfXCrU5sHf3EdzQkTGxAijqsOUG-EeI1EsOkUxjR7hx4S6STfu_uVdZoNUJB8Hp0XsPpQ-gYFzB_SPKmuQQ_XgBGlRiPnZKOVKSFoI-CcQJGmRBdFjJKOi8Kgn5fWrccRM8TqV3_vMzRgRoySd27yniAVwY-yKsFxj8pcuiFMODvE',
    reward: null,
    status: 'open',
  },
  {
    title: '团聚：阿布 (Abu)',
    report_type: '已团聚',
    species: '金毛寻回犬',
    location: '望京西路',
    happened_at: '2026-05-08T20:00:00+08:00',
    description: '感谢平台和社区志愿者，阿布在丢失三天后平安回家。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwO6SHbGFEifO_j8Ud9j0kCSUJVGXiI-Wu51vx8lU_2X4gELV2wT9s_C4CWBl8c8gtUDoFcqQxnF5IkUSIbZtj8ulZ9_GI0Ja12Sw1vQzldzPW6ADIOlYMNBjkwKwCpJY_9m3qZzMkuG0oRCXq2wqh4R3kQWTKSP81_VZo7aGPS7Y3jwEJqZwOyRvsQc0OC2JtGSpvQmf9u6PMhj9TYN87eDe1d0VxHPBCQ9GJrwlLOXvV9bLAufXWgdYRhOKql5g-xTlY8b6Rj5o',
    reward: null,
    status: 'resolved',
  },
];

const app = express();
const port = Number(process.env.PORT || 8787);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

app.use(express.json({ limit: '1mb' }));
app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.APP_URL || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  next();
});
app.options('*', (_, res) => res.sendStatus(204));

function sendError(res: express.Response, error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown server error';
  console.error(message);
  res.status(500).json({ error: message });
}

function isMissingTableError(error: unknown) {
  return error instanceof Error && error.message.includes('PGRST205');
}

async function runOptionalDbTask(task: () => Promise<void>, label: string) {
  try {
    await task();
  } catch (error) {
    if (isMissingTableError(error)) {
      console.warn(`${label} skipped because the related Supabase table is missing.`);
      return;
    }
    throw error;
  }
}

function normalizeUser(row: UserRow) {
  return {
    id: row.id,
    email: row.email,
    phone: row.phone,
    name: row.name,
    avatar: row.avatar,
    createdAt: row.created_at,
  };
}

function normalizeApplication(row: ApplicationRow) {
  return {
    id: row.id,
    petId: row.pet_id,
    status: row.status,
    date: row.date,
    payload: row.payload,
    createdAt: row.created_at,
  };
}

function normalizeNotification(row: NotificationRow) {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    body: row.body,
    image: row.image,
    actionLabel: row.action_label,
    actionUrl: row.action_url,
    status: row.status,
    metadata: row.metadata,
    createdAt: row.created_at,
  };
}

function normalizeNotificationPreferences(row: NotificationPreferenceRow) {
  return {
    adoptionUpdates: row.adoption_updates,
    sightingReports: row.sighting_reports,
    updatedAt: row.updated_at,
  };
}

function normalizeEvent(row: EventRow) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    summary: row.summary,
    description: row.description,
    image: row.image,
    location: row.location,
    startsAt: row.starts_at,
    capacity: row.capacity,
    createdAt: row.created_at,
  };
}

function normalizeReport(row: ReportRow) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    reportType: row.report_type,
    species: row.species,
    location: row.location,
    happenedAt: row.happened_at,
    description: row.description,
    image: row.image,
    reward: row.reward,
    status: row.status,
    createdAt: row.created_at,
  };
}

async function ensureSeedPets() {
  const existing = await db.select<PetRow>('pets', { select: 'id', limit: 1 });
  if (existing.length > 0) return;

  await db.upsert<PetRow>(
    'pets',
    PETS.map((pet) => ({
      id: pet.id,
      name: pet.name,
      age: pet.age,
      breed: pet.breed,
      gender: pet.gender,
      tags: pet.tags,
      location: pet.location,
      description: pet.description,
      image: pet.image,
      type: pet.type,
      urgent: pet.urgent,
    })),
    { on_conflict: 'id' }
  );
}

async function ensureSeedEvents() {
  const existing = await db.select<EventRow>('events', { select: 'id', limit: 1 });
  if (existing.length > 0) return;
  await db.upsert<EventRow>('events', SEED_EVENTS, { on_conflict: 'id' });
}

async function ensureSeedReports() {
  const existing = await db.select<ReportRow>('reports', { select: 'id', limit: 1 });
  if (existing.length > 0) return;
  await db.insert<ReportRow>('reports', SEED_REPORTS);
}

async function findOrCreateUser(input: { email?: string; phone?: string; name?: string }) {
  const email = input.email?.trim().toLowerCase();
  const phone = input.phone?.trim();
  const name = input.name?.trim() || 'Sarah';

  if (!email && !phone) {
    throw new Error('Email or phone is required.');
  }

  const query = email
    ? { select: '*', email: `eq.${email}`, limit: 1 }
    : { select: '*', phone: `eq.${phone}`, limit: 1 };

  const existing = await db.select<UserRow>('app_users', query);
  if (existing[0]) {
    await runOptionalDbTask(() => ensureNotificationPreferences(existing[0].id), 'Notification preferences init');
    await runOptionalDbTask(() => ensureSeedNotifications(existing[0].id), 'Notification seed');
    return existing[0];
  }

  const inserted = await db.insert<UserRow>('app_users', [
    {
      email: email || null,
      phone: phone || null,
      name,
      avatar: DEFAULT_AVATAR,
    },
  ]);
  await runOptionalDbTask(() => ensureNotificationPreferences(inserted[0].id), 'Notification preferences init');
  await runOptionalDbTask(() => ensureSeedNotifications(inserted[0].id), 'Notification seed');
  return inserted[0];
}

async function ensureNotificationPreferences(userId: string) {
  await db.upsert<NotificationPreferenceRow>(
    'notification_preferences',
    [{ user_id: userId, adoption_updates: true, sighting_reports: false }],
    { on_conflict: 'user_id' }
  );
}

async function ensureSeedNotifications(userId: string) {
  const existing = await db.select<NotificationRow>('notifications', {
    select: 'id',
    user_id: `eq.${userId}`,
    limit: 1,
  });
  if (existing.length > 0) return;

  await db.insert<NotificationRow>('notifications', [
    {
      user_id: userId,
      category: '申请',
      title: 'Luna 的领养申请',
      body: '你的领养申请已提交，志愿者会在 24 小时内完成初审。',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8pgi8UcYwYoJoko8KgMwNpRqqmoQ95U6YMYNJNhlXwBFA9wJ9v3qpsWInS4Y5ATkjGHrc2C960CVeMPJ5P8OYY9QX7C2inAWvoMyHDoSz5yyrZHtgeb4l_00A2P5J12LhlsNj9IbJ_5q4pKNJrrZptTefN7mW-ydX_YAtgJfNv_b62IATV8hsVlLBzNQUwUBU3pGbYAg3y9cBQ9nGKwcJeYTSrqkDbVx92BhZM4W4IH0KVqW9iGL78Qv6DuPVSXaJaiWL7DJ2Yik',
      action_label: '查看进度',
      action_url: '/profile',
      status: 'unread',
    },
    {
      user_id: userId,
      category: '健康',
      title: 'Ginger 健康报告更新',
      body: '季度驱虫与疫苗接种记录已同步，建议近期增加户外活动时间。',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5jGNgx_IpgMzeiX4PvNJWvhIMlnswuDtqWODJixASJc_f2NRENMMDxF4IL_qwlGOag9rT3y1Abu6tzBajJxabi-8jt87eGQNjzJRsu4bTLmNs0MQEoXprDhAm7zLJDyfuuvmKEkWvMcnJM4h6GevTkJ2YTi7R7r7y9T8fTd5dAGFCQ6EKkb2QMBS8GkCssfPPXHNbcn1sRj7lLJIAcej2LAx33ig7WS2cHztS5byYozActoQFHsH1FUQzk4BNXQcDUBt9Bv35uzc',
      action_label: '查看详情',
      action_url: '/messages',
      status: 'unread',
    },
    {
      user_id: userId,
      category: '活动',
      title: '领养市集活动预告',
      body: '本周六下午 2:00 将在中央公园举办大型领养市集。',
      image: '',
      action_label: '立即报名',
      action_url: '/events',
      status: 'unread',
    },
  ]);
}

app.get('/api/health', (_, res) => {
  res.json({ ok: true, service: 'stray-stories-api' });
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const user = await findOrCreateUser(req.body || {});
    res.json({ user: normalizeUser(user) });
  } catch (error) {
    sendError(res, error);
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const user = await findOrCreateUser(req.body || {});
    res.json({ user: normalizeUser(user) });
  } catch (error) {
    sendError(res, error);
  }
});

app.get('/api/pets', async (_, res) => {
  try {
    await ensureSeedPets();
    const pets = await db.select<PetRow>('pets', { select: '*', order: 'created_at.asc' });
    res.json({ pets });
  } catch (error) {
    sendError(res, error);
  }
});

app.get('/api/pets/:id', async (req, res) => {
  try {
    await ensureSeedPets();
    const rows = await db.select<PetRow>('pets', { select: '*', id: `eq.${req.params.id}`, limit: 1 });
    if (!rows[0]) return res.status(404).json({ error: 'Pet not found' });
    res.json({ pet: rows[0] });
  } catch (error) {
    sendError(res, error);
  }
});

app.get('/api/favorites', async (req, res) => {
  try {
    const userId = String(req.query.userId || '');
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const rows = await db.select<{ pet_id: string }>('favorites', {
      select: 'pet_id',
      user_id: `eq.${userId}`,
      order: 'created_at.desc',
    });
    res.json({ favorites: rows.map((row) => row.pet_id) });
  } catch (error) {
    sendError(res, error);
  }
});

app.post('/api/favorites/:petId/toggle', async (req, res) => {
  try {
    const userId = String(req.body?.userId || '');
    const petId = req.params.petId;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const existing = await db.select<{ pet_id: string }>('favorites', {
      select: 'pet_id',
      user_id: `eq.${userId}`,
      pet_id: `eq.${petId}`,
      limit: 1,
    });

    if (existing[0]) {
      await db.delete('favorites', { user_id: `eq.${userId}`, pet_id: `eq.${petId}` });
    } else {
      await db.insert('favorites', [{ user_id: userId, pet_id: petId }]);
    }

    const rows = await db.select<{ pet_id: string }>('favorites', {
      select: 'pet_id',
      user_id: `eq.${userId}`,
      order: 'created_at.desc',
    });
    res.json({ favorites: rows.map((row) => row.pet_id) });
  } catch (error) {
    sendError(res, error);
  }
});

app.get('/api/applications', async (req, res) => {
  try {
    const userId = String(req.query.userId || '');
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const rows = await db.select<ApplicationRow>('applications', {
      select: '*',
      user_id: `eq.${userId}`,
      order: 'created_at.desc',
    });
    res.json({ applications: rows.map(normalizeApplication) });
  } catch (error) {
    sendError(res, error);
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const { userId, petId, payload } = req.body || {};
    if (!userId || !petId) {
      return res.status(400).json({ error: 'userId and petId are required' });
    }

    const rows = await db.insert<ApplicationRow>('applications', [
      {
        user_id: userId,
        pet_id: petId,
        status: '正在审核',
        date: '刚刚',
        payload: payload || {},
      },
    ]);
    await runOptionalDbTask(
      () => db.insert<NotificationRow>('notifications', [
        {
          user_id: userId,
          category: '申请',
          title: '领养申请已提交',
          body: '你的申请已经进入审核流程，可以在个人主页查看最新进度。',
          image: '',
          action_label: '查看进度',
          action_url: '/profile',
          status: 'unread',
          metadata: { petId },
        },
      ]).then(() => undefined),
      'Application notification'
    );
    res.json({ application: normalizeApplication(rows[0]) });
  } catch (error) {
    sendError(res, error);
  }
});

app.get('/api/events', async (req, res) => {
  try {
    await ensureSeedEvents();
    const category = String(req.query.category || '');
    const query: Record<string, string | number> = { select: '*', order: 'starts_at.asc' };
    if (category && category !== '全部') query.category = `eq.${category}`;
    const rows = await db.select<EventRow>('events', query);
    res.json({ events: rows.map(normalizeEvent) });
  } catch (error) {
    sendError(res, error);
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    await ensureSeedEvents();
    const rows = await db.select<EventRow>('events', { select: '*', id: `eq.${req.params.id}`, limit: 1 });
    if (!rows[0]) return res.status(404).json({ error: 'Event not found' });
    res.json({ event: normalizeEvent(rows[0]) });
  } catch (error) {
    sendError(res, error);
  }
});

app.post('/api/events/:id/register', async (req, res) => {
  try {
    const userId = String(req.body?.userId || '');
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const rows = await db.upsert<{ id: string; user_id: string; event_id: string }>(
      'event_registrations',
      [{ user_id: userId, event_id: req.params.id }],
      { on_conflict: 'user_id,event_id' }
    );
    await runOptionalDbTask(
      () => db.insert<NotificationRow>('notifications', [
        {
          user_id: userId,
          category: '活动',
          title: '活动报名成功',
          body: '你已成功报名活动，请在活动开始前留意通知。',
          image: '',
          action_label: '查看活动',
          action_url: `/events/${req.params.id}`,
          status: 'unread',
          metadata: { eventId: req.params.id },
        },
      ]).then(() => undefined),
      'Event registration notification'
    );
    res.json({ registration: rows[0] });
  } catch (error) {
    sendError(res, error);
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    await ensureSeedReports();
    const filter = String(req.query.filter || '');
    const query: Record<string, string | number> = { select: '*', order: 'created_at.desc' };
    if (filter === '丢失宠物') query.report_type = 'eq.丢失';
    if (filter === '最新目击') query.report_type = 'eq.目击';
    if (filter === '重聚故事') query.report_type = 'eq.已团聚';
    const rows = await db.select<ReportRow>('reports', query);
    res.json({ reports: rows.map(normalizeReport) });
  } catch (error) {
    sendError(res, error);
  }
});

app.get('/api/reports/:id', async (req, res) => {
  try {
    await ensureSeedReports();
    const rows = await db.select<ReportRow>('reports', { select: '*', id: `eq.${req.params.id}`, limit: 1 });
    if (!rows[0]) return res.status(404).json({ error: 'Report not found' });
    res.json({ report: normalizeReport(rows[0]) });
  } catch (error) {
    sendError(res, error);
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const { userId, title, reportType, species, location, happenedAt, description, image, reward } = req.body || {};
    if (!title || !reportType || !location) {
      return res.status(400).json({ error: 'title, reportType and location are required' });
    }

    const rows = await db.insert<ReportRow>('reports', [
      {
        user_id: userId || null,
        title,
        report_type: reportType,
        species: species || '',
        location,
        happened_at: happenedAt || new Date().toISOString(),
        description: description || '',
        image: image || '',
        reward: reward ? Number(reward) : null,
        status: reportType === '已团聚' ? 'resolved' : 'open',
      },
    ]);

    if (userId) {
      await runOptionalDbTask(
        () => db.insert<NotificationRow>('notifications', [
          {
            user_id: userId,
            category: reportType === '目击' ? '目击' : '进度',
            title: '报告已发布',
            body: `${title} 的${reportType}信息已经同步到附近动态。`,
            image: image || '',
            action_label: '查看报告',
            action_url: `/reports/${rows[0].id}`,
            status: 'unread',
            metadata: { reportId: rows[0].id },
          },
        ]).then(() => undefined),
        'Report notification'
      );
    }

    res.json({ report: normalizeReport(rows[0]) });
  } catch (error) {
    sendError(res, error);
  }
});

app.get('/api/notifications', async (req, res) => {
  try {
    const userId = String(req.query.userId || '');
    const status = String(req.query.status || 'unread');
    const category = String(req.query.category || '');
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await ensureNotificationPreferences(userId);
    await ensureSeedNotifications(userId);

    const query: Record<string, string | number> = {
      select: '*',
      user_id: `eq.${userId}`,
      order: 'created_at.desc',
    };
    if (status !== 'all') query.status = `eq.${status}`;
    if (category && category !== '全部') query.category = `eq.${category}`;

    const rows = await db.select<NotificationRow>('notifications', query);
    res.json({ notifications: rows.map(normalizeNotification) });
  } catch (error) {
    sendError(res, error);
  }
});

app.post('/api/notifications/:id/archive', async (req, res) => {
  try {
    const userId = String(req.body?.userId || '');
    const id = req.params.id;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const rows = await db.update<NotificationRow>(
      'notifications',
      { status: 'archived' },
      { id: `eq.${id}`, user_id: `eq.${userId}` }
    );
    if (!rows[0]) return res.status(404).json({ error: 'Notification not found' });
    res.json({ notification: normalizeNotification(rows[0]) });
  } catch (error) {
    sendError(res, error);
  }
});

app.get('/api/notification-preferences', async (req, res) => {
  try {
    const userId = String(req.query.userId || '');
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await ensureNotificationPreferences(userId);
    const rows = await db.select<NotificationPreferenceRow>('notification_preferences', {
      select: '*',
      user_id: `eq.${userId}`,
      limit: 1,
    });
    res.json({ preferences: normalizeNotificationPreferences(rows[0]) });
  } catch (error) {
    sendError(res, error);
  }
});

app.post('/api/notification-preferences', async (req, res) => {
  try {
    const { userId, adoptionUpdates, sightingReports } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const rows = await db.upsert<NotificationPreferenceRow>(
      'notification_preferences',
      [{
        user_id: userId,
        adoption_updates: Boolean(adoptionUpdates),
        sighting_reports: Boolean(sightingReports),
        updated_at: new Date().toISOString(),
      }],
      { on_conflict: 'user_id' }
    );
    res.json({ preferences: normalizeNotificationPreferences(rows[0]) });
  } catch (error) {
    sendError(res, error);
  }
});

app.use(express.static(distDir));
app.get('*', (_, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
