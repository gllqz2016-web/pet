import { ArrowLeft, Clock, Heart, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';

export default function PetDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { pets, favorites, toggleFavorite } = useAppContext();
  const pet = pets.find(item => item.id === id);

  if (!pet) {
    return <div className="min-h-screen bg-background p-6 text-on-surface">正在加载伙伴故事...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="relative h-[46vh] min-h-[360px]">
        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-6 left-5 w-10 h-10 rounded-full bg-black/35 text-white backdrop-blur flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button onClick={() => toggleFavorite(pet.id)} className="absolute top-6 right-5 w-10 h-10 rounded-full bg-black/35 text-white backdrop-blur flex items-center justify-center">
          <Heart className={cn("w-5 h-5", favorites.includes(pet.id) && "fill-primary text-primary")} />
        </button>
        <div className="absolute left-6 right-6 bottom-6 text-white">
          {pet.urgent && <span className="inline-flex mb-3 bg-primary px-3 py-1 rounded-full text-xs font-bold">急需领养</span>}
          <h1 className="font-headline-md text-3xl font-bold">{pet.name}</h1>
          <p className="mt-2 text-white/85">{pet.age} · {pet.breed} · {pet.gender}</p>
        </div>
      </div>

      <main className="px-margin-mobile pt-6 space-y-6 max-w-lg mx-auto">
        <section className="bg-surface rounded-2xl p-5 shadow-[0_4px_20px_rgba(204,90,61,0.08)]">
          <h2 className="font-headline-md text-xl font-bold text-on-surface mb-3">它的故事</h2>
          <p className="text-on-surface-variant leading-relaxed">{pet.description.replaceAll('"', '')}</p>
          <div className="flex flex-wrap gap-2 mt-5">
            {pet.tags.map(tag => <span key={tag} className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">{tag}</span>)}
          </div>
        </section>

        <section className="bg-surface-container-low rounded-2xl p-5">
          <div className="flex items-center gap-3 text-sm text-on-surface-variant">
            <MapPin className="w-5 h-5 text-primary" />
            <span>{pet.location || '志愿者救助点'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-on-surface-variant mt-3">
            <Clock className="w-5 h-5 text-primary" />
            <span>通过初步健康评估，可预约线下见面</span>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur border-t border-outline-variant/20 px-margin-mobile py-5">
        <div className="max-w-lg mx-auto grid grid-cols-[1fr_1.4fr] gap-3">
          <button onClick={() => toggleFavorite(pet.id)} className="h-13 rounded-full bg-surface-container-highest text-on-surface font-bold">
            {favorites.includes(pet.id) ? '已收藏' : '收藏'}
          </button>
          <button onClick={() => navigate(`/apply?petId=${pet.id}`)} className="h-13 rounded-full warm-glow-gradient text-white font-bold shadow-lg">
            申请领养
          </button>
        </div>
      </footer>
    </div>
  );
}
