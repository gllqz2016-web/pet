'use client';

import { Search, SlidersHorizontal, AlertCircle, CheckCircle2, Eye, MapPin, Plus, Minus, Megaphone, LocateFixed, Loader2, X, Clock, Camera } from 'lucide-react';
import { cn } from '../../../src/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, ReportItem } from '../../../src/lib/api';
import { useAppContext } from '../../../src/context/AppContext';

export default function MapPage() {
  const router = useRouter();
  const { user } = useAppContext();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [showLocationToast, setShowLocationToast] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [showHelpToast, setShowHelpToast] = useState(false);

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishType, setPublishType] = useState('目击');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    api.getReports('全部报告').then(({ reports }) => setReports(reports));
  }, []);

  const handleLocate = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setShowLocationToast(true);
      setTimeout(() => setShowLocationToast(false), 2000);
    }, 1000);
  };

  const handleHelp = () => {
    setSelectedReport(null);
    setShowHelpToast(true);
    setTimeout(() => setShowHelpToast(false), 2000);
  };

  const handleSelectLocation = () => {
    setSelectedLocation('当前地图位置');
    setShowLocationPicker(false);
  };

  const submitMapReport = async () => {
    const result = await api.createReport({
      userId: user?.id,
      title: publishType === '目击' ? '地图目击报告' : '地图发布信息',
      reportType: publishType as ReportItem['reportType'],
      species: '',
      location: selectedLocation || '当前地图位置',
      happenedAt: new Date().toISOString(),
      description: '来自地图页的快速发布。',
      image: reports[0]?.image || '',
    });
    setReports(prev => [result.report, ...prev]);
    setIsPublishing(false);
  };

  return (
    <div className="absolute inset-0 z-0 h-[calc(100vh-64px-80px)] overflow-hidden">
      {showLocationToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface px-4 py-2 rounded-full shadow-lg text-sm font-label-md z-50">
          已定位到当前位置
        </div>
      )}
      {showHelpToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full shadow-lg text-sm font-label-md z-50">
          已发送帮助意向，发起人会尽快与您联系
        </div>
      )}
      <div className="absolute inset-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkCgzHVyb1jaQZmUQ_Otuz-JHyYQmQa0NqxifQ1JgEJ39W5pFO29HNvSpFbuJKi538Ae3_HMpxLYITH1yXqkASKPGIYxjWYL2Ap1cxQ-tjeLfJYXRsLyIcRdsRBU5lKRxO7jMKmpJ2BpS8ldLFjsRq9oxZHv-h3Ut-Z2KnoLhhyvxkHv1WcRV-baPWBf--XSNLM0XuF9-D2XUYHrEy65y0eiRhlBZlQzc-BTu7z6uR1slUeUXzbY7_1now2freF0TulPsK0B7ZCcE"
          alt="Map Background Placeholder"
          className="w-full h-[calc(100vh)] object-cover opacity-60 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-surface/40 map-gradient-overlay pointer-events-none"></div>
      </div>

      <div className="absolute inset-0 pointer-events-none mt-4">
        <div className="absolute top-4 left-0 w-full px-4 z-20 flex flex-col gap-3 pointer-events-auto">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="搜索地点或救助站..."
              className="w-full h-12 bg-surface-container-lowest/90 border-none rounded-full px-12 shadow-md focus:ring-2 focus:ring-primary/20 text-on-surface-variant font-body-md placeholder:text-outline-variant outline-none backdrop-blur-md"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          </div>

          <div className="flex justify-center mt-2">
            <div className="bg-surface-container-high/90 backdrop-blur-sm p-1 rounded-full flex shadow-sm border border-outline-variant/30">
              <button className="px-6 py-1.5 rounded-full font-label-md transition-all duration-200 bg-primary text-on-primary">地图视图</button>
              <button className="px-6 py-1.5 rounded-full font-label-md transition-all duration-200 text-on-surface-variant hover:bg-surface-variant">列表视图</button>
            </div>
          </div>
        </div>

        <div className="absolute top-[35%] left-[25%] pointer-events-auto flex flex-col items-center">
          <div className="bg-error text-on-error p-2 rounded-full shadow-lg animate-pulse">
            <AlertCircle className="w-6 h-6 fill-current stroke-error" />
          </div>
          <div className="mt-1 bg-surface-container-lowest px-2 py-1 rounded shadow-sm border border-error/20">
            <p className="text-[10px] font-bold text-error">紧急医疗</p>
          </div>
        </div>

        <div className="absolute top-[50%] left-[60%] pointer-events-auto flex flex-col items-center">
          <div className="bg-tertiary text-on-tertiary p-2 rounded-full shadow-lg">
            <CheckCircle2 className="w-6 h-6 fill-current stroke-tertiary" />
          </div>
          <div className="mt-1 bg-surface-container-lowest px-2 py-1 rounded shadow-sm border border-tertiary/20">
            <p className="text-[10px] font-bold text-tertiary">已确认安全</p>
          </div>
        </div>

        <div className="absolute top-[20%] left-[50%] pointer-events-auto flex flex-col items-center">
          <div className="bg-secondary text-on-secondary p-2 rounded-full shadow-lg">
            <Eye className="w-6 h-6 fill-current stroke-secondary" />
          </div>
          <div className="mt-1 bg-surface-container-lowest px-2 py-1 rounded shadow-sm border border-secondary/20">
            <p className="text-[10px] font-bold text-secondary">最新发现</p>
          </div>
        </div>
      </div>

      <div className="absolute right-4 bottom-[220px] flex flex-col items-end gap-3 z-20 pointer-events-auto">
        <button
          onClick={() => { setPublishType('目击'); setIsPublishing(true); }}
          className="bg-primary text-on-primary flex items-center justify-center gap-1.5 px-4 py-3 rounded-full shadow-[0_6px_16px_rgba(204,90,61,0.3)] hover:scale-105 active:scale-95 transition-all duration-200 outline-none relative z-40"
        >
          <Megaphone className="w-4 h-4 fill-current" />
          <span className="font-label-md text-sm font-bold">发布</span>
        </button>

        <button
          onClick={handleLocate}
          className="w-12 h-12 bg-surface shadow-lg rounded-xl flex items-center justify-center active:scale-95 transition-all outline-none"
        >
          {isLocating ? (
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          ) : (
            <LocateFixed className="w-6 h-6 text-primary" />
          )}
        </button>
        <div className="flex flex-col bg-surface shadow-lg rounded-xl overflow-hidden w-12">
          <button className="w-12 h-12 flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all outline-none">
            <Plus className="w-6 h-6" />
          </button>
          <div className="h-[1px] w-8 mx-auto bg-outline-variant/30"></div>
          <button className="w-12 h-12 flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all outline-none">
            <Minus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-surface-container-lowest rounded-t-[32px] shadow-[0_-8px_40px_rgba(0,0,0,0.08)] z-30 flex flex-col">
        <div className="w-full flex flex-col items-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full"></div>
          <h3 className="font-headline-md text-sm font-semibold text-on-surface mt-2 mb-2">附近动态</h3>
        </div>

        <div className="flex gap-4 overflow-x-auto px-4 pb-6 hide-scrollbar">
          {reports.slice(0, 5).map(report => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="flex-shrink-0 w-64 bg-surface rounded-2xl p-3 shadow-sm border border-surface-container cursor-pointer hover:bg-surface-container-low transition-colors"
            >
              <div className="flex gap-3">
                <img src={report.image} alt={report.title} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <span className="bg-error-container text-on-error-container text-[10px] px-2 py-0.5 rounded-full font-bold">{report.reportType}</span>
                    <h4 className="font-label-md text-[14px] mt-1 line-clamp-1">{report.title}</h4>
                  </div>
                  <p className="text-on-surface-variant text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {report.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedReport && (
        <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-background z-[100] flex flex-col shadow-2xl">
          <div className="relative shrink-0 h-64 w-full">
            <img
              src={selectedReport.image}
              alt={selectedReport.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <button
                onClick={() => setSelectedReport(null)}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-bold",
                  selectedReport.reportType === '丢失' ? 'bg-error text-on-error' : 'bg-tertiary text-on-tertiary'
                )}>
                  {selectedReport.reportType}
                </span>
                <span className="text-white/80 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(selectedReport.happenedAt).toLocaleString('zh-CN')}</span>
              </div>
              <h2 className="font-headline-md text-2xl font-bold">{selectedReport.title}</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-surface pt-6 px-4 pb-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-primary/20">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedReport.id}`} alt="avatar" className="w-full h-full object-cover bg-surface-container-highest" />
              </div>
              <div className="flex-1 pt-1">
                <h4 className="font-label-md text-base">社区用户</h4>
                <p className="text-on-surface-variant text-sm flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedReport.location}
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container">
              <h3 className="font-label-md font-bold mb-2">详情描述</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-wrap">
                {selectedReport.description}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleHelp}
                className="warm-glow-gradient w-full py-4 rounded-xl text-white font-label-md text-base shadow-lg active:scale-95 transition-all outline-none font-bold"
              >
                我可以提供帮助
              </button>
            </div>
          </div>
        </div>
      )}

      {isPublishing && (
        <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-background z-[100] flex flex-col shadow-2xl">
          <div className="shrink-0 bg-background/90 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-surface-container z-10">
            <button onClick={() => setIsPublishing(false)} className="p-2 -ml-2 rounded-full hover:bg-surface-container text-on-surface">
              <X className="w-6 h-6" />
            </button>
            <h2 className="font-headline-md text-lg font-bold">发布信息</h2>
            <button
              onClick={submitMapReport}
              className="text-primary font-bold text-sm px-4 py-2 hover:bg-primary-container rounded-full transition-colors"
            >
              发布
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-8">
            <div className="flex rounded-xl overflow-hidden bg-surface-container p-1">
              {['丢失', '目击', '随手拍'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPublishType(type)}
                  className={cn(
                    "flex-1 py-2 text-sm font-label-md rounded-lg transition-all",
                    publishType === type
                      ? "bg-white text-on-surface shadow-sm font-bold"
                      : "text-on-surface-variant"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-2">照片</label>
              <div className="w-full h-40 bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-outline-variant hover:bg-surface-container transition-colors cursor-pointer active:scale-[0.98]">
                <Camera className="w-8 h-8 mb-2" />
                <span className="text-sm font-label-md">点击或拖拽上传照片</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-2">宠物名称/称呼 {publishType === '丢失' && <span className="text-error">*</span>}</label>
              <input
                type="text"
                placeholder="例如：小黑"
                className="w-full h-14 bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-2xl px-5 text-on-surface placeholder:text-outline-variant transition-all outline-none"
              />
            </div>

            <div
              className="relative cursor-pointer"
              onClick={() => setShowLocationPicker(true)}
            >
              <input
                type="text"
                value={selectedLocation}
                readOnly
                placeholder="点击选择位置"
                className="w-full h-14 bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-2xl px-12 text-on-surface placeholder:text-outline-variant transition-all outline-none cursor-pointer pointer-events-none"
              />
              <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
            </div>

            <div className="pt-2">
              <button
                onClick={submitMapReport}
                className="warm-glow-gradient w-full h-14 rounded-2xl text-white font-label-md text-base shadow-lg active:scale-95 transition-all duration-150 font-bold"
              >
                立即发布{publishType}信息
              </button>
            </div>
          </div>
        </div>
      )}

      {showLocationPicker && (
        <div className="fixed inset-0 bg-background z-[110] flex flex-col">
          <div className="sticky top-0 bg-surface px-4 py-4 flex items-center justify-between border-b border-surface-container z-10 shadow-sm">
            <button onClick={() => setShowLocationPicker(false)} className="p-2 -ml-2 rounded-full hover:bg-surface-container text-on-surface">
              <X className="w-6 h-6" />
            </button>
            <h2 className="font-headline-md text-lg font-bold">选择地点</h2>
            <div className="w-10"></div>
          </div>

          <div className="flex-1 relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkCgzHVyb1jaQZmUQ_Otuz-JHyYQmQa0NqxifQ1JgEJ39W5pFO29HNvSpFbuJKi538Ae3_HMpxLYITH1yXqkASKPGIYxjWYL2Ap1cxQ-tjeLfJYXRsLyIcRdsRBU5lKRxO7jMKmpJ2BpS8ldLFjsRq9oxZHv-h3Ut-Z2KnoLhhyvxkHv1WcRV-baPWBf--XSNLM0XuF9-D2XUYHrEy65y0eiRhlBZlQzc-BTu7z6uR1slUeUXzbY7_1now2freF0TulPsK0B7ZCcE"
              alt="Map Background"
              className="w-full h-[calc(100vh)] object-cover opacity-60 mix-blend-multiply"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex flex-col items-center pointer-events-none">
              <div className="flex-1 p-2 bg-primary text-white rounded-full shadow-lg">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="w-1 h-3 bg-primary"></div>
              <div className="w-2 h-1 bg-black/30 rounded-full blur-[1px]"></div>
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-surface rounded-t-3xl shadow-[0_-8px_24px_rgba(0,0,0,0.1)] p-6">
              <h3 className="font-headline-md text-base font-bold mb-2">当前地图位置</h3>
              <p className="text-on-surface-variant font-body-md text-sm mb-6">滑动地图选择，点击确认</p>
              <button
                onClick={handleSelectLocation}
                className="w-full h-14 bg-primary text-white rounded-2xl font-bold active:scale-95 transition-transform"
              >
                确认选择
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
