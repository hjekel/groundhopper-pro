import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '40px',
          background: 'linear-gradient(135deg, #D90000, #B50000)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Football pitch from above */}
        <div
          style={{
            width: '130px',
            height: '86px',
            border: '4px solid rgba(255,255,255,0.9)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Center line */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '0',
              width: '3px',
              height: '100%',
              background: 'rgba(255,255,255,0.9)',
              display: 'flex',
            }}
          />
          {/* Center circle */}
          <div
            style={{
              width: '36px',
              height: '36px',
              border: '3px solid rgba(255,255,255,0.9)',
              borderRadius: '50%',
              display: 'flex',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  )
}
