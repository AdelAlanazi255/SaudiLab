import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css';
import { getTryStarter } from '@site/src/pages/_tryData';
import { canAccessLesson, getLastUnlockedLessonPath } from '@site/src/utils/lessonAccess';
import { getLessonMeta } from '@site/src/data/lessons';

const editorShellStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '550px',
  border: '1px solid #2a2f36',
  borderRadius: '10px',
  background: '#0f1115',
  overflow: 'hidden',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
};

const panelHeaderStyle = {
  height: '34px',
  padding: '0 0.75rem',
  display: 'flex',
  alignItems: 'center',
  fontSize: '12px',
  fontWeight: 700,
  color: '#9ca3af',
  borderBottom: '1px solid #2a2f36',
  background: '#0f1115',
};

const editorBodyStyle = {
  flex: 1,
  padding: '0.5rem',
};

const editorFooterStyle = {
  height: '56px',
  padding: '0 0.75rem',
  borderTop: '1px solid #2a2f36',
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  justifyContent: 'flex-start',
  background: '#0f1115',
};

const textareaStyle = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  padding: '1rem',
  resize: 'none',
  border: 'none',
  borderRadius: '8px',
  outline: 'none',
  background: 'transparent',
  color: 'transparent',
  caretColor: '#e5e7eb',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontSize: '14px',
  lineHeight: 1.6,
  whiteSpace: 'pre',
  overflow: 'auto',
};

const highlightPreStyle = {
  position: 'absolute',
  inset: 0,
  margin: 0,
  padding: '1rem',
  background: '#0b0d10',
  color: '#e5e7eb',
  pointerEvents: 'none',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontSize: '14px',
  lineHeight: 1.6,
  overflow: 'auto',
  borderRadius: '8px',
  whiteSpace: 'pre',
};

const editorInputWrapStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  background: '#0b0d10',
  overflow: 'hidden',
};

const outputPanelStyle = {
  width: '100%',
  height: '550px',
  border: '1px solid #2a2f36',
  borderRadius: '10px',
  backgroundColor: '#0f1115',
  overflow: 'hidden',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
};

const outputBodyStyle = {
  flex: 1,
  padding: '0.5rem',
};

const frameStyle = {
  width: '100%',
  height: '100%',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#0b0d10',
};

const buttonBase = {
  height: '40px',
  padding: '0 1rem',
  borderRadius: '8px',
  border: '1px solid #2a2f36',
  cursor: 'pointer',
  fontWeight: 600,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const primaryButtonStyle = {
  backgroundColor: '#15181d',
  color: '#e5e7eb',
};

const ghostButtonStyle = {
  backgroundColor: 'transparent',
  color: '#9ca3af',
};

const previewThemeStyle = `
  <style id="saudilab-preview-theme">
    :root { color-scheme: dark; }
    html, body {
      background: #0b0d10;
      color: #e5e7eb;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      padding: 16px;
      box-sizing: border-box;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #f3f4f6;
    }
    p, li, span, div {
      color: #e5e7eb;
    }
    a {
      color: #93c5fd;
    }
  </style>
`;

function withPreviewTheme(doc) {
  const source = String(doc || '');
  if (source.includes('saudilab-preview-theme')) return source;
  if (/<head[^>]*>/i.test(source)) {
    return source.replace(/<head[^>]*>/i, (m) => `${m}${previewThemeStyle}`);
  }
  return `<!DOCTYPE html><html><head>${previewThemeStyle}</head><body>${source}</body></html>`;
}

function courseLabel(course) {
  return course === 'css' ? 'CSS' : 'HTML';
}

function prismLanguageForCourse(course) {
  return course === 'css' ? 'css' : 'html';
}

export default function TryPage({ course = 'html', lessonId = 'lesson1' }) {
  const lessonNumber = Number(String(lessonId).replace('lesson', ''));
  const initialCode = useMemo(() => getTryStarter(course, lessonId), [course, lessonId]);
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(initialCode);
  const [runHover, setRunHover] = useState(false);
  const [backHover, setBackHover] = useState(false);
  const outputDoc = useMemo(() => withPreviewTheme(output), [output]);
  const label = courseLabel(course);
  const lessonMeta = useMemo(() => getLessonMeta(course, lessonNumber), [course, lessonNumber]);
  const lessonTitle = lessonMeta.title;
  const prismLanguage = prismLanguageForCourse(course);
  const codeClass = `language-${prismLanguage}`;
  const preRef = useRef(null);

  const highlighted = useMemo(() => {
    const grammar = Prism.languages[prismLanguage] || Prism.languages.markup;
    return Prism.highlight(code, grammar, prismLanguage);
  }, [code, prismLanguage]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (canAccessLesson(course, lessonNumber)) return;

    const fallbackPath = `/${course}/lesson${lessonNumber}`;
    const redirectPath = getLastUnlockedLessonPath(course) || fallbackPath;
    window.location.replace(redirectPath);
  }, [course, lessonNumber]);

  const syncScroll = (e) => {
    if (!preRef.current) return;
    preRef.current.scrollTop = e.target.scrollTop;
    preRef.current.scrollLeft = e.target.scrollLeft;
  };

  return (
    <Layout title={`${label} Lesson ${lessonNumber}: ${lessonTitle} - Try It Yourself`}>
      <div style={{ padding: '2rem' }}>
        <h1>{`${label} Lesson ${lessonNumber}: ${lessonTitle} - Try It Yourself`}</h1>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ flex: 1 }}>
            <div style={editorShellStyle}>
              <div style={panelHeaderStyle}>Editor</div>
              <div style={editorBodyStyle}>
                <div style={editorInputWrapStyle}>
                  <pre ref={preRef} style={highlightPreStyle} className={codeClass} aria-hidden>
                    <code className={codeClass} dangerouslySetInnerHTML={{ __html: highlighted }} />
                  </pre>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onScroll={syncScroll}
                    spellCheck={false}
                    style={textareaStyle}
                  />
                </div>
              </div>
              <div style={editorFooterStyle}>
                <button
                  onClick={() => setOutput(code)}
                  onMouseEnter={() => setRunHover(true)}
                  onMouseLeave={() => setRunHover(false)}
                  style={{
                    ...buttonBase,
                    ...primaryButtonStyle,
                    backgroundColor: runHover ? '#1c1f25' : '#15181d',
                  }}
                >
                  RUN
                </button>
                <Link
                  to={`/${course}/lesson${lessonNumber}`}
                  onMouseEnter={() => setBackHover(true)}
                  onMouseLeave={() => setBackHover(false)}
                  style={{
                    ...buttonBase,
                    ...ghostButtonStyle,
                    backgroundColor: backHover ? '#14171b' : 'transparent',
                  }}
                >
                  {`Back to Lesson ${lessonNumber}`}
                </Link>
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ ...outputPanelStyle, display: 'flex', flexDirection: 'column' }}>
              <div style={panelHeaderStyle}>Preview</div>
              <div style={outputBodyStyle}>
                <iframe title="output" style={frameStyle} srcDoc={outputDoc} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
