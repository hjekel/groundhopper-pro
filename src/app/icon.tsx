import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          background: 'linear-gradient(135deg, #D90000, #B50000)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Football pitch from above — the universal groundhopper symbol */}
        <div
          style={{
            width: '24px',
            height: '16px',
            border: '2px solid rgba(255,255,255,0.9)',
            borderRadius: '2px',
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
              width: '1.5px',
              height: '100%',
              background: 'rgba(255,255,255,0.9)',
              display: 'flex',
            }}
          />
          {/* Center circle */}
          <div
            style={{
              width: '7px',
              height: '7px',
              border: '1.5px solid rgba(255,255,255,0.9)',
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
