import { useEffect, useRef } from 'react';

export default function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || '0px 0px -50px 0px' }
    );

    // Observe all .reveal children OR the element itself
    const targets = el.querySelectorAll('.reveal');
    if (targets.length) {
      targets.forEach(t => observer.observe(t));
    } else {
      el.classList.add('reveal');
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}
