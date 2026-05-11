'use client';

import { MessageSquare, Eye, Heart, MapPin, Clock, Plus, X, Camera } from 'lucide-react';
import { cn } from '../../../src/lib/utils';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ReportItem } from '../../../src/lib/api';
import { useAppContext } from '../../../src/context/AppContext';

const fallbackImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2mjFj-OBadwlFMxoZNvC8hEjby10oeVHKchbHhaO0VeOxVtj51E2NYZxGHvJz6E0g5lBPhGlLXgHGTkKHj8EjXBPdDvGxbsXWUgVjQq_4lMKjqS-UrSndYDY2vx2ti2w-AxJL-O1T2vA2KbUvJAZiqx3B1f-Fp6sFPNCW4r0lGJSw-xjm_eOBDKqmeej_Se03loxiiUOEs0aONwqXP290oXEtgraTsuvReG63BqP2nP8O7Uf6ubw5YkXgk7yTc7QyN37PvmrUTEQ';

export default function ReportPage() {
  const [filter, setFilter] = useState('全部报告');
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishType, setPublishType] = useState('丢失');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [title, setTitle] = useState('');
  const [species, setSpecies] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  const router = useRouter();
  const { user } = useAppContext();

  useEffect(() => {
    api.getReports(filter).then(({ reports }) => setReports(reports));
  }, [filter]);

  const handleSelectLocation = () => {
    setSelectedLocation('朝阳区 幸福小区东门附近');
    setShowLocationPicker(false);
  };

  const submitReport = async () => {
    const result = await api.createReport({
      userId: user?.id,
      title: title || (publishType === '目击' ? '未命名目击' : '未命名宠物'),
      reportType: publishType as ReportItem['reportType'],
      species,
      location: selectedLocation || '未选择地点',
      happenedAt: new Date().toISOString(),
      description,
      image: fallbackImage,
      reward: reward ? Number(reward) : null,
    });
    setReports(prev => [result.report, ...prev]);
    setIsPublishing(false);
    setTitle('');
    setSpecies('');
    setDescription('');
    setReward('');
    setSelectedLocation('');
  };

  const badgeClass = (type: string) => {
    if (type === '丢失') return 'bg-error text-white';
    if (type === '已团聚') return 'bg-tertiary text-white';
    return 'bg-secondary text-white';
  };

  return (
    <div className="px-4 pt-4 pb-20 overflow-y-auto relative h-full">
      <div className="flex overflow-x-auto space-x-3 mb-8 hide-scrollbar -mx-4 px-4">
        {['全部报告', '丢失宠物', '最新目击', '重聚故事'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={cn("whitespace-nowrap px-6 py-2 rounded-full font-label-md text-sm transition-all duration-200", filter === f ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high")}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reports.map(report => (
          <div key={report.id} onClick={() => router.push(`/reports/${report.id}`)} className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(204,90,61,0.08)] hover:scale-[1.02] transition-transform duration-300 relative border border-surface-container/50 cursor-pointer">
            <div className="absolute top-4 left-4 z-10">
              <span className={cn("px-3 py-1 rounded-full text-[12px] font-bold tracking-wider shadow-sm", badgeClass(report.reportType))}>{report.reportType}</span>
            </div>
            <div className={cn("h-64 w-full bg-surface-dim overflow-hidden", report.reportType === '已团聚' && 'opacity-90 grayscale-[20%]')}>
              <img src={report.image || fallbackImage} alt={report.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-headline-md text-xl font-bold text-primary">{report.title}</h3>
                <span className="text-on-surface-variant font-label-md text-sm">{report.species}</span>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant mb-4 line-clamp-2 mt-2">{report.description}</p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-on-surface-variant"><MapPin className="w-4 h-4 mr-2" /><span className="text-sm">{report.location}</span></div>
                <div className="flex items-center text-on-surface-variant"><Clock className="w-4 h-4 mr-2" /><span className="text-sm">{new Date(report.happenedAt).toLocaleString('zh-CN')}</span></div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); router.push(`/reports/${report.id}`); }} className={cn("w-full py-3.5 rounded-xl font-label-md text-sm transition-all active:scale-95 flex justify-center items-center gap-2", report.reportType === '丢失' ? 'warm-glow-gradient text-white shadow-md' : 'bg-surface-container text-on-surface hover:bg-surface-container-high')}>
                {report.reportType === '丢失' ? <MessageSquare className="w-5 h-5" /> : report.reportType === '已团聚' ? <Heart className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                {report.reportType === '丢失' ? '联系主人' : '查看详情'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setIsPublishing(true)} className="fixed bottom-24 right-6 w-16 h-16 warm-glow-gradient text-white rounded-full shadow-lg z-40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
        <Plus className="w-8 h-8" />
      </button>

      {isPublishing && (
        <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-background z-[100] flex flex-col shadow-2xl">
          <div className="shrink-0 bg-background/90 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-surface-container z-10">
            <button onClick={() => setIsPublishing(false)} className="p-2 -ml-2 rounded-full hover:bg-surface-container text-on-surface"><X className="w-6 h-6" /></button>
            <h2 className="font-headline-md text-lg font-bold">发布信息</h2>
            <button onClick={submitReport} className="text-primary font-bold text-sm px-4 py-2 hover:bg-primary-container rounded-full transition-colors">发布</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-8">
            <div className="flex rounded-xl overflow-hidden bg-surface-container p-1">
              {['丢失', '目击', '随手拍'].map(type => (
                <button key={type} type="button" onClick={() => setPublishType(type)} className={cn("flex-1 py-2 text-sm font-label-md rounded-lg transition-all", publishType === type ? "bg-white text-on-surface shadow-sm font-bold" : "text-on-surface-variant")}>{type}</button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-2">照片</label>
              <div className="w-full h-40 bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-outline-variant">
                <Camera className="w-8 h-8 mb-2" />
                <span className="text-sm font-label-md">当前 demo 使用默认图片</span>
              </div>
            </div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="宠物名称/称呼" className="w-full h-14 bg-surface-container-low rounded-2xl px-5 outline-none" />
            <input value={species} onChange={(e) => setSpecies(e.target.value)} placeholder="品种或特征" className="w-full h-14 bg-surface-container-low rounded-2xl px-5 outline-none" />
            <div onClick={() => setShowLocationPicker(true)} className="relative cursor-pointer">
              <input value={selectedLocation} readOnly placeholder="点击选择位置" className="w-full h-14 bg-surface-container-low rounded-2xl px-12 outline-none pointer-events-none" />
              <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="详情描述" className="w-full bg-surface-container-low rounded-2xl p-5 outline-none resize-none" />
            {publishType === '丢失' && <input value={reward} onChange={(e) => setReward(e.target.value)} type="number" placeholder="悬赏金额（选填）" className="w-full h-14 bg-surface-container-low rounded-2xl px-5 outline-none" />}
            <button onClick={submitReport} className="warm-glow-gradient w-full h-14 rounded-2xl text-white font-label-md text-base shadow-lg active:scale-95 transition-all duration-150 font-bold">立即发布{publishType}信息</button>
          </div>
        </div>
      )}

      {showLocationPicker && (
        <div className="fixed inset-0 bg-background z-[110] flex flex-col">
          <div className="sticky top-0 bg-surface px-4 py-4 flex items-center justify-between border-b border-surface-container z-10 shadow-sm">
            <button onClick={() => setShowLocationPicker(false)} className="p-2 -ml-2 rounded-full hover:bg-surface-container text-on-surface"><X className="w-6 h-6" /></button>
            <h2 className="font-headline-md text-lg font-bold">选择地点</h2>
            <div className="w-10" />
          </div>
          <div className="flex-1 relative">
            <div className="w-full h-full bg-surface-container-high" />
            <div className="absolute bottom-0 left-0 w-full bg-surface rounded-t-3xl shadow-[0_-8px_24px_rgba(0,0,0,0.1)] p-6">
              <h3 className="font-headline-md text-base font-bold mb-2">当前位置</h3>
              <p className="text-on-surface-variant font-body-md text-sm mb-6">朝阳区 幸福小区东门附近</p>
              <button onClick={handleSelectLocation} className="w-full h-14 bg-primary text-white rounded-2xl font-bold active:scale-95 transition-transform">确认选择</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
