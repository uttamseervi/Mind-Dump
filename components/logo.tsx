// File: MindDumpLogo.jsx
import React from 'react'
import { motion } from 'framer-motion'

export default function MindDumpLogo() {
    // Variants for the brain emoji bounce
    const emojiVariants = {
        hidden: { y: 0, scale: 1 },
        visible: {
            y: [0, -6, 0],
            scale: [1, 1.05, 1],
            transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
        },
    }

    return (
        <motion.svg
            width="180"
            height="80"
            viewBox="0 0 260 80"
            initial="hidden"
            animate="visible"
            style={{ background: 'transparent', borderRadius: 8 }}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Import stylish Google Font */}
            <defs>
                <style>
                    {"@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');"}
                </style>
            </defs>

            {/* Brain emoji with bounce animation */}
            <motion.text
                variants={emojiVariants}
                x="45"
                y="54"
                fontSize="42"
                textAnchor="middle"
            >
                🧠
            </motion.text>

            <text
                x="80"
                y="54"
                fontFamily="Pacifico, cursive"
                fontSize="32"
            >
                <tspan fill="#D1D5DB">Mind</tspan> {/* Light Cool Grey */}
                <tspan fill="#FFFFFF">Dump</tspan> {/* White */}

            </text>
        </motion.svg>
    )
}
