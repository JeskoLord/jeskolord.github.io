(function () {
  "use strict";

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function getGreeting(hour) {
    if (hour >= 5 && hour < 12) return "Good Morning!";
    if (hour >= 12 && hour < 17) return "Good Afternoon!";
    if (hour >= 17 && hour < 21) return "Good Evening!";
    return "Good Night!";
  }

  function greetOncePerSession() {
    try {
      if (sessionStorage.getItem("lab6_greeted") === "1") return;
      sessionStorage.setItem("lab6_greeted", "1");
    } catch (_) {}

    const now = new Date();
    alert(getGreeting(now.getHours()));

    const greetingText = document.getElementById("greetingText");
    if (greetingText) greetingText.textContent = getGreeting(now.getHours());
  }

  function startClock() {
    const clockEl = document.getElementById("clock");
    const pageClockEl = document.getElementById("pageClock");
    if (!clockEl && !pageClockEl) return;

    function tick() {
      const now = new Date();
      const timeStr = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(
        now.getSeconds()
      )}`;

      if (clockEl) clockEl.textContent = timeStr;
      if (pageClockEl) pageClockEl.textContent = timeStr;

      const greetingText = document.getElementById("greetingText");
      if (greetingText) greetingText.textContent = getGreeting(now.getHours());
    }

    tick();
    setInterval(tick, 1000);
  }

  function setupBallGame() {
    const openBtn = document.getElementById("openBallGame");
    const modal = document.getElementById("ballModal");
    const closeBtn = document.getElementById("closeBallGame");
    const startBtn = document.getElementById("startBall");
    const pauseBtn = document.getElementById("pauseBall");
    const resetBtn = document.getElementById("resetBall");
    const wrap = document.getElementById("ballWrap");
    const ball = document.getElementById("ball");

    if (!openBtn || !modal || !closeBtn || !wrap || !ball || !startBtn || !pauseBtn || !resetBtn) return;

    let rafId = null;

    let x = 40;
    let y = 40;

    let vx = 1.4;
    let vy = 1.2;

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    function render() {
      ball.style.transform = `translate(${x}px, ${y}px)`;
    }

    function bounds() {
      const maxX = wrap.clientWidth - ball.offsetWidth;
      const maxY = wrap.clientHeight - ball.offsetHeight;
      return { maxX, maxY };
    }

    function stop() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      pauseBtn.textContent = "Pause";
    }

    function start() {
      if (rafId) return;
      rafId = requestAnimationFrame(step);
      pauseBtn.textContent = "Pause";
    }

    function togglePause() {
      if (rafId) {
        stop();
        pauseBtn.textContent = "Resume";
      } else {
        start();
      }
    }

    function reset() {
      stop();
      x = 40;
      y = 40;
      vx = 1.4;
      vy = 1.2;
      render();
    }

    function step() {
      if (!dragging) {
        const { maxX, maxY } = bounds();

        x += vx;
        y += vy;

        if (x <= 0) {
          x = 0;
          vx *= -1;
        }
        if (x >= maxX) {
          x = maxX;
          vx *= -1;
        }
        if (y <= 0) {
          y = 0;
          vy *= -1;
        }
        if (y >= maxY) {
          y = maxY;
          vy *= -1;
        }

        render();
      }

      rafId = requestAnimationFrame(step);
    }

    function openModal() {
      modal.classList.add("show");
      document.body.classList.add("no-scroll");
      reset();
    }

    function closeModal() {
      stop();
      modal.classList.remove("show");
      document.body.classList.remove("no-scroll");
    }

    function onPointerDown(e) {
      stop();
      dragging = true;
      ball.classList.add("dragging");

      const rect = ball.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      ball.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e) {
      if (!dragging) return;

      const wrapRect = wrap.getBoundingClientRect();
      const { maxX, maxY } = bounds();

      x = e.clientX - wrapRect.left - offsetX;
      y = e.clientY - wrapRect.top - offsetY;

      if (x < 0) x = 0;
      if (x > maxX) x = maxX;
      if (y < 0) y = 0;
      if (y > maxY) y = maxY;

      render();
    }

    function onPointerUp(e) {
      dragging = false;
      ball.classList.remove("dragging");
      try { ball.releasePointerCapture(e.pointerId); } catch (_) {}
    }

    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    startBtn.addEventListener("click", start);
    pauseBtn.addEventListener("click", togglePause);
    resetBtn.addEventListener("click", reset);

    ball.addEventListener("click", () => {
      if (!dragging) togglePause();
    });

    ball.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    render();
  }

  function wireContactEmail() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const status = document.getElementById("contactStatus");

    const fromName = document.getElementById("fromName");
    const fromEmail = document.getElementById("fromEmail");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    const spamKeywords = [
      "free money",
      "win big",
      "click here",
      "urgent",
      "act now",
      "limited time",
      "bitcoin giveaway",
      "claim now",
      "congratulations you won",
      "guaranteed profit"
    ];

    function setStatus(type, text) {
      status.className = `status ${type}`;
      status.style.display = "block";
      status.textContent = text;
    }

    function clearStatus() {
      status.className = "status";
      status.style.display = "none";
      status.textContent = "";
    }

    function containsSpam(text) {
      const t = text.toLowerCase();
      return spamKeywords.find(keyword => t.includes(keyword));
    }

    form.addEventListener("reset", () => {
      setTimeout(clearStatus, 0);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearStatus();

      const payload = {
        to_email: "aquachua24@gmail.com",
        from_name: fromName.value.trim(),
        from_email: fromEmail.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim()
      };

      console.log("Contact Form Data:", payload);

      if (!payload.from_name || !payload.from_email || !payload.subject || !payload.message) {
        setStatus("err", "Please complete all fields.");
        return;
      }

      const spamHit = containsSpam(payload.subject + " " + payload.message);

      if (spamHit) {
        setStatus("err", `Message blocked. Spam keyword detected: "${spamHit}"`);
        return;
      }

      const mailtoLink = `mailto:${payload.to_email}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(
        `From: ${payload.from_name} <${payload.from_email}>\n\n${payload.message}`
      )}`;

      window.location.href = mailtoLink;

      setStatus("ok", "Opening your email app to send the message.");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("clock")) greetOncePerSession();
    startClock();
    setupBallGame();
    wireContactEmail();
  });

})();
