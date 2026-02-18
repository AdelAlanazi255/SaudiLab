export const cssTryData = {
  lesson1: {
    title: 'CSS Lesson 1 - Try It',
    backTo: '/css/lesson1',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>CSS 1</title>
  <style>
    body { background: #0b0f14; color: white; font-family: Arial; padding: 24px; }
    h1 { color: #7cf2b0; }
  </style>
</head>
<body>
  <h1>Hello SaudiLab</h1>
  <p>Edit CSS and press RUN.</p>
</body>
</html>`,
  },

  lesson2: {
    title: 'CSS Lesson 2 - Try It',
    backTo: '/css/lesson2',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>CSS 2</title>
  <style>
    .card { border: 1px solid rgba(255,255,255,0.25); padding: 16px; border-radius: 12px; }
    #title { color: #7cf2b0; }
  </style>
</head>
<body style="background:#0b0f14;color:white;font-family:Arial;padding:24px;">
  <h1 id="title">Selectors</h1>
  <div class="card">Try changing .card styles</div>
</body>
</html>`,
  },

  lesson3: {
    title: 'CSS Lesson 3 - Try It',
    backTo: '/css/lesson3',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>CSS 3</title>
  <style>
    body { background: #0b0f14; color: white; font-family: Arial; padding: 24px; }
    .box { background: rgba(124,242,176,0.10); border: 1px solid rgba(124,242,176,0.25); padding: 16px; border-radius: 14px; }
  </style>
</head>
<body>
  <div class="box">Change my background & border colors</div>
</body>
</html>`,
  },

  lesson4: {
    title: 'CSS Lesson 4 - Try It',
    backTo: '/css/lesson4',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>CSS 4</title>
  <style>
    body { background:#0b0f14;color:white;font-family:Arial;padding:24px; }
    .box { padding: 20px; border: 2px solid white; margin: 20px; border-radius: 12px; }
  </style>
</head>
<body>
  <div class="box">Play with padding/border/margin</div>
</body>
</html>`,
  },

  lesson5: {
    title: 'CSS Lesson 5 - Try It',
    backTo: '/css/lesson5',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>CSS 5</title>
  <style>
    body { background:#0b0f14;color:white;font-family:Arial;padding:24px; }
    h1 { font-size: 42px; font-weight: 900; }
    p { line-height: 1.7; opacity: 0.9; }
  </style>
</head>
<body>
  <h1>Typography</h1>
  <p>Change font-size, weight, and line-height.</p>
</body>
</html>`,
  },

  lesson6: {
    title: 'CSS Lesson 6 - Try It',
    backTo: '/css/lesson6',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>CSS 6</title>
  <style>
    body { background:#0b0f14;color:white;font-family:Arial;padding:24px; }
    .wrap { position: relative; height: 140px; border: 1px solid rgba(255,255,255,0.25); border-radius: 12px; padding: 16px; }
    .badge { position: absolute; top: 12px; right: 12px; background:#7cf2b0;color:#0b0f14;padding:6px 10px;border-radius:999px;font-weight:900; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="badge">ABS</div>
    Try moving the badge using top/right/left/bottom.
  </div>
</body>
</html>`,
  },

  lesson7: {
    title: 'CSS Lesson 7 - Try It',
    backTo: '/css/lesson7',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>CSS 7</title>
  <style>
    body { background:#0b0f14;color:white;font-family:Arial;padding:24px; }
    .row { display:flex; gap:12px; }
    .item { flex:1; padding:14px; border-radius:12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); }
  </style>
</head>
<body>
  <div class="row">
    <div class="item">A</div>
    <div class="item">B</div>
    <div class="item">C</div>
  </div>
</body>
</html>`,
  },

  lesson8: {
    title: 'CSS Lesson 8 - Try It',
    backTo: '/css/lesson8',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>CSS 8</title>
  <style>
    body { background:#0b0f14;color:white;font-family:Arial;padding:24px; }
    .grid { display:grid; gap:12px; grid-template-columns: repeat(3, 1fr); }
    .cell { padding:16px; border-radius:12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); text-align:center; font-weight:900; }
  </style>
</head>
<body>
  <div class="grid">
    <div class="cell">1</div><div class="cell">2</div><div class="cell">3</div>
    <div class="cell">4</div><div class="cell">5</div><div class="cell">6</div>
  </div>
</body>
</html>`,
  },

  lesson9: {
    title: 'CSS Lesson 9 - Try It',
    backTo: '/css/lesson9',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>CSS 9</title>
  <style>
    body { background:#0b0f14;color:white;font-family:Arial;padding:24px; }
    .box { padding:24px; border-radius:16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); }
    @media (max-width: 600px) { .box { padding: 12px; } }
  </style>
</head>
<body>
  <div class="box">Resize the window to see padding change.</div>
</body>
</html>`,
  },

  lesson10: {
    title: 'CSS Lesson 10 - Try It',
    backTo: '/css/lesson10',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>CSS 10</title>
  <style>
    body { background:#0b0f14;color:white;font-family:Arial;padding:24px; }
    .card { width: 360px; padding: 18px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.06); transition: transform .25s ease, box-shadow .25s ease; }
    .card:hover { transform: translateY(-4px); box-shadow: 0 0 45px rgba(124,242,176,0.14); }
    .title { font-weight: 950; font-size: 22px; margin: 0 0 8px 0; }
    .muted { opacity: .75; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <div class="title">Mini Project Card</div>
    <div class="muted">Improve this card UI, then press RUN.</div>
  </div>
</body>
</html>`,
  },
};
