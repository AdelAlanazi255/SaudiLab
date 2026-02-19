const TRY_STARTERS = {
  'html:lesson1': `<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    <p>Edit this code and press RUN.</p>
  </body>
</html>`,
  'html:lesson2': `<!DOCTYPE html>
<html>
  <head>
    <title>Headings and Paragraphs</title>
  </head>
  <body>
    <h1>Main Heading</h1>
    <h2>Sub Heading</h2>
    <p>This is a paragraph.</p>
    <p>Edit this text and press RUN.</p>
  </body>
</html>`,
  'html:lesson3': `<!DOCTYPE html>
<html>
  <head>
    <title>Links and Images</title>
  </head>
  <body>
    <h1>Links and Images</h1>
    <a href="https://www.google.com">Visit Google</a>
    <br /><br />
    <img src="https://via.placeholder.com/150" alt="Example Image" />
    <p>Edit and press RUN.</p>
  </body>
</html>`,
  'html:lesson4': `<!DOCTYPE html>
<html>
  <body>
    <a href="https://google.com" target="_blank">Open Google</a>
  </body>
</html>`,
  'html:lesson5': `<!DOCTYPE html>
<html>
  <body>
    <img src="https://via.placeholder.com/320x180" alt="Placeholder image" />
  </body>
</html>`,
  'html:lesson6': `<!DOCTYPE html>
<html>
  <body>
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </body>
</html>`,
  'html:lesson7': `<!DOCTYPE html>
<html>
  <body>
    <table border="1">
      <tr>
        <th>Name</th>
        <th>Age</th>
      </tr>
      <tr>
        <td>Ahmed</td>
        <td>22</td>
      </tr>
    </table>
  </body>
</html>`,
  'html:lesson8': `<!DOCTYPE html>
<html>
  <body>
    <form>
      <label>Name:</label>
      <input type="text" />
      <button type="submit">Submit</button>
    </form>
  </body>
</html>`,
  'html:lesson9': `<!DOCTYPE html>
<html>
  <body>
    <label>
      <input type="checkbox" />
      I agree
    </label>
  </body>
</html>`,
  'html:lesson10': `<!DOCTYPE html>
<html>
  <body>
    <header>
      <h1>My Website</h1>
    </header>

    <nav>
      <a href="#">Home</a>
    </nav>

    <main>
      <section>
        <h2>About</h2>
        <p>Welcome to my site.</p>
      </section>
    </main>

    <footer>
      <p>Copyright 2026</p>
    </footer>
  </body>
</html>`,

  'css:lesson1': `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #f5f7fb;
        color: #1f2937;
      }

      h1 {
        color: #2563eb;
      }

      p {
        color: #374151;
      }
    </style>
  </head>
  <body>
    <h1>CSS Colors</h1>
    <p>Change my color values and press RUN.</p>
  </body>
</html>`,
  'css:lesson2': `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Georgia, serif;
      }

      h1 {
        font-size: 40px;
        text-transform: uppercase;
        letter-spacing: 2px;
      }

      p {
        font-size: 18px;
        line-height: 1.7;
      }
    </style>
  </head>
  <body>
    <h1>Typography</h1>
    <p>Edit font-size, line-height, and letter-spacing.</p>
  </body>
</html>`,
  'css:lesson3': `<!DOCTYPE html>
<html>
  <head>
    <style>
      .card {
        width: 320px;
        padding: 20px;
        border: 2px solid #111827;
        margin: 30px auto;
        background: #ffffff;
      }
    </style>
  </head>
  <body style="background:#f3f4f6;">
    <div class="card">
      <h2>Box Model</h2>
      <p>Try changing width, padding, border, and margin.</p>
    </div>
  </body>
</html>`,
  'css:lesson4': `<!DOCTYPE html>
<html>
  <head>
    <style>
      .banner {
        padding: 24px;
        border-radius: 14px;
        border: 2px dashed #1d4ed8;
        background: linear-gradient(90deg, #dbeafe, #bfdbfe);
      }
    </style>
  </head>
  <body>
    <div class="banner">
      <h2>Background and Borders</h2>
      <p>Adjust border style, radius, and gradient colors.</p>
    </div>
  </body>
</html>`,
  'css:lesson5': `<!DOCTYPE html>
<html>
  <head>
    <style>
      .container {
        display: flex;
        gap: 12px;
      }

      .box {
        flex: 1;
        padding: 20px;
        background: #111827;
        color: #fff;
        border-radius: 10px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="box">One</div>
      <div class="box">Two</div>
      <div class="box">Three</div>
    </div>
  </body>
</html>`,
  'css:lesson6': `<!DOCTYPE html>
<html>
  <head>
    <style>
      .profile {
        max-width: 360px;
        margin: 40px auto;
        padding: 24px;
        border-radius: 16px;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        background: #ffffff;
      }

      .profile h2 {
        margin: 0 0 8px;
      }
    </style>
  </head>
  <body style="background:#eef2ff;">
    <div class="profile">
      <h2>Spacing and Sizing</h2>
      <p>Adjust width, margin, padding, and shadow.</p>
    </div>
  </body>
</html>`,
  'css:lesson7': `<!DOCTYPE html>
<html>
  <head>
    <style>
      button {
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 12px 18px;
        font-size: 16px;
        cursor: pointer;
      }

      button:hover {
        background: #1d4ed8;
      }
    </style>
  </head>
  <body>
    <button>Hover Me</button>
  </body>
</html>`,
  'css:lesson8': `<!DOCTYPE html>
<html>
  <head>
    <style>
      form {
        max-width: 420px;
        margin: 40px auto;
        display: grid;
        gap: 10px;
      }

      input,
      textarea {
        padding: 10px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
      }

      input:focus,
      textarea:focus {
        outline: 2px solid #60a5fa;
      }
    </style>
  </head>
  <body>
    <form>
      <input type="text" placeholder="Your name" />
      <textarea rows="4" placeholder="Your message"></textarea>
    </form>
  </body>
</html>`,
  'css:lesson9': `<!DOCTYPE html>
<html>
  <head>
    <style>
      .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }

      .item {
        background: #dbeafe;
        border: 1px solid #93c5fd;
        padding: 18px;
        text-align: center;
        border-radius: 10px;
      }
    </style>
  </head>
  <body>
    <div class="grid">
      <div class="item">1</div>
      <div class="item">2</div>
      <div class="item">3</div>
      <div class="item">4</div>
      <div class="item">5</div>
      <div class="item">6</div>
    </div>
  </body>
</html>`,
  'css:lesson10': `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
      }

      header,
      footer {
        background: #111827;
        color: #fff;
        padding: 16px;
      }

      main {
        padding: 24px;
      }

      .hero {
        padding: 24px;
        border-radius: 12px;
        background: #e0e7ff;
      }
    </style>
  </head>
  <body>
    <header>My CSS Layout</header>
    <main>
      <section class="hero">
        <h1>Final Practice</h1>
        <p>Edit this layout and make it your own.</p>
      </section>
    </main>
    <footer>Footer</footer>
  </body>
</html>`,
};

export function getTryStarter(course, lessonId) {
  const key = `${course}:${lessonId}`;
  return (
    TRY_STARTERS[key] ||
    `<!DOCTYPE html>
<html>
  <body>
    <h1>Try It</h1>
    <p>Start coding...</p>
  </body>
</html>`
  );
}
