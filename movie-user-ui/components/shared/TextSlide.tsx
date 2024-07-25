'use client';

import { motion } from 'framer-motion';

const TextSlide = ({ text, delay = 0.5 }: { text: string; delay?: number }) => {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay }}
        >
            {text}
        </motion.div>
    );
};

export default TextSlide;
