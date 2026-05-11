'use client';

import { Edit2, ChevronRight, Info, Heart, BellRing, Eye, Shield, LogOut } from 'lucide-react';
import { cn } from '../../../src/lib/utils';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../../src/context/AppContext';
import { useEffect, useState } from 'react';
import { api } from '../../../src/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, favorites, toggleFavorite, applications, pets } = useAppContext();
  const [adoptionUpdates, setAdoptionUpdates] = useState(true);
  const [sightingReports, setSightingReports] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    api.getNotificationPreferences(user.id).then(({ preferences }) => {
      setAdoptionUpdates(preferences.adoptionUpdates);
      setSightingReports(preferences.sightingReports);
    });
  }, [user?.id]);

  const updatePreferences = async (next: { adoptionUpdates: boolean; sightingReports: boolean }) => {
    setAdoptionUpdates(next.adoptionUpdates);
    setSightingReports(next.sightingReports);
    if (user?.id) {
      await api.updateNotificationPreferences(user.id, next);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const savedPets = favorites.map(id => pets.find(p => p.id === id)).filter(Boolean) as typeof pets;

  return (
    <div className="px-4 pt-4 pb-12 overflow-y-auto">
      <section className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-secondary-fixed shadow-md overflow-hidden bg-surface-container flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-outline-variant">{user?.name ? user.name[0] : '?'}</span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full border-2 border-surface shadow-sm cursor-pointer hover:bg-primary-container hover:text-on-primary-container transition-colors">
            <Edit2 className="text-surface w-3.5 h-3.5" />
          </div>
        </div>
        <h2 className="font-headline-md text-on-surface mb-1">{user?.name || 'Guest'}</h2>
        <p className="font-label-md text-on-surface-variant mb-6">加入时间: 2023年5月</p>

        <div className="grid grid-cols-3 gap-2 w-full bg-surface-container rounded-xl p-4 shadow-[0_4px_20px_rgba(204,90,61,0.04)]">
          <div className="flex flex-col">
            <span className="font-headline-md text-primary text-xl">12</span>
            <span className="text-[10px] uppercase font-bold text-outline tracking-wider">救助动物</span>
          </div>
          <div className="flex flex-col border-x border-outline-variant/30">
            <span className="font-headline-md text-primary text-xl">28</span>
            <span className="text-[10px] uppercase font-bold text-outline tracking-wider">报告目击</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-primary text-xl">150+</span>
            <span className="text-[10px] uppercase font-bold text-outline tracking-wider">影响生命</span>
          </div>
        </div>
      </section>

      {applications.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-md text-lg font-semibold text-on-surface">申请进度</h3>
            <span className="text-primary font-label-md text-sm cursor-pointer">查看全部</span>
          </div>
          <div className="space-y-4">
            {applications.map((app, idx) => {
              const pet = pets.find(p => p.id === app.petId);
              if (!pet) return null;

              const isPending = app.status === '正在审核';

              return (
                <div key={app.petId + idx} className={cn("bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_20px_rgba(204,90,61,0.08)] border border-surface-container cursor-pointer transition-all", isPending ? "hover:border-primary/30" : "opacity-80 hover:opacity-100")}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className={cn("w-10 h-10 rounded-lg object-cover", !isPending && "grayscale")}
                      />
                      <div>
                        <p className="font-label-md font-bold text-on-surface">{pet.name}</p>
                        <p className={cn("text-[12px] font-medium", isPending ? "text-secondary" : "text-on-surface-variant")}>{app.status}</p>
                      </div>
                    </div>
                    {isPending ? <ChevronRight className="text-outline w-5 h-5" /> : <Info className="text-outline w-5 h-5" />}
                  </div>
                  <div className={cn("w-full h-2 rounded-full overflow-hidden", isPending ? "bg-surface-container" : "bg-surface-container-high")}>
                    <div className={cn("h-full rounded-full", isPending ? "botanical-gradient w-[65%] opacity-90" : "bg-outline-variant w-full")}></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-outline">{isPending ? '已提交' : '流程已关闭'}</span>
                    <span className="text-[10px] text-outline font-bold">{isPending ? '最终决定' : app.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {savedPets.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-md text-lg font-semibold text-on-surface">我收藏的伙伴</h3>
            <span className="text-primary font-label-md text-sm cursor-pointer">管理</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {savedPets.map(pet => (
              <div key={pet.id} onClick={() => router.push(`/pets/${pet.id}`)} className="bg-surface-container-lowest rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(204,90,61,0.08)] hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
                <div className="relative h-40">
                  <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(pet.id); }}
                    className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-1.5 rounded-full"
                  >
                    <Heart className="text-primary w-5 h-5 fill-current" />
                  </button>
                </div>
                <div className="p-4">
                  <h4 className="font-headline-md text-lg mb-1 truncate">{pet.name}</h4>
                  <div className="flex flex-wrap gap-1">
                    {pet.tags.slice(0, 2).map(tag => (
                      <span key={tag} className={cn("px-2 py-0.5 text-[10px] rounded-full font-bold", tag === '亲人' ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-tertiary-fixed text-on-tertiary-fixed")}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h3 className="font-headline-md text-lg font-semibold text-on-surface mb-4">通知设置</h3>
        <div className="bg-surface-container-low rounded-2xl overflow-hidden divide-y divide-outline-variant/30 text-sm">
          <div className="flex items-center justify-between p-4 bg-white/40">
            <div className="flex items-center gap-3">
              <BellRing className="text-on-surface-variant w-5 h-5" />
              <span className="font-label-md text-on-surface font-semibold">领养动态提醒</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={adoptionUpdates}
                onChange={(event) => updatePreferences({ adoptionUpdates: event.target.checked, sightingReports })}
              />
              <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/40">
            <div className="flex items-center gap-3">
              <Eye className="text-on-surface-variant w-5 h-5" />
              <span className="font-label-md text-on-surface font-semibold">周围目击报告</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={sightingReports}
                onChange={(event) => updatePreferences({ adoptionUpdates, sightingReports: event.target.checked })}
              />
              <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-container-high transition-colors bg-white/40">
            <div className="flex items-center gap-3">
              <Shield className="text-on-surface-variant w-5 h-5" />
              <span className="font-label-md text-on-surface font-semibold">账户与隐私</span>
            </div>
            <ChevronRight className="text-outline w-5 h-5" />
          </div>
        </div>
      </section>

      <button
        onClick={handleLogout}
        className="w-full py-4 bg-error-container text-on-error-container font-label-md rounded-2xl flex items-center justify-center gap-2 mb-4 hover:opacity-90 transition-opacity active:scale-95"
      >
        <LogOut className="w-5 h-5" />
        退出登录
      </button>
    </div>
  );
}
