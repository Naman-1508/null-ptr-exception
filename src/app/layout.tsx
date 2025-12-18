export const metadata = {
  title: '404 Not Found',
  description: 'The requested URL was not found on this server.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ 
        margin: 0, 
        padding: '20px', 
        background: '#0a0a0a', 
        color: '#555', 
        fontFamily: 'monospace',
        fontSize: '13px',
        lineHeight: '1.6'
      }}>
        {children}
      </body>
    </html>
  )
}
