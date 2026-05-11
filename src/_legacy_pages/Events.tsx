import { CalendarDays, Stethoscope, Users, Camera, Footprints, CalendarPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { api, EventItem } from '../lib/api';
import { useAppContext } from '../context/AppContext';

const iconMap = [Stethoscope, Users, Camera, Footprints];

export default function Events() {
  const [category, setCategory] = useState('全部');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [registered, setRegistered] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAppContext();

  useEffect(() => {
    api.getEvents(category).then(({ events }) => setEvents(events));
  }, [category]);

  const featured = events[0];
  const upcoming = events.slice(1);

  const register = async (eventId: string) => {
    if (!user?.id) return;
    await api.registerEvent(user.id, eventId);
    setRegistered(prev => prev.includes(eventId) ? prev : [...prev, eventId]);
  };

  return (
    <div className="px-margin-mobile pt-4 pb-8 overflow-y-auto hidden-scrollbar">
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 -mx-margin-mobile px-margin-mobile">
        {['全部', '领养', '训练', '见面会', '志愿者'].map(item => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={cn(
              "px-5 py-2 rounded-full font-label-md whitespace-nowrap shadow-sm text-sm",
              category === item ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface-variant hover:bg-secondary-fixed/20"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {featured && (
        <section className="mt-2">
          <div className="bg-surface-container rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(204,90,61,0.08)] group">
            <div onClick={() => navigate(`/events/${featured.id}`)} className="relative h-56 w-full cursor-pointer">
              {featured.image ? <img src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="w-full h-full botanical-gradient" />}
              <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-semibold">热门推荐</div>
            </div>
            <div className="p-6">
              <h2 className="font-headline-md text-headline-md text-primary mb-2 font-bold">{featured.title}</h2>
              <p className="text-on-surface-variant font-body-md mb-4 italic text-sm">{featured.summary}</p>
              <div className="flex items-center justify-between">
                <span className="font-label-md text-on-surface flex items-center gap-1.5 text-sm">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(featured.startsAt).toLocaleDateString('zh-CN')}
                </span>
                <button onClick={() => register(featured.id)} className="bg-primary text-on-primary font-label-md px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md bg-gradient-to-r from-primary to-primary-container text-sm">
                  {registered.includes(featured.id) ? '已预约' : '立即预约'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline-md text-lg font-semibold text-on-surface">近期活动</h3>
          <button onClick={() => setCategory('全部')} className="text-primary font-label-md text-sm">查看全部</button>
        </div>
        <div className="space-y-4">
          {upcoming.map((event, index) => {
            const Icon = iconMap[index % iconMap.length];
            return (
              <div key={event.id} onClick={() => navigate(`/events/${event.id}`)} className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4 shadow-sm border border-outline-variant/30 hover:border-primary/20 transition-colors cursor-pointer">
                <div className="w-14 h-14 shrink-0 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-label-md font-semibold text-on-surface truncate">{event.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-1">{new Date(event.startsAt).toLocaleString('zh-CN')}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); register(event.id); }} className="bg-tertiary text-on-tertiary px-4 py-1.5 rounded-full text-xs font-semibold hover:scale-105 active:scale-95 transition-all">
                  {registered.includes(event.id) ? '已报名' : '报名'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-12 mb-4 bg-tertiary-container/10 p-8 rounded-[32px] border-2 border-dashed border-tertiary-container/30 text-center">
        <CalendarPlus className="text-tertiary w-10 h-10 mx-auto mb-4" />
        <h3 className="font-headline-md text-lg font-bold text-on-surface mb-2">灵感火花</h3>
        <p className="text-on-surface-variant font-body-md text-sm mb-6 px-4">想要发起社区活动或工作坊？先把建议发给志愿者运营，下一版可以扩展成活动创建后台。</p>
        <button onClick={() => navigate('/messages')} className="border-2 border-tertiary text-tertiary font-label-md px-8 py-2.5 rounded-full hover:bg-tertiary hover:text-on-tertiary transition-all duration-300 text-sm">联系运营</button>
      </section>
    </div>
  );
}
