import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Groundhopper Pro — Track je stadionbezoeken door Europa'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.08) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)',
            display: 'flex',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #22c55e, #3b82f6, #a855f7)',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Stadium icon */}
          <div
            style={{
              fontSize: '72px',
              display: 'flex',
            }}
          >
            🏟️
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-2px',
              display: 'flex',
            }}
          >
            Groundhopper Pro
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '24px',
              color: '#94a3b8',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            Track je stadionbezoeken door heel Europa
          </div>

          {/* Feature pills */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '24px',
            }}
          >
            {[
              { icon: '🗺️', label: 'Interactieve kaart' },
              { icon: '🏆', label: 'Achievements' },
              { icon: '🎯', label: 'Uitdagingen' },
              { icon: '📊', label: 'Stats & Records' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 600 }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ color: '#475569', fontSize: '16px' }}>
            groundhopper-pro.vercel.app
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
