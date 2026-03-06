import { motion } from 'framer-motion';
import { Play, Heart, MessageCircle, Send } from 'lucide-react';

const reelsData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1765451490511-3421410e1391?w=400&q=80",
    views: "1.4M",
    likes: "245K",
    comments: "12.3K",
    title: "Secret glaze technique"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1766968405175-361a6517f54a?w=400&q=80",
    views: "892K",
    likes: "156K",
    comments: "8.7K",
    title: "Brown butter magic"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1770040792359-5d965344308c?w=400&q=80",
    views: "530K",
    likes: "89K",
    comments: "4.2K",
    title: "Cookie ASMR"
  }
];

const ReelCard = ({ reel, index }) => {
  return (
    <motion.div
      className="reel-card rounded-xl cursor-pointer group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      data-testid={`reel-card-${reel.id}`}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <img 
          src={reel.image} 
          alt={reel.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 reel-gradient" />

      {/* Views Counter */}
      <div className="absolute bottom-3 left-3">
        <div className="flex items-center gap-1.5 text-white">
          <Play className="w-4 h-4 fill-white" />
          <span className="font-bold text-sm" data-testid={`reel-views-${reel.id}`}>{reel.views}</span>
        </div>
      </div>

      {/* Side Actions */}
      <div className="absolute right-2 bottom-14 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Heart className="w-4 h-4 text-white" />
        </button>
        <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-white" />
        </button>
        <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </motion.div>
  );
};

export const ReelsStrip = () => {
  return (
    <section className="mb-8" data-testid="reels-section">
      <div className="max-w-[900px] mx-auto px-4 md:px-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white" style={{ fontVariantCaps: 'all-small-caps' }}>
            Viral Reels
          </h3>
          <span className="text-xs text-fuchsia-400 font-medium">See all</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {reelsData.map((reel, index) => (
            <ReelCard key={reel.id} reel={reel} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
