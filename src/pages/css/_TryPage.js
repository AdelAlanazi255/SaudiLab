import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function TryPage({ title, backTo, initialCode }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(initialCode);

  const handleRun = () => setOutput(code);

  return (
    <Layout title={title}>
      <div style={{ padding: '2rem' }}>
        <h1>{title}</h1>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ flex: 1 }}>
            <h3>Your Code</h3>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                width: '100%',
                height: '500px',
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />

            <button
              onClick={handleRun}
              style={{
                marginTop: '1rem',
                padding: '0.7rem 1.5rem',
                backgroundColor: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 900,
              }}
            >
              RUN
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <h3>Output</h3>
            <iframe
              title="output"
              style={{
                width: '100%',
                height: '550px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: 'white',
              }}
              srcDoc={output}
            />
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Link
            to={backTo}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: '#eee',
              borderRadius: '6px',
              textDecoration: 'none',
              color: 'black',
              fontWeight: 900,
              display: 'inline-block',
            }}
          >
            ← Back to Lesson
          </Link>
        </div>
      </div>
    </Layout>
  );
}
