import React, { useEffect, useMemo, useRef, useState } from 'react';

const MESSAGE_SOURCE = 'saudilab_js_try';
const CONSOLE_PLACEHOLDER = 'No output yet. Press RUN.';
const RUN_DELAY_MS = 2000;
const CONSOLE_PANEL_HEIGHT = 220;
const PREVIEW_PANEL_HEIGHT = 280;

const previewThemeStyle = `
  <style id="saudilab-preview-theme">
    :root { color-scheme: dark; }
    html, body {
      background: #0b0d10;
      color: #e5e7eb;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      padding: 16px;
      box-sizing: border-box;
      margin: 0;
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
    button, input, textarea, select {
      font: inherit;
    }
    button {
      border-radius: 8px;
      border: 1px solid #4b5563;
      background: #111827;
      color: #e5e7eb;
      padding: 8px 12px;
      cursor: pointer;
    }
  </style>
`;

function modeHasConsole(mode) {
  return mode === 'console' || mode === 'console+preview';
}

function modeHasPreview(mode) {
  return mode === 'preview' || mode === 'console+preview';
}

function getPreviewTemplate(lessonNumber) {
  if (lessonNumber === 10) {
    return `
      <main>
        <h1>JavaScript Interaction</h1>
        <p>Click the button to change this message.</p>
        <button>Click Me</button>
      </main>
    `;
  }
  if (lessonNumber === 9) {
    return `
      <main>
        <h1>Welcome</h1>
        <p>This text will change.</p>
      </main>
    `;
  }
  return '';
}

