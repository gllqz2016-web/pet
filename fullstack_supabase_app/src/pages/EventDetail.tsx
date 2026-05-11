import { ArrowLeft, CalendarDays, MapPin, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, EventItem } from '../lib/api';
import { useAppContext } from '../context/AppContext';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (id) api.getEvent(id).then(({ event }) => setEvent(event));
  }, [id]);

  const register = async () => {
    if (!user?.id || !event) return;
    await api.registerEvent(user.id, event.id);
    setRegistered(true);
  };

  if (!event) return <div className="min-h-screen bg-background p-6">正在加载活动...</div>;

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="relative h-72 bg-surface-container-high overflow-hidden">
        {event.image ? <img src={event.image} alt={event.title} className="w-full h-full object-cover" /> : <div className="w-full h-full botanical-gradient opacity-80" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-6 left-5 w-10 h-10 rounded-full bg-black/35 text-white backdrop-blur flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute left-6 right-6 bottom-6 text-white">
          <span className="bg-secondary px-3 py-1 rounded-full text-xs font-bold">{event.category}</span>
          <h1 className="mt-3 text-3xl font-bold font-headline-md">{event.title}</h1>
        </div>
      </div>
      <main className="px-margin-mobile pt-6 max-w-lg mx-auto space-y-5">
        <p className="text-on-surface-variant leading-relaxed">{event.description}</p>
        <div className="bg-surface rounded-2xl p-5 space-y-4 shadow-[0_4px_20px_rgba(204,90,61,0.08)]">
          <div className="flex gap-3 text-sm"><CalendarDays className="w-5 h-5 text-primary" /><span>{new Date(event.startsAt).toLocaleString('zh-CN')}</span></div>
          <div className="flex gap-3 text-sm"><MapPin className="w-5 h-5 text-primary" /><span>{event.location}</span></div>
          <div className="flex gap-3 text-sm"><Users className="w-5 h-5 text-primary" /><span>限额 {event.capacity} 人</span></div>
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur border-t border-outline-variant/20 px-margin-mobile py-5">
        <button onClick={register} disabled={registered} className="max-w-lg mx-auto block w-full h-14 rounded-full warm-glow-gradient text-white font-bold disabled:opacity-60">
          {registered ? '已报名' : '立即报名'}
        </button>
      </footer>
    </div>
  );
}
