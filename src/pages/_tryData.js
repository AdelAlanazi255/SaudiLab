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
        padding: 24px;
      }

      .lesson-box {
        background-color: #ffffff;
        border: 1px solid #dbe4ee;
        border-radius: 12px;
        padding: 18px;
      }

      h1 {
        color: #1d4ed8;
        font-size: 34px;
        margin: 0 0 10px;
      }

      p {
        color: #334155;
        font-size: 18px;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="lesson-box">
      <h1>Welcome to CSS</h1>
      <p>Edit color, font-size, and background-color, then press RUN.</p>
    </div>
  </body>
</html>`,
  'css:lesson2': `<!DOCTYPE html>
<html>
  <head>
    <style>
      h1 {
        color: #2563eb;
        text-align: left;
      }

      p {
        font-size: 16px;
        color: #334155;
        line-height: 1.7;
      }
    </style>
  </head>
  <body>
    <h1>Selectors and Text</h1>
    <p>This is the first paragraph. Try changing my font size.</p>
    <p>This is the second paragraph. Try changing my color too.</p>
  </body>
</html>`,
  'css:lesson3': `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        background-color: #111827;
        color: #ffffff;
        font-family: Arial, sans-serif;
        padding: 24px;
      }

      h1 {
        color: #2563eb;
        margin-top: 0;
      }

      p {
        color: #ffffff;
      }
    </style>
  </head>
  <body>
    <h1>Colors and Backgrounds</h1>
    <p>Change my text color with the color property.</p>
    <p>Change the page background-color and test readability.</p>
  </body>
</html>`,
  'css:lesson4': `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        background-color: #f8fafc;
        color: #111827;
        font-family: Arial, sans-serif;
        padding: 24px;
      }

      .highlight {
        color: #2563eb;
        font-weight: bold;
      }

      #special-note {
        background-color: #facc15;
        color: #111827;
        padding: 10px;
        border-radius: 8px;
      }
    </style>
  </head>
  <body>
    <h1>Classes and IDs</h1>
    <p class="highlight">This paragraph uses the highlight class.</p>
    <p>This paragraph has no class or ID.</p>
    <p id="special-note">This paragraph uses the special-note ID.</p>
  </body>
</html>`,
  'css:lesson5': `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #eef2ff;
        color: #111827;
        padding: 24px;
      }

      .card {
        max-width: 360px;
        margin: 16px;
        padding: 16px;
        border: 2px solid #2563eb;
        border-radius: 10px;
        background: #ffffff;
      }

      h1 {
        margin: 0 0 10px;
      }

      p {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <h1>Box Model</h1>
    <div class="card">
      <h3>Card Box</h3>
      <p>Try changing padding, border, and margin values.</p>
    </div>
  </body>
</html>`,
  'css:lesson6': `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #eef2ff;
        color: #111827;
        padding: 24px;
      }

      .card {
        width: 300px;
        height: 160px;
        margin: 24px;
        padding: 20px;
        border: 2px solid #2563eb;
        border-radius: 10px;
        background-color: #1f2937;
        color: #ffffff;
      }

      h1 {
        margin: 0 0 10px;
      }

      .card h2 {
        margin: 0 0 8px;
      }

      .card p {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <h1>Spacing and Sizing</h1>
    <div class="card">
      <h2>Spacing and Sizing</h2>
      <p>Edit width, padding, and margin values to see the layout change.</p>
    </div>
  </body>
</html>`,
  'css:lesson7': `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #eef2ff;
        color: #111827;
        padding: 24px;
      }

      h1 {
        margin: 0 0 10px;
      }

      .container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border: 2px solid #2563eb;
        background: #ffffff;
        padding: 14px;
      }

      .box {
        padding: 16px;
        background: #2563eb;
        color: #fff;
        border-radius: 8px;
        margin: 8px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <h1>Flexbox Basics</h1>
    <div class="container">
      <div class="box">Box 1</div>
      <div class="box">Box 2</div>
      <div class="box">Box 3</div>
    </div>
  </body>
</html>`,
  'css:lesson8': `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #eef2ff;
        color: #111827;
        padding: 24px;
      }

      h1 {
        margin: 0 0 8px;
      }

      p {
        margin: 0 0 14px;
      }

      button {
        background-color: #2563eb;
        color: white;
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
      }

      button:hover {
        background-color: #1d4ed8;
      }
    </style>
  </head>
  <body>
    <h1>Buttons and Hover</h1>
    <p>Edit the button style, then hover over it in preview.</p>
    <button>Start Learning</button>
  </body>
</html>`,
  'css:lesson9': `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #eef2ff;
        color: #111827;
        padding: 24px;
      }

      h1 {
        margin: 0 0 10px;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .item {
        background: #2563eb;
        border: 1px solid #1d4ed8;
        padding: 18px;
        text-align: center;
        border-radius: 10px;
        color: #ffffff;
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <h1>Grid Basics</h1>
    <div class="grid">
      <div class="item">1</div>
      <div class="item">2</div>
      <div class="item">3</div>
      <div class="item">4</div>
    </div>
  </body>
</html>`,
  'css:lesson10': `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #eef2ff;
        color: #111827;
        padding: 24px;
      }

      .layout {
        max-width: 520px;
        margin: 0 auto;
        background-color: #ffffff;
        border: 2px solid #2563eb;
        border-radius: 12px;
        padding: 18px;
      }

      h1 {
        margin: 0 0 8px;
      }

      p {
        margin: 0 0 12px;
        color: #334155;
      }

      .info-card {
        background-color: #f8fafc;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        padding: 14px;
        margin-bottom: 14px;
      }

      #role-note {
        color: #1d4ed8;
        font-weight: bold;
      }

      button {
        background-color: #2563eb;
        color: #ffffff;
        border: none;
        border-radius: 8px;
        padding: 10px 16px;
        cursor: pointer;
      }

      button:hover {
        background-color: #1d4ed8;
      }
    </style>
  </head>
  <body>
    <div class="layout">
      <h1>My Mini Page Layout</h1>
      <p>This small page combines the CSS skills you learned.</p>

      <div class="info-card">
        <p id="role-note">Beginner Web Learner</p>
        <p>Practice changing colors, spacing, and button styles.</p>
      </div>

      <button>Continue Practice</button>
    </div>
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

