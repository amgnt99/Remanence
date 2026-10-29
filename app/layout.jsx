import './globals.css'
import NavBar from '@/components/NavBar'
import CustomCursor from '@/components/CustomCursor'

export const metadata = { title: 'rémanence' }

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{
        fontFamily: "'Iowan Old Style', 'Iowan Old Style Roman', Georgia, 'Times New Roman', serif",
        cursor: 'none',
      }}>
        <CustomCursor />
        <NavBar />
        {children}
      </body>
    </html>
  )
}
