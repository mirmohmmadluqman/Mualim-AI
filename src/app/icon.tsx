import { ImageResponse } from 'next/og'
import { BookOpenCheck } from 'lucide-react';

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'hsl(220 100% 70%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '8px'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6h-4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
          <path d="M4 6h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4" />
          <path d="M15 22v-6l-4-2-4 2v6" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
