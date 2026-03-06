import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Eye, TrendingUp, Users } from 'lucide-react';

const MetricCard = ({ Icon, label, startValue, endValue, format = 'int', shouldAnimate = false, iconBgColor = '#A78BFA' }) => {
  const [animatedValue, setAnimatedValue] = useState(startValue);

  useEffect(() => {
    let frameId;

    const durationMs = 2000;
    const easeOutCubic = (time) => 1 - Math.pow(1 - time, 3);

    setAnimatedValue(startValue);

    if (!shouldAnimate || startValue === endValue) {
      setAnimatedValue(endValue);
      return;
    }

    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeOutCubic(progress);

      const currentValue = startValue + (endValue - startValue) * eased;
      setAnimatedValue(currentValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [endValue, shouldAnimate, startValue]);

  const formatValue = (value) => {
    if (format === 'k') {
      return `${Math.round(value / 1000)}K`;
    }

    if (format === 'm') {
      return `${(value / 1000000).toFixed(1)}M`;
    }

    return `${Math.round(value)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div
        className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2 sm:mb-3"
        style={{ backgroundColor: iconBgColor }}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <div className="font-mono font-bold text-xl sm:text-2xl md:text-3xl gradient-text" data-testid={`metric-${label.toLowerCase().replace(/\s/g, '-')}`}>
        {formatValue(animatedValue)}
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-tight">{label}</p>
    </motion.div>
  );
};

export const CaseStudyMetrics = () => {
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || hasAnimated) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="py-12 px-4 md:px-0" data-testid="case-study-section">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-fuchsia-500/10 via-purple-500/5 to-transparent dark:glass-card light:glass-card-light">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 p-6 md:p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#2D1B69]/80 border border-purple-700 text-white text-sm font-medium mb-4"
              >
                <span className="w-4 h-4 inline-flex items-center justify-center text-yellow-400">✦</span>
                Caso de estudio
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Crecimiento Orgánico en <span className="gradient-text">90 Días</span>
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Estrategia de contenido viral para @sweetdeliriumcookies
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 md:gap-12">
              <MetricCard 
                Icon={Users}
                label="Seguidores Iniciales" 
                startValue={0}
                endValue={0}
                format="int"
                shouldAnimate={hasAnimated}
                iconBgColor="#6B7FD4"
              />
              <MetricCard 
                Icon={TrendingUp}
                label="Seguidores Actuales" 
                startValue={70000}
                endValue={128000}
                format="k"
                shouldAnimate={hasAnimated}
                iconBgColor="#2DD4BF"
              />
              <MetricCard 
                Icon={Eye}
                label="Vistas Totales" 
                startValue={2300000}
                endValue={6400000}
                format="m"
                shouldAnimate={hasAnimated}
                iconBgColor="#A78BFA"
              />
              <MetricCard 
                Icon={Calendar}
                label="Días de Campaña" 
                startValue={14}
                endValue={90}
                format="int"
                shouldAnimate={hasAnimated}
                iconBgColor="#F59E0B"
              />
            </div>

            {/* Growth Bar */}
            <motion.div 
              className="mt-10 pt-8 border-t border-border/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-muted-foreground">Progreso de crecimiento</span>
                <span className="font-mono font-semibold gradient-text">+12,800%</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* BlyxNova Credit */}
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-xs text-muted-foreground">
                Estrategia desarrollada por{' '}
                <span className="blyx-brand font-semibold">BlyxNova Studio</span>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
