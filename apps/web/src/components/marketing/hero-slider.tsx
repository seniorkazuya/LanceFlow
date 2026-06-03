'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const SLIDES = [
  {
    id: 'slide-1',
    className: 'slide slide-1',
    ratios: { rD: '16/9', rT: '4/3', rM: '9/16' },
    alt: 'Lanceflows — Software Engineering & AI Services: from idea to architecture, engineering, AI automation, launch, and growth.',
    sources: {
      mobile: '/marketing/img/hero_slider1_3.png',
      tablet: '/marketing/img/hero_slider1_2.png',
      desktop: '/marketing/img/hero_slider1_1.png',
    },
  },
  {
    id: 'slide-2',
    className: 'slide slide-2',
    ratios: { rD: '16/9', rT: '980/1086', rM: '454/1086' },
    alt: 'Your vision, our engineering, real results — trusted, focused, engineered, scalable. Senior engineers delivering from idea to growth.',
    sources: {
      mobile: '/marketing/img/hero_slider2_3.png',
      tablet: '/marketing/img/hero_slider2_2.png',
      desktop: '/marketing/img/hero_slider2_1.png',
    },
  },
  {
    id: 'slide-3',
    className: 'slide slide-3',
    ratios: { rD: '16/9', rT: '4/3', rM: '9/16' },
    alt: 'Invest your strength, grow through flow — a seamless system that amplifies impact, from your strengths to bigger projects, leadership, and stable opportunity.',
    sources: {
      mobile: '/marketing/img/hero_slider3_3.png',
      tablet: '/marketing/img/hero_slider3_2.png',
      desktop: '/marketing/img/hero_slider3_1.png',
    },
  },
] as const;

function ratioForSlide(slideIndex: number): string {
  const slide = SLIDES[slideIndex];
  const w = window.innerWidth;
  if (w <= 560) return slide.ratios.rM;
  if (w <= 900) return slide.ratios.rT;
  return slide.ratios.rD;
}

export function HeroSlider() {
  const slidesRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const applyRatio = useCallback((i: number) => {
    const el = slidesRef.current;
    if (!el) return;
    el.style.aspectRatio = ratioForSlide(i);
  }, []);

  const go = useCallback(
    (n: number, manual = false) => {
      const next = (n + SLIDES.length) % SLIDES.length;
      indexRef.current = next;
      setIndex(next);
      applyRatio(next);
      if (manual) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          const i = (indexRef.current + 1) % SLIDES.length;
          indexRef.current = i;
          setIndex(i);
          applyRatio(i);
        }, 5500);
      }
    },
    [applyRatio]
  );

  useEffect(() => {
    applyRatio(0);
    timerRef.current = setInterval(() => {
      const i = (indexRef.current + 1) % SLIDES.length;
      indexRef.current = i;
      setIndex(i);
      applyRatio(i);
    }, 5500);

    const onResize = () => applyRatio(indexRef.current);
    window.addEventListener('resize', onResize);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [applyRatio]);

  return (
    <div className="slider" aria-roledescription="carousel" aria-label="Lanceflows highlights">
      <div className="slides" ref={slidesRef}>
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`${slide.className}${i === index ? ' active' : ''}`}
            data-r-d={slide.ratios.rD}
            data-r-t={slide.ratios.rT}
            data-r-m={slide.ratios.rM}
          >
            <picture className="slide-pic">
              <source media="(max-width:560px)" srcSet={slide.sources.mobile} />
              <source media="(max-width:900px)" srcSet={slide.sources.tablet} />
              <img src={slide.sources.desktop} alt={slide.alt} />
            </picture>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="arrow prev"
        aria-label="Previous slide"
        onClick={() => go(index - 1, true)}
      >
        ‹
      </button>
      <button
        type="button"
        className="arrow next"
        aria-label="Next slide"
        onClick={() => go(index + 1, true)}
      >
        ›
      </button>
      <div className="dots" role="tablist">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`dot${i === index ? ' active' : ''}`}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => go(i, true)}
          />
        ))}
      </div>
    </div>
  );
}
