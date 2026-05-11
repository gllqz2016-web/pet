'use client';

import { ArrowLeft, Clock, HeartHandshake, MapPin, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api, ReportItem } from '../../../../src/lib/api';

export default function ReportDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || '';
  const router = useRouter();
  const [report, setReport] = useState<ReportItem | null>(null);
  const [helped, setHelped] = useState(false);

  useEffect(() => {
    if (id) api.getReport(id).then(({ report }) => setReport(report));
  }, [id]);

  if (!report) return <div className="min-h-screen bg-background p-6">正在加载报告...</div>;

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="relative h-72 bg-surface-container-high overflow-hidden">
        {report.image ? <img src={report.image} alt={report.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-surface-container" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        <button onClick={() => router.back()} className="absolute top-6 left-5 w-10 h-10 rounded-full bg-black/35 text-white backdrop-blur flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute left-6 right-6 bottom-6 text-white">
          <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold">{report.reportType}</span>
          <h1 className="mt-3 text-3xl font-bold font-headline-md">{report.title}</h1>
          <p className="mt-1 text-white/80">{report.species}</p>
        </div>
      </div>
      <main className="px-4 pt-6 max-w-lg mx-auto space-y-5">
        <div className="bg-surface rounded-2xl p-5 shadow-[0_4px_20px_rgba(204,90,61,0.08)]">
          <h2 className="font-bold text-lg mb-3">详情描述</h2>
          <p className="text-on-surface-variant leading-relaxed">{report.description}</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-5 space-y-3 text-sm">
          <div className="flex gap-3"><MapPin className="w-5 h-5 text-primary" /><span>{report.location}</span></div>
          <div className="flex gap-3"><Clock className="w-5 h-5 text-primary" /><span>{new Date(report.happenedAt).toLocaleString('zh-CN')}</span></div>
          {report.reward ? <div className="flex gap-3"><HeartHandshake className="w-5 h-5 text-primary" /><span>悬赏 ¥{report.reward}</span></div> : null}
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur border-t border-outline-variant/20 px-4 py-5">
        <button onClick={() => setHelped(true)} className="max-w-lg mx-auto w-full h-14 rounded-full warm-glow-gradient text-white font-bold flex items-center justify-center gap-2">
          <MessageSquare className="w-5 h-5" />
          {helped ? '已发送帮助意向' : '我可以提供帮助'}
        </button>
      </footer>
    </div>
  );
}
