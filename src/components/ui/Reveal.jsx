import { motion } from 'motion/react'

/** Gentle fade-and-rise as content enters the viewport (once). */
export function Reveal({ children, delay = 0, y = 18, className, as = 'div' }) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Component>
  )
}
