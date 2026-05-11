'use client';

import React, { useState } from 'react';
import { EyeOff, Mail, ArrowLeft, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../../src/context/AppContext';

export default function Register() {
  const router = useRouter();
  const { register } = useAppContext();

  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(authMode === 'phone' ? { phone, code } : { email, password });
      router.push('/discover');
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-end overflow-hidden bg-background text-on-background font-body-md">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPr-P_JVEmrkA6um5bXJyAb6pjBYx2CpV2KJmYCY7C9cVNBj8DxYmfF76s-RjXKvUg3OeMer7_AKpVWq6J1pFWNY3au0PCmhEOC_BAtrFmms-L9idiMS3qpLZ7NABC7Z1tXYwKPmpAJVpc-o2bw9zDeeTJN0XEh7ld5d6_VkaJ1VK2H5cwNID6cobcAtKMQBgnq1ZidzALSSwShPlSqjVaX20LrBpNNR15nhDyFbLghFvx_3FC2lGrpqE0rMd-xDqGju3dr2sGMDE"
          alt="Register background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="relative z-10 w-full px-4 pb-4 max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-headline-lg-mobile text-white drop-shadow-md mb-2 font-bold tracking-tight text-3xl">Stray Stories</h1>
          <p className="text-white/90 font-body-md text-sm">每一个生命都值得被讲述</p>
        </div>

        <div className="frosted-paper rounded-[32px] p-8 shadow-[0_4px_20px_rgba(204,90,61,0.08)] w-full">
          <div className="text-center mb-6">
            <h2 className="font-headline-md text-2xl font-bold text-on-surface mb-2">欢迎加入</h2>
            <p className="text-on-surface-variant font-body-md text-sm">选择适合您的注册或登录方式</p>
          </div>

          <div className="flex bg-surface-container-low rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setAuthMode('phone')}
              className={`flex-1 py-2.5 font-label-md text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 ${authMode === 'phone' ? 'bg-white text-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <Smartphone className="w-4 h-4" />
              手机号
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('email')}
              className={`flex-1 py-2.5 font-label-md text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 ${authMode === 'email' ? 'bg-white text-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <Mail className="w-4 h-4" />
              邮箱号
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            {authMode === 'phone' ? (
              <>
                <div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface font-semibold border-r border-outline-variant/30 pr-3">+86</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="请输入手机号"
                      required
                      className="w-full h-14 bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-2xl pl-[4.5rem] pr-5 text-on-surface placeholder:text-outline-variant transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative flex gap-2">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="验证码"
                      required
                      className="flex-1 h-14 bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-2xl px-5 text-on-surface placeholder:text-outline-variant transition-all outline-none"
                    />
                    <button type="button" className="shrink-0 h-14 px-4 bg-primary-container text-on-primary-container font-label-md text-sm rounded-2xl active:scale-95 transition-all font-semibold">
                      获取验证码
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="请输入电子邮箱"
                    required
                    className="w-full h-14 bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-2xl px-5 text-on-surface placeholder:text-outline-variant transition-all outline-none"
                  />
                </div>
                <div>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="设置密码 (至少6位)"
                      required
                      className="w-full h-14 bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-2xl px-5 pr-12 text-on-surface placeholder:text-outline-variant transition-all outline-none"
                    />
                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface">
                      <EyeOff className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {error && <p className="text-error text-sm text-center">{error}</p>}
            <button type="submit" disabled={submitting} className="warm-glow-gradient w-full h-14 rounded-2xl text-white font-label-md shadow-lg active:scale-95 transition-all duration-150 mt-6 text-base tracking-wide font-bold disabled:opacity-60">
              {submitting ? '正在注册...' : authMode === 'phone' ? '登录 / 注册' : '注册账号'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-body-md font-body-md text-on-surface-variant text-sm">
              已有账号？{' '}
              <button type="button" onClick={() => router.push('/login')} className="text-primary font-bold hover:underline decoration-2 underline-offset-4 cursor-pointer">
                立即登录
              </button>
            </p>
          </div>
        </div>

        <footer className="mt-6 mb-2">
          <div className="flex justify-center gap-6 font-label-md text-white/70 text-xs">
            <span className="hover:text-white transition-colors cursor-pointer">隐私政策</span>
            <span className="hover:text-white transition-colors cursor-pointer">服务条款</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
