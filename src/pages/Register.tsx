import React, { useState } from 'react';
import { EyeOff, Mail, ArrowLeft, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Register() {
  const navigate = useNavigate();
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
      navigate('/');
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
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="relative z-10 w-full px-margin-mobile pb-margin-mobile max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-white drop-shadow-md mb-2 font-bold tracking-tight">Stray Stories</h1>
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
            <button type="submit" disabled={submitting} className="warm-glow-gradient w-full h-14 rounded-2xl text-white font-label-md text-label-md shadow-lg active:scale-95 transition-all duration-150 mt-6 text-base tracking-wide font-bold disabled:opacity-60">
              {submitting ? '正在注册...' : authMode === 'phone' ? '登录 / 注册' : '注册账号'}
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30"></div>
            </div>
            <div className="relative flex justify-center text-label-md">
              <span className="bg-[#f2efe9] px-4 text-outline-variant text-[12px] font-semibold tracking-wider uppercase">或使用以下方式快捷登录</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button className="flex flex-col items-center justify-center gap-1.5 h-16 bg-white/60 border border-outline-variant/30 rounded-2xl hover:bg-surface-container-low transition-colors active:scale-95 text-[#000000]">
              <svg viewBox="0 0 384 512" fill="currentColor" className="w-5 h-5"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-48.3-24.1-84.8-24.1-39.2 0-77 22.4-98.3 58-45 74.9-14.7 197.8 28.5 260.6 21.6 31.4 46 66.4 80.2 65.5 32.8-.9 45.4-20.9 84.7-20.9 38.6 0 50.4 20.9 84.7 20.4 35.2-.5 56.2-32.9 77.2-64.3 24.3-36.5 34.3-71.8 35-73.6-.9-.3-59.5-22.3-59.5-89M256.4 126.9c18.5-22.4 31.4-53.7 28.1-85-28.5 1.1-61.9 19.3-81.2 41.9-16.7 19.3-31.5 51.5-27.4 82.2 31.5 2.5 62-16.8 80.5-39.1"/></svg>
            </button>
            <button className="flex flex-col items-center justify-center gap-1.5 h-16 bg-white/60 border border-outline-variant/30 rounded-2xl hover:bg-surface-container-low transition-colors active:scale-95 text-[#07C160]">
              <svg viewBox="0 0 1024 1024" fill="currentColor" className="w-6 h-6"><path d="M683.4 358.5c-15.3 0-30.2 1.4-44.5 4.3-33-87.8-117.8-150.1-218.4-150.1-128.6 0-232.8 91.8-232.8 205.1 0 63.8 33 120.5 84.1 157.9l-22.1 66 75.6-38.3c28.6 8 59.3 12.4 90.9 12.4 13.9 0 27.5-1 40.7-2.9 33.5 68.6 104.9 116.3 189 116.3 116.3 0 210.6-82 210.6-183.1 0-101.4-94.4-183.4-210.8-183.4zM324.9 318.2c16.3 0 29.7 13.4 29.7 30s-13.4 30-29.7 30c-16.3 0-29.7-13.4-29.7-30s13.4-30 29.7-30zm189.9 0c16.3 0 29.7 13.4 29.7 30s-13.4 30-29.7 30c-16.3 0-29.7-13.4-29.7-30s13.4-30 29.7-30zm168.6 206.5c-11.4 0-20.8-9.3-20.8-20.8s9.4-20.8 20.8-20.8 20.8 9.3 20.8 20.8-9.4 20.8-20.8 20.8zm118.8 0c-11.4 0-20.8-9.3-20.8-20.8s9.4-20.8 20.8-20.8c11.4 0 20.8 9.3 20.8 20.8s-9.4 20.8-20.8 20.8z"/></svg>
            </button>
            <button className="flex flex-col items-center justify-center gap-1.5 h-16 bg-white/60 border border-outline-variant/30 rounded-2xl hover:bg-surface-container-low transition-colors active:scale-95 text-[#12B7F5]">
              <svg viewBox="0 0 1024 1024" fill="currentColor" className="w-5 h-5"><path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-22.6 72.2-32.6 142.1-29.1 191.6 3.2 43.1 36 67.9 76.5 67.9 33 0 66-21.5 98.4-56.3 46.9 37.3 103.5 54.3 167.4 54.3 64 0 120.6-17 167.4-54.3 32.4 34.8 65.4 56.3 98.4 56.3 40.5 0 73.3-24.8 76.5-67.9 3.5-49.5-6.5-119.5-29.1-191.6z"/></svg>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-body-md font-body-md text-on-surface-variant text-sm">
               已有账号？ <button type="button" onClick={() => navigate('/login')} className="text-primary font-bold hover:underline decoration-2 underline-offset-4 cursor-pointer">立即登录</button>
            </p>
          </div>
        </div>

        <footer className="mt-6 mb-2">
          <div className="flex justify-center gap-6 text-label-md font-label-md text-white/70 text-xs">
            <span className="hover:text-white transition-colors cursor-pointer">隐私政策</span>
            <span className="hover:text-white transition-colors cursor-pointer">服务条款</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
