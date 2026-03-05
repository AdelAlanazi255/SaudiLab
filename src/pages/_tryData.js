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
    <h1>My First Blog Post</h1>
    <p>This is my first paragraph on the web.</p>

    <h2>What I learned today</h2>
    <p>Headings create structure and paragraphs hold readable text.</p>

    <h3>Next step</h3>
    <p>I will practice writing clean HTML.</p>
  </body>
</html>`,
  'html:lesson3': `<!DOCTYPE html>
<html>
  <head>
    <title>Text Formatting</title>
  </head>
  <body>
    <h1>My Bio</h1>

    <p>
      Hi, my name is <strong>Adel</strong> and I'm learning <em>HTML</em>.
      Today I learned how to <mark>format text</mark> to make it clearer.
    </p>

    <p>
      This is a new line using a line break.<br>
      Use <strong>&lt;p&gt;</strong> for paragraphs, and <strong>&lt;br&gt;</strong> only when you really need a line break.
    </p>

    <small>Tip: Use &lt;strong&gt; and &lt;em&gt; for meaning, not just style.</small>
  </body>
</html>`,
  'html:lesson4': `<!DOCTYPE html>
<html>
  <head>
    <title>Links</title>
  </head>
  <body>
    <h1>My Favorite Links</h1>

    <p>
      Visit <a href="https://www.google.com" target="_blank">Google</a>
      to search the web.
    </p>

    <p>
      Watch videos on
      <a href="https://www.youtube.com" target="_blank">YouTube</a>.
    </p>

    <p>
      Learn something new on
      <a href="https://en.wikipedia.org" target="_blank">Wikipedia</a>.
    </p>

    <p>
      Explore developer documentation on
      <a href="https://developer.mozilla.org" target="_blank">MDN Web Docs</a>.
    </p>
  </body>
</html>`,
  'html:lesson5': `<!DOCTYPE html>
<html>
  <head>
    <title>Images</title>
  </head>
  <body>

    <h1>Kingdom Tower</h1>

    <p>Here is an image of the famous Kingdom Tower in Riyadh.</p>

    <img
      src="https://i.pinimg.com/736x/eb/a6/2d/eba62d4bc16befad3d1c192cdd4d0f5e.jpg"
      alt="Kingdom Tower in Riyadh"
      width="400"
    >

  </body>
</html>`,
  'html:lesson6': `<!DOCTYPE html>
<html>
  <head>
    <title>Lists</title>
  </head>
  <body>
    <h1>Lists in HTML</h1>

    <h2>My Favorite Snacks</h2>
    <ul>
      <li>Popcorn</li>
      <li>Dates</li>
      <li>Yogurt</li>
    </ul>

    <h2>Steps to Make Tea</h2>
    <ol>
      <li>Boil water</li>
      <li>Add a tea bag to a cup</li>
      <li>Pour hot water into the cup</li>
      <li>Wait 2 minutes and serve</li>
    </ol>

    <h2>Weekend Plan</h2>
    <ul>
      <li>
        Study
        <ul>
          <li>Review HTML lessons</li>
          <li>Practice in the Try page</li>
        </ul>
      </li>
      <li>Exercise</li>
    </ul>
  </body>
</html>`,
  'html:lesson7': `<!DOCTYPE html>
<html>
  <head>
    <title>Tables</title>
    <style>
      table {
        border-collapse: collapse;
      }

      th,
      td {
        border: 1px solid #ccc;
        padding: 8px 10px;
        text-align: left;
      }
    </style>
  </head>
  <body>
    <h1>Weekly Study Plan</h1>

    <table>
      <caption>My Weekly Study Plan</caption>
      <tr>
        <th>Day</th>
        <th>Subject</th>
        <th>Duration</th>
      </tr>
      <tr>
        <td>Sunday</td>
        <td>HTML</td>
        <td>45 min</td>
      </tr>
      <tr>
        <td>Monday</td>
        <td>CSS</td>
        <td>45 min</td>
      </tr>
      <tr>
        <td>Tuesday</td>
        <td>JavaScript</td>
        <td>60 min</td>
      </tr>
    </table>
  </body>
