import { sql } from '@vercel/postgres';

export type UserRow = {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  avatar: string;
  created_at?: string;
};

export type PetRow = {
  id: string;
  name: string;
  age: string;
  breed: string;
  gender: string;
  tags: string[];
  location: string;
  description: string;
  image: string;
  type: 'cat' | 'dog';
  urgent: boolean;
  created_at?: string;
};

export type ApplicationRow = {
  id: string;
  user_id: string;
  pet_id: string;
  status: '正在审核' | '已结束';
  date: string;
  payload: Record<string, unknown>;
  created_at: string;
};

export type NotificationRow = {
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

export type NotificationPreferenceRow = {
  user_id: string;
  adoption_updates: boolean;
  sighting_reports: boolean;
  updated_at?: string;
};

export type EventRow = {
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

export type ReportRow = {
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

export const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCtg2VttarLLNwqOcYuy2-jmU7KYBFATB8a5YXDjufFWtO0_Wu6O57ujSke5WB1FIJ1D-grqDPH5n4j_1d97v53obwY1yk3PFX1aY3UTYfEEvEQNbTJNN-EGx2CHeKuB-ASL5jg5pyoU5wXt7yf-seDp9y2v2XOPmVApY4qjx51hzKEz4qN80fY3U-O3ePjV12BFQiaZFjioGYlzpCsIw4Tbenlsmi1xL1HusCCOvYmloZe3Y4nsGhFFZrkzRiwlF-dNgRNUYCvc-M';

export function normalizeUser(row: UserRow) {
  return {
    id: row.id,
    email: row.email,
    phone: row.phone,
    name: row.name,
    avatar: row.avatar,
    createdAt: row.created_at,
  };
}

export function normalizeApplication(row: ApplicationRow) {
  return {
    id: row.id,
    petId: row.pet_id,
    status: row.status,
    date: row.date,
    payload: row.payload,
    createdAt: row.created_at,
  };
}

export function normalizeNotification(row: NotificationRow) {
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

export function normalizeNotificationPreferences(row: NotificationPreferenceRow) {
  return {
    adoptionUpdates: row.adoption_updates,
    sightingReports: row.sighting_reports,
    updatedAt: row.updated_at,
  };
}

export function normalizeEvent(row: EventRow) {
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

export function normalizeReport(row: ReportRow) {
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

export function isMissingTableError(error: unknown) {
  return error instanceof Error && error.message.includes('does not exist');
}

export async function runOptionalDbTask(task: () => Promise<void>, label: string) {
  try {
    await task();
  } catch (error) {
    if (isMissingTableError(error)) {
      console.warn(`${label} skipped because the related table is missing.`);
      return;
    }
    throw error;
  }
}

export async function ensureNotificationPreferences(userId: string) {
  await sql`
    INSERT INTO notification_preferences (user_id, adoption_updates, sighting_reports)
    VALUES (${userId}, true, false)
    ON CONFLICT (user_id) DO NOTHING
  `;
}

export async function ensureSeedNotifications(userId: string) {
  const { rows: existing } = await sql`SELECT id FROM notifications WHERE user_id = ${userId} LIMIT 1`;
  if (existing.length > 0) return;

  await sql`
    INSERT INTO notifications (user_id, category, title, body, image, action_label, action_url, status, metadata)
    VALUES
      (${userId}, '申请', 'Luna 的领养申请', '你的领养申请已提交，志愿者会在 24 小时内完成初审。',
       'https://lh3.googleusercontent.com/aida-public/AB6AXuB8pgi8UcYwYoJoko8KgMwNpRqqmoQ95U6YMYNJNhlXwBFA9wJ9v3qpsWInS4Y5ATkjGHrc2C960CVeMPJ5P8OYY9QX7C2inAWvoMyHDoSz5yyrZHtgeb4l_00A2P5J12LhlsNj9IbJ_5q4pKNJrrZptTefN7mW-ydX_YAtgJfNv_b62IATV8hsVlLBzNQUwUBU3pGbYAg3y9cBQ9nGKwcJeYTSrqkDbVx92BhZM4W4IH0KVqW9iGL78Qv6DuPVSXaJaiWL7DJ2Yik',
       '查看进度', '/profile', 'unread', '{}'),
      (${userId}, '健康', 'Ginger 健康报告更新', '季度驱虫与疫苗接种记录已同步，建议近期增加户外活动时间。',
       'https://lh3.googleusercontent.com/aida-public/AB6AXuB5jGNgx_IpgMzeiX4PvNJWvhIMlnswuDtqWODJixASJc_f2NRENMMDxF4IL_qwlGOag9rT3y1Abu6tzBajJxabi-8jt87eGQNjzJRsu4bTLmNs0MQEoXprDhAm7zLJDyfuuvmKEkWvMcnJM4h6GevTkJ2YTi7R7r7y9T8fTd5dAGFCQ6EKkb2QMBS8GkCssfPPXHNbcn1sRj7lLJIAcej2LAx33ig7WS2cHztS5byYozActoQFHsH1FUQzk4BNXQcDUBt9Bv35uzc',
       '查看详情', '/messages', 'unread', '{}'),
      (${userId}, '活动', '领养市集活动预告', '本周六下午 2:00 将在中央公园举办大型领养市集。',
       '', '立即报名', '/events', 'unread', '{}')
  `;
}

export async function findOrCreateUser(input: { email?: string; phone?: string; name?: string }) {
  const email = input.email?.trim().toLowerCase();
  const phone = input.phone?.trim();
  const name = input.name?.trim() || 'Sarah';

  if (!email && !phone) {
    throw new Error('Email or phone is required.');
  }

  let existing: UserRow[] = [];
  if (email) {
    const { rows } = await sql<UserRow>`SELECT * FROM app_users WHERE email = ${email} LIMIT 1`;
    existing = rows;
  } else {
    const { rows } = await sql<UserRow>`SELECT * FROM app_users WHERE phone = ${phone!} LIMIT 1`;
    existing = rows;
  }

  if (existing[0]) {
    await runOptionalDbTask(() => ensureNotificationPreferences(existing[0].id), 'Notification preferences init');
    await runOptionalDbTask(() => ensureSeedNotifications(existing[0].id), 'Notification seed');
    return existing[0];
  }

  const { rows: inserted } = await sql<UserRow>`
    INSERT INTO app_users (email, phone, name, avatar)
    VALUES (${email || null}, ${phone || null}, ${name}, ${DEFAULT_AVATAR})
    RETURNING *
  `;
  await runOptionalDbTask(() => ensureNotificationPreferences(inserted[0].id), 'Notification preferences init');
  await runOptionalDbTask(() => ensureSeedNotifications(inserted[0].id), 'Notification seed');
  return inserted[0];
}
