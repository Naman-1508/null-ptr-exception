'use client';

import { useState, useEffect } from 'react';

// This is a server-side action to read files, but we'll fetch it or 
// use a slightly different approach for Vercel compatibility and client interactivity.
// Since we want it minimal, we'll keep the direct FS read but wrap it for the client.

export default function Home() {
  const [files, setFiles] = useState<string[]>([]);
  const [showSecret, setShowSecret] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    // In a real Vercel environment, readdirSync on public works but 
    // we need to be careful with how we pass it to the client.
    // For this minimal setup, we'll use a hidden fetch or just hardcode for demo
    // but better yet, we'll use a small API call to get the list.
    fetch('/api/list')
      .then(res => res.json())
      .then(data => setFiles(data.files || []));
  }, []);

  const handleTrigger = () => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= 3) {
        setShowSecret(true);
      }
      return next;
    });
  };

  const handleDownload = async (file: string) => {
    try {
      const response = await fetch(`/${file}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!showSecret) {
    return (
      <div 
        onClick={handleTrigger}
        style={{ 
          height: '80vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          cursor: 'default',
          userSelect: 'none'
        }}
      >
        <h1 id="trigger" style={{ fontSize: '24px', marginBottom: '10px' }}>404 Not Found</h1>
        <p style={{ color: '#888' }}>The requested URL / was not found on this server.</p>
        <hr style={{ width: '100%', border: '0', borderTop: '1px solid #333', margin: '20px 0' }} />
        <p style={{ fontSize: '12px', color: '#444' }}>Apache/2.4.41 (Ubuntu) Server at localhost Port 80</p>
      </div>
    );
  }

  return (
    <main>
      <div style={{ opacity: 1 }}>
        <h1 style={{ fontSize: '14px', marginBottom: '20px', color: '#777' }}>INDEX_OF_SECURE_VAULT</h1>
        {files.length === 0 ? (
          <p>NO_ITEMS_FOUND</p>
        ) : (
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              {files.map(file => (
                <tr key={file}>
                  <td style={{ paddingRight: '20px', color: '#aaa', borderBottom: '1px solid #222' }}>{file}</td>
                  <td style={{ paddingRight: '20px', borderBottom: '1px solid #222' }}>
                    <a 
                      href={`/${file}`} 
                      target="_blank"
                      style={{ color: '#0066cc', textDecoration: 'none' }}
                    >
                      [OPEN]
                    </a>
                  </td>
                  <td style={{ borderBottom: '1px solid #222' }}>
                    <button 
                      onClick={() => handleDownload(file)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#cc9900', 
                        padding: 0, 
                        font: 'inherit', 
                        cursor: 'pointer',
                        textDecoration: 'none'
                      }}
                    >
                      [FETCH]
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
