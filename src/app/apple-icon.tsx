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
          background: 'linear-gradient(135deg, #059669, #10b981)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
        }}
      >
        <span style={{ fontSize: '60px', display: 'flex' }}>⚽</span>
        <span
          style={{
            fontSize: '36px',
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-2px',
          }}
        >
          GP
        </span>
      </div>
    ),
    { ...size }
  )
}
