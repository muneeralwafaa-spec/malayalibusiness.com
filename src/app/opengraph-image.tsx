import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'MalayaliBusiness UAE — UAE\'s #1 Malayali Business Network'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1B2D4F 0%, #0f1e35 60%, #1a3a2a 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '360px', height: '360px', borderRadius: '50%',
          background: 'rgba(124, 82, 170, 0.15)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-60px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(75, 191, 195, 0.1)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', top: '40px', left: '60px',
          width: '120px', height: '120px', borderRadius: '50%',
          background: 'rgba(212, 170, 65, 0.08)',
          display: 'flex',
        }} />

        {/* Logo image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.malayalibusiness.com/logo.png"
          width={520}
          height={130}
          style={{ objectFit: 'contain', marginBottom: '32px' }}
          alt="MalayaliBusiness"
        />

        {/* Tagline */}
        <div style={{
          fontSize: '28px',
          fontWeight: '400',
          color: 'rgba(255,255,255,0.75)',
          letterSpacing: '0.5px',
          marginBottom: '40px',
          display: 'flex',
        }}>
          UAE's #1 Malayali Business Network
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex',
          gap: '0px',
          alignItems: 'center',
        }}>
          {[
            { val: '15,000+', label: 'Businesses' },
            { val: '3.5M', label: 'Malayalis' },
            { val: '7', label: 'Emirates' },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0px',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0 36px',
              }}>
                <span style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#D4AA41',
                  lineHeight: '1',
                }}>
                  {stat.val}
                </span>
                <span style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: '4px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}>
                  {stat.label}
                </span>
              </div>
              {i < 2 && (
                <div style={{
                  width: '1px',
                  height: '44px',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Bottom domain strip */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '52px',
          background: 'rgba(212,170,65,0.12)',
          borderTop: '1px solid rgba(212,170,65,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: '18px',
            color: 'rgba(212,170,65,0.8)',
            letterSpacing: '2px',
          }}>
            www.malayalibusiness.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
