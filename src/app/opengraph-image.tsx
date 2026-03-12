import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Groundhopper Pro'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #D90000 0%, #B50000 50%, #8B0000 100%)',
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
        {/* Subtle pitch lines in background */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '900px',
            height: '500px',
            border: '2px solid rgba(255,255,255,0.06)',
            borderRadius: '4px',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
          }}
        />

        {/* Main title */}
        <div
          style={{
            fontSize: '86px',
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-3px',
            lineHeight: 1,
            display: 'flex',
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          GROUNDHOPPER
        </div>

        {/* Pitch center decoration: ─── ○ ─── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            margin: '20px 0',
          }}
        >
          <div style={{ width: '140px', height: '2px', background: 'rgba(255,255,255,0.35)', display: 'flex' }} />
          <div
            style={{
              width: '44px',
              height: '44px',
              border: '2px solid rgba(255,255,255,0.35)',
              borderRadius: '50%',
              display: 'flex',
            }}
          />
          <div style={{ width: '140px', height: '2px', background: 'rgba(255,255,255,0.35)', display: 'flex' }} />
        </div>

        {/* PRO */}
        <div
          style={{
            fontSize: '86px',
            fontWeight: 900,
            color: 'white',
            letterSpacing: '24px',
            lineHeight: 1,
            display: 'flex',
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          PRO
        </div>
      </div>
    ),
    { ...size }
  )
}
