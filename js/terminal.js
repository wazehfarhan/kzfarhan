// terminal.js — Interactive terminal resume with command-by-command typing
(function () {
  var contentEl = document.getElementById('terminal-content');
  if (!contentEl) return;

  var TYPE_SPEED = 40;      // ms per character for commands
  var CMD_PAUSE = 400;      // pause after command before output
  var OUTPUT_LINE_DELAY = 80; // stagger between output lines
  var NEXT_CMD_DELAY = 700; // pause before next command

  // Commands and their outputs
  var commands = [
    {
      cmd: 'whoami',
      output: function () {
        return [
          '<span class="term-label">Name:</span> <span class="term-value">Kazi Md. Wazeh Ullah Farhan</span>',
          '<span class="term-label">Role:</span> <span class="term-value">Computer Science Student & Developer</span>',
          '<span class="term-label">Location:</span> <span class="term-value">Dhaka, Bangladesh</span>',
          '<span class="term-label">University:</span> <span class="term-value">AIUB (American International University-Bangladesh)</span>',
        ];
      },
    },
    {
      cmd: 'cat skills.txt',
      output: function () {
        var skills = [
          'JavaScript', 'React', 'HTML/CSS', 'Python',
          'C++', 'Java', 'Node.js', 'SQL',
          'AI/ML', 'Git', 'DSA', 'OOP',
        ];
        var badges = skills.map(function (s) {
          return '<span class="term-skill-badge">' + s + '</span>';
        }).join('');
        return [
          '<span class="term-label">Core Skills:</span>',
          '<div class="term-skills">' + badges + '</div>',
        ];
      },
    },
    {
      cmd: 'cat education.log',
      output: function () {
        return [
          '<div class="term-edu-item"><span class="term-edu-year">2023–2026</span> <span class="term-edu-detail"><strong>BSc in CSE</strong> — AIUB · Semester 10</span></div>',
          '<div class="term-edu-item"><span class="term-edu-year">2021</span> <span class="term-edu-detail"><strong>HSC</strong> — Holy Land College · GPA: 5.00</span></div>',
        ];
      },
    },
    {
      cmd: 'cat experience.json',
      output: function () {
        return [
          '<span class="term-json-bracket">[</span>',
          '  <span class="term-json-bracket">{</span>',
          '    <span class="term-json-key">"company"</span>: <span class="term-json-string">"FlyRank AI"</span>,',
          '    <span class="term-json-key">"role"</span>: <span class="term-json-string">"AI Intern"</span>,',
          '    <span class="term-json-key">"period"</span>: <span class="term-json-string">"Jul 2026 - Present"</span>,',
          '    <span class="term-json-key">"location"</span>: <span class="term-json-string">"Chicago, Illinois (Remote)"</span>',
          '  <span class="term-json-bracket">}</span>,',
          '  <span class="term-json-bracket">{</span>',
          '    <span class="term-json-key">"company"</span>: <span class="term-json-string">"Codveda Technologies"</span>,',
          '    <span class="term-json-key">"role"</span>: <span class="term-json-string">"ML Intern"</span>,',
          '    <span class="term-json-key">"period"</span>: <span class="term-json-string">"Jun - Jul 2026"</span>',
          '  <span class="term-json-bracket">}</span>,',
          '  <span class="term-json-bracket">{</span>',
          '    <span class="term-json-key">"company"</span>: <span class="term-json-string">"Syntecxhub"</span>,',
          '    <span class="term-json-key">"role"</span>: <span class="term-json-string">"AI Intern"</span>,',
          '    <span class="term-json-key">"period"</span>: <span class="term-json-string">"May - Jun 2026"</span>',
          '  <span class="term-json-bracket">}</span>',
          '<span class="term-json-bracket">]</span>',
        ];
      },
    },
    {
      cmd: 'curl contact.api',
      output: function () {
        return [
          '<span class="term-label">Email:</span> <a href="mailto:wzullah.farhan@gmail.com" class="term-link">wzullah.farhan@gmail.com</a>',
          '<span class="term-label">GitHub:</span> <a href="https://github.com/wazehfarhan" target="_blank" rel="noopener" class="term-link">github.com/wazehfarhan</a>',
          '<span class="term-label">LinkedIn:</span> <a href="https://linkedin.com/in/w2zfrhn" target="_blank" rel="noopener" class="term-link">linkedin.com/in/w2zfrhn</a>',
        ];
      },
    },
  ];

  var cmdIdx = 0;
  var started = false;

  // Type a command character by character, then show output
  function typeCommand(cmdObj, callback) {
    var lineDiv = document.createElement('div');
    lineDiv.className = 'term-line';

    var promptSpan = document.createElement('span');
    promptSpan.className = 'term-prompt';
    promptSpan.textContent = '❯';

    var cmdSpan = document.createElement('span');
    cmdSpan.className = 'term-command';

    var cursorSpan = document.createElement('span');
    cursorSpan.className = 'term-cursor';

    lineDiv.appendChild(promptSpan);
    lineDiv.appendChild(cmdSpan);
    lineDiv.appendChild(cursorSpan);
    contentEl.appendChild(lineDiv);

    // Auto-scroll
    contentEl.scrollTop = contentEl.scrollHeight;

    var chars = cmdObj.cmd;
    var i = 0;

    function typeChar() {
      if (i < chars.length) {
        cmdSpan.textContent += chars[i];
        i++;
        contentEl.scrollTop = contentEl.scrollHeight;
        setTimeout(typeChar, TYPE_SPEED);
      } else {
        // Remove cursor from command line
        cursorSpan.remove();
        // Pause, then show output
        setTimeout(function () {
          showOutput(cmdObj, callback);
        }, CMD_PAUSE);
      }
    }

    typeChar();
  }

  // Render output lines with staggered animation
  function showOutput(cmdObj, callback) {
    var lines = cmdObj.output();
    var outputDiv = document.createElement('div');
    outputDiv.className = 'term-output';
    contentEl.appendChild(outputDiv);

    var delay = 0;
    lines.forEach(function (lineHTML, idx) {
      delay = idx * OUTPUT_LINE_DELAY;
      setTimeout(function () {
        var lineEl = document.createElement('div');
        lineEl.className = 'term-output-line';
        lineEl.style.animationDelay = '0s';
        lineEl.innerHTML = lineHTML;
        outputDiv.appendChild(lineEl);
        contentEl.scrollTop = contentEl.scrollHeight;
      }, delay);
    });

    // After all lines, call back
    setTimeout(function () {
      if (callback) callback();
    }, delay + OUTPUT_LINE_DELAY + 200);
  }

  // Run commands sequentially
  function runNext() {
    if (cmdIdx >= commands.length) {
      // All done — show final cursor
      var finalLine = document.createElement('div');
      finalLine.className = 'term-line';
      finalLine.innerHTML = '<span class="term-prompt">❯</span> <span class="term-cursor"></span>';
      contentEl.appendChild(finalLine);
      contentEl.scrollTop = contentEl.scrollHeight;
      return;
    }

    typeCommand(commands[cmdIdx], function () {
      cmdIdx++;
      setTimeout(runNext, NEXT_CMD_DELAY);
    });
  }

  // Start when scrolled into view
  var termSection = contentEl.closest('.section-terminal') || contentEl.closest('.terminal');
  if (termSection) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !started) {
          started = true;
          setTimeout(runNext, 500);
          obs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    obs.observe(termSection);
  } else {
    // Fallback
    setTimeout(runNext, 1000);
  }
})();
