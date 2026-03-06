import { motion } from 'framer-motion';

export const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t border-border" data-testid="footer">
      <motion.div 
        className="max-w-5xl mx-auto text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <a
            href="https://blyxnovastudio.com"
            className="inline-block text-2xl sm:text-3xl md:text-4xl font-bold bg-[linear-gradient(135deg,#A855F7,#EC4899)] bg-clip-text text-transparent"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            BlyxNova Studio
          </a>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground mb-4">
          Creamos estrategias de contenido viral que transforman marcas
        </p>
        <p className="text-xs text-muted-foreground mt-6">
          © 2026 BlyxNova Studio. Este es un caso de éxito en el portafolio.
        </p>
      </motion.div>
    </footer>
  );
};