</html>`,
  'html:lesson8': `<!DOCTYPE html>
<html>
  <head>
    <title>Forms Basics</title>
    <style>
      form {
        max-width: 360px;
        padding: 14px;
        border: 1px solid #2e3643;
        border-radius: 10px;
      }

      label {
        display: block;
        margin-bottom: 4px;
      }

      input {
        width: 100%;
        padding: 8px 10px;
        margin-bottom: 10px;
        border: 1px solid #4b5563;
        border-radius: 8px;
        box-sizing: border-box;
      }

      button {
        padding: 8px 12px;
        border: 1px solid #4b5563;
        border-radius: 8px;
        background: #111827;
        color: #e5e7eb;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <h1>Sign Up</h1>
    <!-- This prevents the page from reloading in the preview. -->
    <form onsubmit="return false;">
      <label for="name">Name</label>
      <input id="name" type="text" placeholder="Enter your name" required />

      <label for="email">Email</label>
      <input id="email" type="email" placeholder="Enter your email" required />

      <label for="password">Password</label>
      <input id="password" type="password" placeholder="Create a password" required />

      <button id="createAccountBtn" type="submit">Create Account</button>
      <div
        id="successMessage"
        style="display:none; margin-top:10px; padding:8px 10px; border:1px solid rgba(124,242,176,0.28); border-radius:8px; color:#9fe8c6;"
      >
        Account created
      </div>
    </form>

    <script>
      document.getElementById('createAccountBtn').addEventListener('click', function () {
        document.getElementById('successMessage').style.display = 'block';
      });
    </script>
  </body>
</html>`,
  'html:lesson9': `<!DOCTYPE html>
<html>
  <head>
    <title>Form Inputs</title>
  </head>
  <body>
    <h1>Quick Form</h1>
    <!-- This prevents the page from reloading in the preview. -->
    <form onsubmit="showMessage(); return false;">
      <label for="name">Name</label>
      <input id="name" type="text" placeholder="Enter your name" />

      <button type="submit">Submit</button>
    </form>
    <div
      id="thankYouMessage"
      style="display:none; margin-top:10px; padding:8px 10px; border:1px solid rgba(124,242,176,0.28); border-radius:8px; color:#9fe8c6;"
    >
      Thank you!
    </div>

    <script>
      function showMessage() {
        document.getElementById('thankYouMessage').style.display = 'block';
      }
    </script>
  </body>
</html>`,
  'html:lesson10': `<!DOCTYPE html>
<html>
  <head>
    <title>Semantic Layout</title>
  </head>
  <body>
    <header>
      <h1>SaudiLab Student Page</h1>
    </header>

    <nav>
      <a href="https://www.google.com" target="_blank">Home</a> |
      <a href="https://www.youtube.com" target="_blank">Lessons</a> |
      <a href="https://www.wikipedia.org" target="_blank">Profile</a>
    </nav>

    <main>
      <section>
        <h2>About This Page</h2>
        <p>This section combines things you learned earlier in the course.</p>
        <img src="https://via.placeholder.com/320x160" alt="Learning banner" />

        <h3>My Goals</h3>
        <ul>
          <li>Practice HTML daily</li>
          <li>Build one mini project each week</li>
          <li>Share progress with friends</li>
        </ul>
      </section>

      <section>
        <h2>Weekly Plan Table</h2>
        <table border="1" style="border-collapse: collapse;">
          <tr>
            <th>Day</th>
            <th>Topic</th>
            <th>Time</th>
          </tr>
          <tr>
            <td>Sunday</td>
            <td>HTML</td>
            <td>45 min</td>
          </tr>
          <tr>
            <td>Monday</td>
            <td>CSS</td>
            <td>45 min</td>
          </tr>
        </table>
      </section>
    </main>

    <footer>
      <p>Copyright 2026 SaudiLab</p>
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
  'javascript:lesson1': `console.log("Hello from JavaScript!");
console.log(2 + 2);`,
  'javascript:lesson2': `const studentName = "Ahmad";
let score = 10;

score = score + 5;
console.log(studentName, score);`,
  'javascript:lesson3': `const a = 8;
const b = 3;

console.log(a + b);
console.log(a - b);
console.log(a > b);`,
  'javascript:lesson4': `const temperature = 32;

if (temperature > 30) {
  console.log("It is hot today.");
} else {
  console.log("Weather is mild.");
}`,
  'javascript:lesson5': `for (let i = 1; i <= 5; i += 1) {
  console.log("Step", i);
}`,
  'javascript:lesson6': `function greet(name) {
  return \`Welcome, \${name}!\`;
}

console.log(greet("Student"));`,
  'javascript:lesson7': `const topics = ["HTML", "CSS", "JavaScript"];

console.log(topics[0]);
console.log(topics.length);`,
  'javascript:lesson8': `const user = {
  name: "Sara",
  level: "Beginner",
};

console.log(user.name);`,
  'javascript:lesson9': `document.body.innerHTML = "<h1 id=\\"title\\">Hello</h1>";
const title = document.getElementById("title");

title.textContent = "Hello from DOM";`,
  'javascript:lesson10': `document.body.innerHTML = "<button id=\\"btn\\">Click me</button>";
const button = document.getElementById("btn");

button.addEventListener("click", () => {
  console.log("Button clicked");
});`,
  'cse:cse_lesson1': `<!DOCTYPE html>
<html>
  <body>
    <div style="max-width:520px;margin:0 auto;font-family:system-ui,sans-serif;">
      <h1 style="margin-top:0;">Security Choices Simulator</h1>
      <p>Select your habits to see how risk changes.</p>

      <label for="password">Password strength</label><br />
      <select id="password">
        <option value="weak">Weak</option>
        <option value="medium">Medium</option>
        <option value="strong">Strong</option>
      </select>
      <br /><br />

      <label for="mfa">MFA</label><br />
      <select id="mfa">
        <option value="off">Off</option>
        <option value="on">On</option>
      </select>
      <br /><br />

      <label for="links">Suspicious links behavior</label><br />
      <select id="links">
        <option value="often">Often</option>
        <option value="sometimes">Sometimes</option>
        <option value="never">Never</option>
      </select>
      <br /><br />

      <div id="meter" style="padding:10px;border-radius:8px;background:#7f1d1d;">Risk: High</div>
      <p id="explain" style="margin-top:10px;">Current choices increase your exposure to account compromise.</p>

      <button id="resetBtn" style="padding:8px 12px;border-radius:6px;border:1px solid #334155;background:#111827;color:#e5e7eb;">Reset</button>
    </div>

    <script>
      const password = document.getElementById('password');
      const mfa = document.getElementById('mfa');
      const links = document.getElementById('links');
      const meter = document.getElementById('meter');
      const explain = document.getElementById('explain');
      const resetBtn = document.getElementById('resetBtn');

      function calculateRisk() {
        let score = 0;
        score += password.value === 'weak' ? 3 : password.value === 'medium' ? 2 : 0;
        score += mfa.value === 'off' ? 3 : 0;
        score += links.value === 'often' ? 3 : links.value === 'sometimes' ? 2 : 0;

        if (score >= 7) {
          meter.textContent = 'Risk: High';
          meter.style.background = '#7f1d1d';
          explain.textContent = 'Current choices increase your exposure to account compromise.';
        } else if (score >= 4) {
          meter.textContent = 'Risk: Medium';
          meter.style.background = '#78350f';
          explain.textContent = 'You have some protection, but key habits should be improved.';
        } else {
          meter.textContent = 'Risk: Low';
          meter.style.background = '#14532d';
          explain.textContent = 'These choices reduce common account and phishing risks.';
        }
      }

      function resetForm() {
        password.value = 'weak';
        mfa.value = 'off';
        links.value = 'often';
        calculateRisk();
      }

      password.addEventListener('change', calculateRisk);
      mfa.addEventListener('change', calculateRisk);
      links.addEventListener('change', calculateRisk);
      resetBtn.addEventListener('click', resetForm);

      calculateRisk();
    </script>
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

