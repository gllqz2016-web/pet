'use client';

import { FileText, HeartPulse, CalendarHeart, MapPin } from 'lucide-react';
import { cn } from '../../../src/lib/utils';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../../src/context/AppContext';
import { api, Notification } from '../../../src/lib/api';
import { useRouter } from 'next/navigation';

export default function MessagesPage() {
  const [filter, setFilter] = useState('全部');
  const [status, setStatus] = useState<'unread' | 'archived'>('unread');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    api.getNotifications(user.id, status, filter)
      .then(({ notifications }) => setNotifications(notifications))
      .finally(() => setLoading(false));
  }, [filter, status, user?.id]);

  const archive = async (id: string) => {
    if (!user?.id) return;
    await api.archiveNotification(user.id, id);
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  const iconFor = (item: Notification) => {
    if (item.category === '健康') return <HeartPulse className="w-3 h-3 fill-current stroke-white" />;
    if (item.category === '活动') return <CalendarHeart className="w-6 h-6 text-secondary fill-secondary/20" />;
    if (item.category === '进度' || item.category === '目击') return <MapPin className="w-3 h-3 fill-current stroke-white" />;
    return <FileText className="w-3 h-3 fill-current stroke-white" />;
  };

  const timeAgo = (date: string) => {
    const minutes = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    return `${Math.floor(hours / 24)}天前`;
  };

  return (
    <div className="px-4 pt-4 pb-8 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="font-headline-md text-on-surface mb-4">消息中心</h2>
        <div className="flex bg-surface-container-low rounded-xl p-1">
          <button onClick={() => setStatus('unread')} className={cn("flex-1 py-2 font-label-md rounded-lg transition-colors", status === 'unread' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-variant/30')}>未读消息</button>
          <button onClick={() => setStatus('archived')} className={cn("flex-1 py-2 font-label-md rounded-lg transition-colors", status === 'archived' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-variant/30')}>已存档</button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 hide-scrollbar">
        {['全部', '申请', '健康', '活动'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "flex-shrink-0 px-4 py-1.5 rounded-full font-label-md transition-colors",
              filter === f
                ? "bg-secondary-container text-on-secondary-container"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading && <p className="text-center text-on-surface-variant py-8">正在加载消息...</p>}
        {!loading && notifications.length === 0 && <p className="text-center text-on-surface-variant py-8">暂无消息</p>}
        {notifications.map(item => (
          <div key={item.id} className={cn("bg-surface p-4 rounded-2xl flex gap-4 shadow-[0_4px_20px_rgba(204,90,61,0.08)]", item.category === '活动' && 'border-l-4 border-secondary')}>
            <div className="relative flex-shrink-0">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-14 h-14 rounded-xl object-cover border-2 border-surface-container" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-secondary-fixed flex items-center justify-center">
                  {iconFor(item)}
                </div>
              )}
              {item.image && (
                <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full">
                  {iconFor(item)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-label-md text-on-surface truncate font-semibold">{item.title}</h3>
                <span className="text-[12px] text-outline opacity-70 whitespace-nowrap ml-2">{timeAgo(item.createdAt)}</span>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant mb-3 line-clamp-2">{item.body}</p>
              <div className="flex gap-2">
                <button onClick={() => item.actionUrl && router.push(item.actionUrl)} className="px-4 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-sm hover:scale-105 transition-transform">{item.actionLabel}</button>
                {status === 'unread' && (
                  <button onClick={() => archive(item.id)} className="px-4 py-1.5 rounded-lg bg-surface-container-highest text-on-surface-variant font-label-md text-sm hover:bg-outline-variant/30 transition-colors">存档</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
