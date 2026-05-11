'use client';

import { X, Heart, Send, Save, Copy } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppContext } from '../../../src/context/AppContext';
import React, { useState, Suspense } from 'react';

function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const petId = searchParams?.get('petId') || 'p1';
  const { applyForPet, user, pets } = useAppContext();
  const pet = pets.find(p => p.id === petId) || pets[0];

  const [name, setName] = useState(user?.name || '');
  const [experience, setExperience] = useState('这是我第一次养宠');
  const [checked, setChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checked || !pet) return;

    await applyForPet(pet.id, {
      name,
      experience,
      date: new Date().toISOString().split('T')[0]
    });
    router.push('/profile');
  };

  if (!pet) {
    return <div className="min-h-screen bg-background text-on-background p-6">正在加载申请资料...</div>;
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen pb-40">
      <header className="fixed top-0 w-full z-50 shadow-[0_4px_20px_rgba(204,90,61,0.08)] bg-surface/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-4 h-16 w-full max-w-lg mx-auto">
          <button onClick={() => router.back()} className="text-primary hover:scale-105 transition-transform duration-200">
            <X className="w-6 h-6" />
          </button>
          <h1 className="font-headline-lg text-primary tracking-tight font-bold">领养申请</h1>
          <div className="w-6"></div>
        </div>
      </header>

      <main className="pt-20 px-4 max-w-lg mx-auto overflow-y-auto">
        <section className="mb-10 flex items-center gap-4 bg-surface-container-low p-4 rounded-xl shadow-[0_4px_20px_rgba(204,90,61,0.08)] border border-outline-variant/30">
          <div className="relative shrink-0">
            <img
              src={pet.image}
              alt={pet.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-primary-fixed"
            />
            <div className="absolute -bottom-1 -right-1 bg-tertiary text-on-tertiary p-1.5 rounded-full flex items-center justify-center">
              <Heart className="w-3 h-3 fill-current" />
            </div>
          </div>
          <div>
            <h2 className="font-headline-md text-xl font-bold text-primary">申请领养 {pet.name}</h2>
            <p className="font-label-md text-on-surface-variant uppercase tracking-wider text-xs font-semibold mt-1">最后一步：开启新的生活</p>
          </div>
        </section>

        <div className="flex justify-between items-center mb-8 px-2">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full warm-glow-gradient text-on-primary flex items-center justify-center font-bold text-sm">1</div>
            <span className="text-xs font-semibold text-primary">基础信息</span>
          </div>
          <div className="h-[2px] flex-1 mx-2 bg-outline-variant rounded-full mb-6"></div>
          <div className="flex flex-col items-center gap-2 opacity-50">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-sm">2</div>
            <span className="text-xs font-semibold text-on-surface">经验计划</span>
          </div>
          <div className="h-[2px] flex-1 mx-2 bg-outline-variant rounded-full mb-6 opacity-30"></div>
          <div className="flex flex-col items-center gap-2 opacity-50">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-sm">3</div>
            <span className="text-xs font-semibold text-on-surface">承诺签名</span>
          </div>
        </div>

        <form className="space-y-10" onSubmit={handleSubmit} id="apply-form">
          <fieldset className="space-y-6">
            <legend className="font-headline-md text-2xl font-bold text-on-surface mb-2">第一步：基础信息</legend>
            <div className="space-y-2">
              <label className="font-label-md text-sm font-semibold text-on-surface-variant inline-block">真实姓名</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="请输入您的全名" className="w-full h-14 px-4 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary-container transition-all outline-none" />
            </div>
            <div className="space-y-2">
              <label className="font-label-md text-sm font-semibold text-on-surface-variant inline-block">当前职业</label>
              <input type="text" placeholder="例如：软件设计师" className="w-full h-14 px-4 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary-container transition-all outline-none" />
            </div>
            <div className="space-y-2">
              <label className="font-label-md text-sm font-semibold text-on-surface-variant inline-block">居住环境描述</label>
              <textarea rows={4} placeholder="请描述您的居住环境" className="w-full p-4 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary-container transition-all resize-none outline-none"></textarea>
            </div>
          </fieldset>

          <fieldset className="space-y-6">
            <legend className="font-headline-md text-2xl font-bold text-on-surface mb-2">第二步：养宠经验</legend>
            <div className="space-y-4">
              <p className="font-label-md text-sm font-semibold text-on-surface-variant">您的养宠经验水平？</p>
              <div className="grid grid-cols-1 gap-3">
                {['这是我第一次养宠', '曾有过养宠经验', '资深"铲屎官"'].map(exp => (
                  <label key={exp} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors ${experience === exp ? 'border-2 border-primary-container bg-primary-fixed/10' : 'bg-surface-container hover:bg-secondary-fixed/20'}`}>
                    <input type="radio" name="experience" checked={experience === exp} onChange={() => setExperience(exp)} className="w-5 h-5 text-primary border-outline focus:ring-primary" />
                    <span className={`font-body-md text-sm ${experience === exp ? 'font-semibold' : ''}`}>{exp}</span>
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-6">
            <legend className="font-headline-md text-2xl font-bold text-on-surface mb-2">第三步：承诺与签名</legend>

            <div className="p-6 bg-tertiary-fixed/30 rounded-2xl border-l-4 border-tertiary relative overflow-hidden">
              <div className="absolute -top-4 -right-4 opacity-10">
                <Copy className="w-32 h-32" />
              </div>
              <p className="font-headline-md italic text-xl font-semibold text-tertiary mb-4">"领养誓言"</p>
              <p className="font-body-md text-on-tertiary-fixed-variant leading-relaxed text-sm">
                我郑重承诺将 {pet.name} 视为家庭成员，为其提供充足的食物、温暖的住所和必要的医疗照护。我承诺不因任何原因遗弃、转卖或虐待它。
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="mt-1">
                  <input type="checkbox" required checked={checked} onChange={(e) => setChecked(e.target.checked)} className="w-6 h-6 rounded text-primary border-outline focus:ring-primary" />
                </div>
                <span className="text-sm text-on-surface-variant leading-relaxed">我已阅读并同意 <span className="text-primary underline font-semibold">领养协议条款</span> 及 <span className="text-primary underline font-semibold">隐私政策</span>。</span>
              </label>
            </div>

            <div className="space-y-2 pt-4">
              <label className="font-label-md text-sm font-semibold text-on-surface-variant inline-block">手写签名 (请输入全名以确认)</label>
              <input type="text" required placeholder="在此输入您的姓名" className="w-full h-16 px-4 bg-surface-container-low border-b-2 border-outline focus:border-primary border-t-0 border-x-0 transition-all font-headline-md text-lg italic text-primary-container outline-none" />
            </div>
          </fieldset>
        </form>
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-lg border-t border-outline-variant/20 px-4 py-6 z-50">
        <div className="max-w-lg mx-auto flex flex-col gap-3">
          <button form="apply-form" type="submit" disabled={!checked} className="w-full h-14 warm-glow-gradient text-on-primary rounded-full font-label-md text-base font-semibold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all duration-150 relative disabled:opacity-50 disabled:active:scale-100">
            <span>提交领养申请</span>
            <Send className="w-5 h-5 absolute right-6" />
          </button>
          <button type="button" className="w-full h-12 bg-surface-container-highest text-on-surface rounded-full font-label-md text-base font-semibold flex items-center justify-center gap-2 hover:bg-secondary-fixed/20 active:scale-95 transition-all duration-150">
            <Save className="w-5 h-5" />
            <span>保存草稿</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background p-6">正在加载...</div>}>
      <ApplyForm />
    </Suspense>
  );
}
