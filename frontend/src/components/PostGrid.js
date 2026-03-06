import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';

const postsData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
    likes: "34.2K",
    comments: "892",
    isCarousel: false
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80",
    likes: "28.7K",
    comments: "654",
    isCarousel: true
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&q=80",
    likes: "41.5K",
    comments: "1.2K",
    isCarousel: false
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=600&q=80",
    likes: "22.1K",
    comments: "423",
    isCarousel: false
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&q=80",
    likes: "56.8K",
    comments: "1.8K",
    isCarousel: true
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1619683286698-4e131458287c?w=600&q=80",
    likes: "19.3K",
    comments: "312",
    isCarousel: false
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1675441751770-7ae18efb6103?w=600&q=80",
    likes: "38.9K",
    comments: "876",
    isCarousel: false
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1766967991916-f94c4aeff786?w=600&q=80",
    likes: "45.2K",
    comments: "1.1K",
    isCarousel: true
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1765451490500-691e58629dcc?w=600&q=80",
    likes: "31.6K",
    comments: "567",
    isCarousel: false
  }
];

const PostItem = ({ post, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const postRef = useRef(null);

  useEffect(() => {
    if (!isTapped) {
      return;
    }

    const handleOutsidePointerDown = (event) => {
      if (postRef.current && !postRef.current.contains(event.target)) {
        setIsTapped(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, [isTapped]);

  const isOverlayActive = isHovered || isTapped;

  return (
    <motion.div
      ref={postRef}
      className="post-item group relative aspect-square cursor-pointer bg-secondary"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsTapped(true)}
      data-testid={`post-item-${post.id}`}
    >
      {/* Image */}
      <img 
        src={post.image} 
        alt={`Post ${post.id}`}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Overlay: always visible on mobile, hover on desktop */}
      <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 ${isOverlayActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-center gap-4 text-white font-bold text-sm md:text-base">
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 md:w-5 md:h-5 fill-white text-white" />
            <span className="font-mono" data-testid={`post-likes-${post.id}`}>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
            <span className="font-mono">{post.comments}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const PostGrid = () => {
  return (
    <section className="mb-8" data-testid="posts-grid-section">
      <div className="posts-grid">
        {postsData.map((post, index) => (
          <PostItem key={post.id} post={post} index={index} />
        ))}
      </div>
    </section>
  );
};