function buildJavascriptExecutionDoc({ source, runToken, previewTemplate, reportConsole }) {
  const encodedCode = JSON.stringify(String(source || '')).replace(/<\//g, '<\\/');
  const encodedTemplate = JSON.stringify(String(previewTemplate || '')).replace(/<\//g, '<\\/');
  const encodedRunToken = JSON.stringify(String(runToken || 0));
  const shouldReport = reportConsole ? 'true' : 'false';

  return `<!DOCTYPE html>
<html>
  <head>
    ${previewThemeStyle}
  </head>
  <body>
    <script>
      (function () {
        var runToken = ${encodedRunToken};
        var previewTemplate = ${encodedTemplate};
        var code = ${encodedCode};
        var reportConsole = ${shouldReport};

        function stringify(value) {
          if (typeof value === 'string') return value;
          try {
            return JSON.stringify(value);
          } catch (e) {
            return String(value);
          }
        }

        function postMessageLine(type, text) {
          if (!reportConsole) return;
          try {
            window.parent.postMessage({
              source: '${MESSAGE_SOURCE}',
              runToken: runToken,
              type: type,
              text: text,
            }, '*');
          } catch (e) {
            // Ignore parent messaging failures.
          }
        }

        if (previewTemplate) {
          var root = document.createElement('div');
          root.id = 'sl-preview-root';
          root.innerHTML = previewTemplate;
          document.body.appendChild(root);
        }

        var originalLog = console.log.bind(console);
        console.log = function () {
          var message = Array.prototype.map.call(arguments, stringify).join(' ');
          postMessageLine('log', message);
          originalLog.apply(console, arguments);
        };

        window.onerror = function (message, source, lineno, colno) {
          postMessageLine('error', 'Runtime Error: ' + message + ' (' + lineno + ':' + colno + ')');
          return true;
        };

        window.onunhandledrejection = function (event) {
          var reason = event && event.reason ? stringify(event.reason) : 'Unknown promise rejection';
          postMessageLine('error', 'Unhandled Rejection: ' + reason);
        };

        try {
          var fn = new Function(code);
          fn();
        } catch (error) {
          postMessageLine('error', 'Runtime Error: ' + (error && error.message ? error.message : String(error)));
        }

        postMessageLine('done', '');
      })();
    </script>
  </body>
</html>`;
}

function ConsolePanel({
  lines,
  isRunning,
  runningDotStep,
  panelShellStyle,
  panelHeaderStyle,
  panelBodyStyle,
}) {
  const runningText = `Running${'.'.repeat(runningDotStep + 1)}`;

  return (
    <div style={panelShellStyle} className="sl-try-panel">
      <div style={panelHeaderStyle}>Console Output</div>
      <div style={panelBodyStyle}>
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '6px',
            border: '1px solid #1a1a1a',
            backgroundColor: '#020202',
            padding: '0.75rem',
            overflow: 'auto',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: '12.5px',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            color: '#f8f8f8',
          }}
        >
          {isRunning ? (
            <div style={{ color: '#f8f8f8' }}>
              {runningText}
              <span style={{ opacity: runningDotStep % 2 === 0 ? 1 : 0.35, marginLeft: '0.15rem' }}>|</span>
            </div>
          ) : lines.length === 0 ? (
            <div style={{ opacity: 0.72 }}>{CONSOLE_PLACEHOLDER}</div>
          ) : (
            lines.map((line, index) => (
              <div key={`${line.type}-${index + 1}`} style={{ color: line.type === 'error' ? '#fca5a5' : '#f8f8f8' }}>
                {line.text}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewPanel({
  hasRun,
  previewDoc,
  runToken,
  panelShellStyle,
  panelHeaderStyle,
  panelBodyStyle,
  frameStyle,
}) {
  return (
    <div style={panelShellStyle} className="sl-try-panel">
      <div style={panelHeaderStyle}>Preview</div>
      <div style={panelBodyStyle}>
        {hasRun ? (
          <iframe
            key={`javascript-preview-${runToken}`}
            title="javascript-preview"
            style={frameStyle}
            srcDoc={previewDoc}
            sandbox="allow-scripts"
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.24)',
              backgroundColor: '#0a0f14',
              padding: '0.75rem',
              color: '#e5e7eb',
              opacity: 0.72,
            }}
          >
            Press RUN to load the preview.
          </div>
        )}
      </div>
    </div>
  );
}

export default function JavascriptTryWorkspace({
  mode = 'console',
  source = '',
  runToken = 0,
  hasRun = false,
  lessonNumber = 1,
  outputPanelStyle,
  panelHeaderStyle,
  outputBodyStyle,
  frameStyle,
}) {
  const [lines, setLines] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [runningDotStep, setRunningDotStep] = useState(0);
  const runTokenRef = useRef(String(runToken));
  const runDelayTimerRef = useRef(null);
  const runningDotsTimerRef = useRef(null);
  const hasConsole = modeHasConsole(mode);
  const hasPreview = modeHasPreview(mode);

  const previewTemplate = useMemo(() => getPreviewTemplate(lessonNumber), [lessonNumber]);

  const consoleRunnerDoc = useMemo(() => {
    if (!hasRun || !hasConsole || hasPreview) return '';
    return buildJavascriptExecutionDoc({
      source,
      runToken,
      previewTemplate: '',
      reportConsole: true,
    });
  }, [hasRun, hasConsole, hasPreview, source, runToken]);

  const previewDoc = useMemo(() => {
    if (!hasRun || !hasPreview) return '';
    return buildJavascriptExecutionDoc({
      source,
      runToken,
      previewTemplate,
      reportConsole: hasConsole,
    });
  }, [hasRun, hasPreview, hasConsole, previewTemplate, source, runToken]);

  useEffect(() => {
    runTokenRef.current = String(runToken);
    if (hasConsole && hasRun) {
      setLines([]);
      setIsRunning(true);
      setRunningDotStep(0);

      if (runDelayTimerRef.current) {
        window.clearTimeout(runDelayTimerRef.current);
      }
      runDelayTimerRef.current = window.setTimeout(() => {
        setIsRunning(false);
      }, RUN_DELAY_MS);
    }
  }, [runToken, hasConsole, hasRun]);

  useEffect(() => {
    if (!hasConsole || !isRunning) return undefined;

    if (runningDotsTimerRef.current) {
      window.clearInterval(runningDotsTimerRef.current);
    }

    runningDotsTimerRef.current = window.setInterval(() => {
      setRunningDotStep((prev) => (prev + 1) % 3);
    }, 330);

    return () => {
      if (runningDotsTimerRef.current) {
        window.clearInterval(runningDotsTimerRef.current);
        runningDotsTimerRef.current = null;
      }
    };
  }, [hasConsole, isRunning]);

  useEffect(
    () => () => {
      if (runDelayTimerRef.current) {
        window.clearTimeout(runDelayTimerRef.current);
      }
      if (runningDotsTimerRef.current) {
        window.clearInterval(runningDotsTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!hasConsole) return undefined;

    const onMessage = (event) => {
      const data = event?.data;
      if (!data || data.source !== MESSAGE_SOURCE) return;
      if (String(data.runToken) !== runTokenRef.current) return;
      if (data.type !== 'log' && data.type !== 'error') return;
      const text = String(data.text || '');
      setLines((prev) => [...prev, { type: data.type, text }]);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [hasConsole]);

  const panelShellStyle = useMemo(
    () => ({
      ...outputPanelStyle,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'none',
    }),
    [outputPanelStyle],
  );

  const consoleShellStyle = useMemo(
    () => ({
      ...panelShellStyle,
      height: CONSOLE_PANEL_HEIGHT,
      background: '#050505',
      border: '1px solid #1f1f1f',
    }),
    [panelShellStyle],
  );

  const previewShellStyle = useMemo(
    () => ({
      ...panelShellStyle,
      height: PREVIEW_PANEL_HEIGHT,
    }),
    [panelShellStyle],
  );

  const consoleHeaderStyle = useMemo(
    () => ({
      ...panelHeaderStyle,
      background: '#070707',
      color: '#f8f8f8',
      borderBottom: '1px solid #1f1f1f',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      letterSpacing: '0.01em',
    }),
    [panelHeaderStyle],
  );

  if (mode === 'console') {
    return (
      <>
        <ConsolePanel
          lines={lines}
          isRunning={isRunning}
          runningDotStep={runningDotStep}
          panelShellStyle={consoleShellStyle}
          panelHeaderStyle={consoleHeaderStyle}
          panelBodyStyle={outputBodyStyle}
        />
        {hasRun ? (
          <iframe
            key={`javascript-console-runner-${runToken}`}
            title="javascript-console-runner"
            srcDoc={consoleRunnerDoc}
            sandbox="allow-scripts"
            style={{ display: 'none' }}
          />
        ) : null}
      </>
    );
  }

  if (mode === 'preview') {
    return (
      <PreviewPanel
        hasRun={hasRun}
        previewDoc={previewDoc}
        runToken={runToken}
        panelShellStyle={previewShellStyle}
        panelHeaderStyle={panelHeaderStyle}
        panelBodyStyle={outputBodyStyle}
        frameStyle={frameStyle}
      />
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateRows: `${CONSOLE_PANEL_HEIGHT}px ${PREVIEW_PANEL_HEIGHT}px`, gap: '0.7rem' }}>
      <ConsolePanel
        lines={lines}
        isRunning={isRunning}
        runningDotStep={runningDotStep}
        panelShellStyle={consoleShellStyle}
        panelHeaderStyle={consoleHeaderStyle}
        panelBodyStyle={outputBodyStyle}
      />
      <PreviewPanel
        hasRun={hasRun}
        previewDoc={previewDoc}
        runToken={runToken}
        panelShellStyle={previewShellStyle}
        panelHeaderStyle={panelHeaderStyle}
        panelBodyStyle={outputBodyStyle}
        frameStyle={frameStyle}
      />
    </div>
  );
}
