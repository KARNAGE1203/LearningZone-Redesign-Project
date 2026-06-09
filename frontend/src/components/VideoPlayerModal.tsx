import { useState, useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import ReactPlayer from 'react-player';
import { FileText, FlaskConical } from 'lucide-react';

// Cast ReactPlayer to bypass broken forwardRef<HTMLVideoElement> inference
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Player = ReactPlayer as ComponentType<any>;

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface VideoMaterial {
  id:          string;
  type:        'video';
  title:       string;
  weekNumber:  number;
  weekTopic:   string;
  duration:    string;
  url:         string;
  progress?:   number;
  resumeFrom?: number;
  relatedSlides?: { id: string; title: string; url: string };
  relatedLab?:    { id: string; title: string; url: string };
}

interface VideoPlayerModalProps {
  isOpen:        boolean;
  onClose:       () => void;
  video:         VideoMaterial | null;
  onNext?:       () => void;
  onPrevious?:   () => void;
  hasNext?:      boolean;
  hasPrevious?:  boolean;
  currentIndex?: number;
  totalCount?:   number;
}

// ─── Helper ────────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function VideoPlayerModal({
  isOpen,
  onClose,
  video,
  onNext,
  onPrevious,
  hasNext      = false,
  hasPrevious  = false,
  currentIndex = 0,
  totalCount   = 1,
}: VideoPlayerModalProps) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  // ── Enter / exit animation ──────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(t);
    } else {
      setMounted(false);
    }
  }, [isOpen]);

  // ── Scroll lock ─────────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // ── Keyboard ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape')                        onClose();
      if (e.key === 'ArrowRight' && hasNext)         onNext?.();
      if (e.key === 'ArrowLeft'  && hasPrevious)     onPrevious?.();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, hasNext, hasPrevious, onClose, onNext, onPrevious]);

  if (!isOpen || !video) return null;

  const cleanTitle = video.title.replace(/^"|"$/g, '');

  const seekToResume = () => {
    if (video.resumeFrom !== undefined) {
      playerRef.current?.seekTo(video.resumeFrom, 'seconds');
    }
  };

  const hasRelated = video.relatedSlides || video.relatedLab;

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────────── */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position:   'fixed',
          inset:      0,
          background: 'rgba(0,0,0,0.75)',
          zIndex:     50,
          opacity:    mounted ? 1 : 0,
          transition: 'opacity 200ms ease',
        }}
      />

      {/* ── Modal panel ──────────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={cleanTitle}
        style={{
          position:       'fixed',
          top:            '50%',
          left:           '50%',
          transform:      mounted
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0.95)',
          width:          'min(900px, 90vw)',
          maxHeight:      '90vh',
          background:     '#0D1F1C',
          borderRadius:   16,
          overflow:       'hidden',
          zIndex:         51,
          opacity:        mounted ? 1 : 0,
          transition:     'transform 200ms ease, opacity 200ms ease',
          display:        'flex',
          flexDirection:  'column',
          fontFamily:     'Inter, system-ui, sans-serif',
        }}
      >

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div style={{
          background:      'rgba(0,0,0,0.3)',
          padding:         '16px 20px',
          display:         'flex',
          alignItems:      'flex-start',
          justifyContent:  'space-between',
          gap:             12,
          borderBottom:    '1px solid rgba(255,255,255,0.08)',
          flexShrink:      0,
        }}>

          {/* Left: badge + title + meta */}
          <div style={{ minWidth: 0 }}>

            {/* ● RECORDING badge */}
            <div style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           5,
              background:    'rgba(91,33,182,0.3)',
              border:        '1px solid rgba(91,33,182,0.5)',
              borderRadius:  999,
              padding:       '3px 10px',
              marginBottom:  6,
            }}>
              <span style={{
                width:        6,
                height:       6,
                borderRadius: '50%',
                background:   '#A78BFA',
                display:      'inline-block',
                flexShrink:   0,
              }} />
              <span style={{
                color:         '#A78BFA',
                fontSize:      11,
                fontWeight:    500,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Recording
              </span>
            </div>

            {/* Title */}
            <p style={{
              color:        'white',
              fontSize:     17,
              fontWeight:   600,
              lineHeight:   1.3,
              margin:       '0 0 4px',
            }}>
              {cleanTitle}
            </p>

            {/* Week · Topic · Duration */}
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: 0 }}>
              Week {video.weekNumber}
              <span style={{ margin: '0 5px', opacity: 0.5 }}>·</span>
              {video.weekTopic}
              <span style={{ margin: '0 5px', opacity: 0.5 }}>·</span>
              {video.duration}
            </p>
          </div>

          {/* Close × */}
          <button
            onClick={onClose}
            aria-label="Close video player"
            style={{
              width:           32,
              height:          32,
              borderRadius:    '50%',
              background:      'rgba(255,255,255,0.1)',
              border:          'none',
              color:           'white',
              fontSize:        18,
              cursor:          'pointer',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              flexShrink:      0,
              transition:      'background 150ms',
              lineHeight:      1,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            ×
          </button>
        </div>

        {/* ── Video player ─────────────────────────────────────────────────────── */}
        <div style={{
          position:    'relative',
          width:       '100%',
          aspectRatio: '16/9',
          background:  '#000',
          flexShrink:  0,
        }}>
          {/* Resume banner */}
          {video.resumeFrom !== undefined && (
            <div
              onClick={seekToResume}
              style={{
                position:   'absolute',
                top:        0,
                left:       0,
                right:      0,
                zIndex:     2,
                background: 'rgba(0,137,123,0.9)',
                color:      'white',
                fontSize:   13,
                fontWeight: 500,
                padding:    '8px 16px',
                cursor:     'pointer',
                userSelect: 'none',
              }}
            >
              ▶ Resume from {formatTime(video.resumeFrom)}
            </div>
          )}

          <Player
            ref={playerRef}
            url={video.url}
            width="100%"
            height="100%"
            controls
            playing={false}
            light={false}
          />
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────────── */}
        <div style={{
          background:  '#0D1F1C',
          padding:     '16px 20px',
          borderTop:   '1px solid rgba(255,255,255,0.08)',
          flexShrink:  0,
        }}>

          {/* Row 1: related materials */}
          {hasRelated && (
            <div style={{ marginBottom: 12 }}>
              <p style={{
                color:         'rgba(255,255,255,0.4)',
                fontSize:      11,
                fontWeight:    500,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom:  8,
              }}>
                From this week
              </p>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {video.relatedSlides && (
                  <button
                    onClick={() => window.open(video.relatedSlides!.url, '_blank')}
                    style={{
                      display:      'inline-flex',
                      alignItems:   'center',
                      gap:          6,
                      background:   'rgba(59,130,246,0.15)',
                      border:       '1px solid rgba(59,130,246,0.3)',
                      borderRadius: 8,
                      padding:      '6px 12px',
                      color:        '#93C5FD',
                      fontSize:     12,
                      fontWeight:   500,
                      cursor:       'pointer',
                      transition:   'background 150ms',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.25)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.15)')}
                  >
                    <FileText size={13} color="#93C5FD" strokeWidth={1.8} />
                    Lecture Slides
                  </button>
                )}

                {video.relatedLab && (
                  <button
                    onClick={() => window.open(video.relatedLab!.url, '_blank')}
                    style={{
                      display:      'inline-flex',
                      alignItems:   'center',
                      gap:          6,
                      background:   'rgba(245,158,11,0.15)',
                      border:       '1px solid rgba(245,158,11,0.3)',
                      borderRadius: 8,
                      padding:      '6px 12px',
                      color:        '#FCD34D',
                      fontSize:     12,
                      fontWeight:   500,
                      cursor:       'pointer',
                      transition:   'background 150ms',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.25)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.15)')}
                  >
                    <FlaskConical size={13} color="#FCD34D" strokeWidth={1.8} />
                    Lab Document
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Row 2: prev / count / next */}
          <div style={{
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'space-between',
            gap:             12,
            marginTop:       hasRelated ? 12 : 0,
          }}>

            {/* Previous */}
            <button
              onClick={hasPrevious ? onPrevious : undefined}
              disabled={!hasPrevious}
              style={{
                display:      'inline-flex',
                alignItems:   'center',
                gap:          6,
                background:   'rgba(255,255,255,0.08)',
                border:       '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8,
                padding:      '8px 14px',
                color:        'rgba(255,255,255,0.7)',
                fontSize:     13,
                fontWeight:   500,
                cursor:       hasPrevious ? 'pointer' : 'not-allowed',
                opacity:      hasPrevious ? 1 : 0.3,
                transition:   'background 150ms',
              }}
              onMouseEnter={e => { if (hasPrevious) e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
              onMouseLeave={e => { if (hasPrevious) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            >
              ← Previous Recording
            </button>

            {/* Count */}
            <span style={{
              color:      'rgba(255,255,255,0.4)',
              fontSize:   12,
              whiteSpace: 'nowrap',
            }}>
              Recording {currentIndex + 1} of {totalCount}
            </span>

            {/* Next */}
            <button
              onClick={hasNext ? onNext : undefined}
              disabled={!hasNext}
              style={{
                display:      'inline-flex',
                alignItems:   'center',
                gap:          6,
                background:   hasNext ? '#00897B' : 'rgba(255,255,255,0.08)',
                border:       'none',
                borderRadius: 8,
                padding:      '8px 14px',
                color:        hasNext ? 'white' : 'rgba(255,255,255,0.3)',
                fontSize:     13,
                fontWeight:   500,
                cursor:       hasNext ? 'pointer' : 'not-allowed',
                transition:   'background 150ms',
              }}
              onMouseEnter={e => { if (hasNext) e.currentTarget.style.background = '#00695C'; }}
              onMouseLeave={e => { if (hasNext) e.currentTarget.style.background = '#00897B'; }}
            >
              Next Recording →
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
