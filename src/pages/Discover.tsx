import { Search, ChevronDown, Clock, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Discover() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('全部');
  const { favorites, toggleFavorite, pets, loading, error } = useAppContext();

  const filteredPets = pets.filter(pet => {
    if (filter === '猫咪') return pet.type === 'cat';
    if (filter === '狗狗') return pet.type === 'dog';
    return true;
  }).slice(0, 3);

  return (
    <div className="px-margin-mobile">
      {/* Top Banner */}
      <section className="-mx-margin-mobile mb-6 relative h-48 overflow-hidden rounded-b-3xl shadow-md">
        <img 
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1200" 
          alt="Cats and Dogs" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-6 text-white text-shadow-md">
          <h2 className="font-headline-xl text-2xl font-bold mb-1">遇见你的新挚友</h2>
          <p className="font-body-md text-white/90 text-sm">每一个温暖的家都在等待它的主人</p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="mb-8">
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="搜索宠物品种或特征..." 
            className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary text-on-surface placeholder-on-surface-variant/50 shadow-sm outline-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
        </div>

        {/* Horizontal Scrollable Filters */}
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide hide-scrollbar -mx-margin-mobile px-margin-mobile">
          {['全部', '猫咪', '狗狗'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-shrink-0 px-6 py-2 rounded-full font-label-md text-label-md shadow-md active:scale-95 transition-all",
                filter === f ? "warm-glow-gradient text-white" : "bg-secondary-fixed/30 text-on-secondary-fixed-variant hover:bg-secondary-fixed/50"
              )}
            >
              {f}
            </button>
          ))}
          <button className="flex-shrink-0 px-6 py-2 rounded-full bg-secondary-fixed/30 text-on-secondary-fixed-variant font-label-md text-label-md hover:bg-secondary-fixed/50 active:scale-95 transition-all flex items-center gap-1">
            年龄 <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex-shrink-0 px-6 py-2 rounded-full bg-secondary-fixed/30 text-on-secondary-fixed-variant font-label-md text-label-md hover:bg-secondary-fixed/50 active:scale-95 transition-all flex items-center gap-1">
            性格 <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Pet Cards Grid */}
      <div className="grid grid-cols-1 gap-8 pb-8">
        {loading && <p className="text-center text-on-surface-variant">正在加载伙伴资料...</p>}
        {error && <p className="text-center text-error">{error}</p>}
        {filteredPets.map(pet => (
          <article key={pet.id} className="bg-surface rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(204,90,61,0.08)] group hover:scale-[1.02] transition-transform duration-300">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={pet.image} 
                alt={pet.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute top-4 left-4">
                {pet.urgent && (
                  <span className="bg-primary/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current" />
                    急需领养
                  </span>
                )}
              </div>
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {pet.location && (
                  <span className="bg-tertiary-container/90 backdrop-blur-md text-on-tertiary-container px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 fill-current" />
                    {pet.location}
                  </span>
                )}
                {pet.tags.map(tag => (
                  <span key={tag} className="bg-secondary-container/90 backdrop-blur-md text-on-secondary-container px-3 py-1 rounded-full text-[12px] font-semibold text-center">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-1">{pet.name}</h3>
                  <p className="font-body-md text-on-surface-variant">{pet.age} · {pet.breed} · {pet.gender}</p>
                </div>
                <button onClick={() => toggleFavorite(pet.id)}>
                  <Heart className={cn("w-6 h-6 shrink-0 transition-colors", favorites.includes(pet.id) ? "fill-primary text-primary" : "text-outline")} />
                </button>
              </div>
              <p className="font-body-md text-on-surface-variant mb-6 line-clamp-2 italic font-serif text-sm">{pet.description}</p>
              <button 
                onClick={() => navigate(`/pets/${pet.id}`)}
                className="w-full py-4 rounded-xl border-2 border-primary-container text-primary-container font-label-md text-label-md hover:bg-primary-container/5 transition-colors active:scale-95 duration-150"
              >
                阅读故事
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button onClick={() => setFilter('全部')} className="font-label-md text-label-md text-on-surface-variant flex items-center justify-center gap-2 mx-auto hover:text-primary transition-colors pb-8">
          查看更多伙伴
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
