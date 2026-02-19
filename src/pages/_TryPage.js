import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { getTryStarter } from '@site/src/pages/_tryData';

const editorStyle = {
  width: '100%',
  height: '500px',
  padding: '1rem',
  fontFamily: 'monospace',
  fontSize: '14px',
  borderRadius: '8px',
  border: '1px solid #ccc',
};

const frameStyle = {
  width: '100%',
  height: '550px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: 'white',
};

const backStyle = {
  padding: '0.6rem 1.2rem',
  backgroundColor: '#eee',
  borderRadius: '6px',
  textDecoration: 'none',
  color: 'black',
};

function courseLabel(course) {
  return course === 'css' ? 'CSS' : 'HTML';
}

export default function TryPage({ course = 'html', lessonId = 'lesson1' }) {
  const lessonNumber = String(lessonId).replace('lesson', '');
  const initialCode = useMemo(() => getTryStarter(course, lessonId), [course, lessonId]);

  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(initialCode);

  const label = courseLabel(course);

  return (
    <Layout title={`${label} Lesson ${lessonNumber} - Try It`}>
      <div style={{ padding: '2rem' }}>
        <h1>{`${label} Lesson ${lessonNumber} - Try It Yourself`}</h1>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ flex: 1 }}>
            <h3>Your Code</h3>
            <textarea value={code} onChange={(e) => setCode(e.target.value)} style={editorStyle} />

            <button
              onClick={() => setOutput(code)}
              style={{
                marginTop: '1rem',
                padding: '0.7rem 1.5rem',
                backgroundColor: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              RUN
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <h3>Output</h3>
            <iframe title="output" style={frameStyle} srcDoc={output} />
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Link to={`/${course}/lesson${lessonNumber}`} style={backStyle}>
            {`Back to Lesson ${lessonNumber}`}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
