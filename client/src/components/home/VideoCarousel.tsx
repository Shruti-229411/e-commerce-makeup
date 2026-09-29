import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from 'lucide-react';

interface VideoCardItem {
  id: string;
  title: string;
  brand: string;
  videoUrl: string;
  posterUrl: string;
  productName: string;
  productPrice: number;
  productMrp: number;
  productLink: string;
}

export const VideoCarousel: React.FC = () => {
  const [isPlayingMap, setIsPlayingMap] = useState<Record<string, boolean>>({});
  const [isMutedMap, setIsMutedMap] = useState<Record<string, boolean>>({
    'v1': true, 'v2': true, 'v3': true, 'v4': true, 'v5': true
  });
  const [videoErrorMap, setVideoErrorMap] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const videos: VideoCardItem[] = [
    {
      id: 'v1',
      title: 'Ruby Woo Matte Lip Swatch & Wear Test',
      brand: 'MAC Cosmetics',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600',
      productName: 'MAC Matte Lipstick - Ruby Woo',
      productPrice: 1950,
      productMrp: 2200,
      productLink: '/product/mac-matte-lipstick-ruby-woo'
    },
    {
      id: 'v2',
      title: '12-Hour Shine Control & Shade Matching',
      brand: 'Maybelline New York',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600',
      productName: 'Fit Me Matte Liquid Foundation',
      productPrice: 599,
      productMrp: 699,
      productLink: '/product/maybelline-fit-me-matte-poreless-foundation'
    },
    {
      id: 'v3',
      title: 'Voluptuous Lashes in Seconds!',
      brand: "L'Oréal Paris",
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1560700321-70e28f09b575?w=600',
      productName: 'Lash Paradise Mascara',
      productPrice: 749,
      productMrp: 899,
      productLink: '/product/loreal-paris-lash-paradise-mascara'
    },
    {
      id: 'v4',
      title: 'Defined Brow Hair Strokes Demo',
      brand: 'Lakmé',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600',
      productName: 'Absolute Precision Eyebrow Pencil',
      productPrice: 425,
      productMrp: 500,
      productLink: '/product/lakme-absolute-eyebrow-pencil'
    },
    {
      id: 'v5',
      title: '10-Step Glass Skin Routine Layering',
      brand: 'GlowCart Beauty',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
      productName: 'Glass Skin Hydration Serum',
      productPrice: 1290,
      productMrp: 1500,
      productLink: '/category/skincare'
    }
  ];

  // Setup IntersectionObserver to auto play/pause visible muted videos
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoId = entry.target.getAttribute('data-video-id');
          if (!videoId) return;

          const videoEl = videoRefs.current[videoId];
          if (!videoEl || videoErrorMap[videoId]) return;

          if (entry.isIntersecting) {
            videoEl.play().then(() => {
              setIsPlayingMap((prev) => ({ ...prev, [videoId]: true }));
            }).catch(() => {
              // Autoplay blocked by browser policy
              setIsPlayingMap((prev) => ({ ...prev, [videoId]: false }));
            });
          } else {
            videoEl.pause();
            setIsPlayingMap((prev) => ({ ...prev, [videoId]: false }));
          }
        });
      },
      { threshold: 0.6 }
    );

    Object.values(videoRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [videoErrorMap]);

  const togglePlay = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const videoEl = videoRefs.current[id];
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl.play().then(() => {
        setIsPlayingMap((prev) => ({ ...prev, [id]: true }));
      }).catch((err) => {
        console.warn('Video play error:', err);
      });
    } else {
      videoEl.pause();
      setIsPlayingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  const toggleMute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const videoEl = videoRefs.current[id];
    if (!videoEl) return;

    const nextMuted = !videoEl.muted;
    videoEl.muted = nextMuted;
    setIsMutedMap((prev) => ({ ...prev, [id]: nextMuted }));
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleKeyDown = (id: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePlay(id);
    }
  };

  return (
    <section
      role="region"
      aria-label="Video Shopping Reels Carousel"
      style={{
        padding: '3.5rem 1rem',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="container">
        {/* Title Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={14} /> Glow Reels & Beauty Demos
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Watch & Shop</h2>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleScroll('left')}
              aria-label="Previous video reel"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={20} color="var(--text-primary)" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              aria-label="Next video reel"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={20} color="var(--text-primary)" />
            </button>
          </div>
        </div>

        {/* Video Cards Grid / Carousel Container */}
        {/* Responsive Layout: Desktop 4 cards, Tablet 2 cards, Mobile 1.2 cards swipe */}
        <div
          ref={containerRef}
          className="video-carousel-scroll"
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: 'calc(78vw - 1rem)', // Mobile ~1.2 cards peek
            maxWidth: '100%',
            gap: '1.25rem',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: '1rem',
            scrollbarWidth: 'none'
          }}
        >
          {videos.map((item) => {
            const isPlaying = isPlayingMap[item.id] || false;
            const isMuted = isMutedMap[item.id] !== false;
            const hasError = videoErrorMap[item.id] || false;

            return (
              <div
                key={item.id}
                tabIndex={0}
                role="article"
                aria-label={`Video reel: ${item.title}`}
                onKeyDown={(e) => handleKeyDown(item.id, e)}
                style={{
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  aspectRatio: '9 / 16',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  backgroundColor: '#0f172a',
                  boxShadow: 'var(--shadow-md)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
                className="video-card-container"
              >
                {/* Fallback Poster or Video Stream */}
                {hasError ? (
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <video
                    ref={(el) => (videoRefs.current[item.id] = el)}
                    data-video-id={item.id}
                    src={item.videoUrl}
                    poster={item.posterUrl}
                    muted={isMuted}
                    loop
                    playsInline
                    preload="metadata"
                    onError={() => setVideoErrorMap((prev) => ({ ...prev, [item.id]: true }))}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                )}

                {/* Gradient Dark Overlay for Controls */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.1) 40%, rgba(15,23,42,0.4) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    pointerEvents: 'none'
                  }}
                >
                  {/* Top Bar: Brand & Audio Mute Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'auto' }}>
                    <span
                      style={{
                        backgroundColor: 'rgba(233,30,99,0.85)',
                        color: '#fff',
                        fontSize: '0.675rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      {item.brand}
                    </span>

                    {!hasError && (
                      <button
                        onClick={(e) => toggleMute(item.id, e)}
                        aria-label={isMuted ? `Unmute video ${item.title}` : `Mute video ${item.title}`}
                        style={{
                          backgroundColor: 'rgba(15,23,42,0.7)',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                    )}
                  </div>

                  {/* Play / Pause Center Overlay Toggle */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      pointerEvents: 'auto'
                    }}
                    onClick={(e) => togglePlay(item.id, e)}
                  >
                    <button
                      aria-label={isPlaying ? `Pause video ${item.title}` : `Play video ${item.title}`}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        backdropFilter: 'blur(8px)',
                        border: '2px solid rgba(255,255,255,0.6)',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        opacity: isPlaying ? 0.4 : 1,
                        transition: 'opacity 0.2s ease'
                      }}
                    >
                      {isPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: '3px' }} />}
                    </button>
                  </div>

                  {/* Bottom Bar: Title & Product CTA Button */}
                  <div style={{ pointerEvents: 'auto' }}>
                    <h3
                      style={{
                        color: '#fff',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        marginBottom: '0.65rem',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {item.title}
                    </h3>

                    {/* Integrated Product Tag Card */}
                    <Link
                      to={item.productLink}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.productName}
                        </p>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                          ₹{item.productPrice}
                        </span>
                      </div>

                      <div
                        style={{
                          backgroundColor: 'var(--primary-600)',
                          color: '#fff',
                          padding: '0.35rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <ShoppingBag size={12} /> Shop
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        /* Responsive Breakpoints for 9:16 Video Cards */
        @media (min-width: 640px) {
          .video-carousel-scroll {
            grid-auto-columns: calc(50% - 0.625rem) !important; /* Tablet: 2 visible cards */
          }
        }
        @media (min-width: 1024px) {
          .video-carousel-scroll {
            grid-auto-columns: calc(25% - 0.95rem) !important; /* Desktop: 4 visible cards */
          }
        }
        .video-card-container:focus-visible {
          outline: 3px solid var(--primary-500) !important;
          outline-offset: 3px;
        }
      `}</style>
    </section>
  );
};
