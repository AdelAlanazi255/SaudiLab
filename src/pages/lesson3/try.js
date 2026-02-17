import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Lesson3Try() {
  const [code, setCode] = useState(`<!DOCTYPE html>
<html>
  <head>
    <title>Links & Images</title>
  </head>
  <body>
    <h1>Links and Images</h1>

    <a href="https://www.google.com">Visit Google</a>

    <br /><br />

    <img src="https://via.placeholder.com/150" alt="Example Image" />

    <p>Edit and press RUN.</p>
  </body>
</html>`);

  const [output, setOutput] = useState(code);

  const handleRun = () => {
    setOutput(code);
  };

  return (
    <Layout title="Lesson 3 - Try It">
      <div style={{ padding: '2rem' }}>
        <h1>Lesson 3 – Try It Yourself</h1>

        <div
          style={{
            display: 'flex',
            gap: '2rem',
            marginTop: '2rem',
          }}
        >
          {/* LEFT SIDE */}
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
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              RUN
            </button>
          </div>

          {/* RIGHT SIDE */}
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
            to="/docs/lesson3"
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: '#eee',
              borderRadius: '6px',
              textDecoration: 'none',
              color: 'black',
            }}
          >
            ← Back to Lesson 3
          </Link>
        </div>
      </div>
    </Layout>
  );
}
