(function () {
  "use strict";

  var envelope = document.getElementById('envelope');
  var introBlock = document.getElementById('intro-block');
  var cardView = document.getElementById('card-view');
  var toLine = document.getElementById('to-line');
  var replayBtn = document.getElementById('replay-btn');
  var musicBtn = document.getElementById('music-btn');
  var audioEl = document.getElementById('birthday-audio');

  var opened = false;
  var musicMuted = false;

  function setMusicButtonLabel() {
    var icon = '<span class="button-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 8.5v7.1a2.2 2.2 0 1 1-2.2-2.2H8l1-.1V8.5Zm7.8-2.4-2.8 1.1v9.5l2.8 1.1a2.2 2.2 0 1 0 1.2-4.2V8.8a2.2 2.2 0 0 0-1.2-3.7Z" fill="#2f9c95"/></svg></span>';
    var mutedIcon = '<span class="button-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10v4.4h2.5l3.5 3.1V6.5L9.5 9.6H7Zm10.4-1.6-1.5 1.5M16.9 13.9l1.5 1.5M16.9 10.3l1.5-1.5M15.4 12h2.5" stroke="#2f9c95" stroke-width="1.6" stroke-linecap="round"/><path d="M10.5 9.2v5.6" stroke="#2f9c95" stroke-width="1.6" stroke-linecap="round"/></svg></span>';
    musicBtn.innerHTML = (musicMuted ? mutedIcon : icon) + '<span>' + (musicMuted ? 'Reproducir música' : 'Silenciar música') + '</span>';
  }

  function openEnvelope() {
    if (opened) return;
    opened = true;
    envelope.classList.add('open');
    envelope.setAttribute('aria-label', 'Carta abierta');
    toLine.textContent = 'Para Majo';

    setTimeout(function () {
      introBlock.style.display = 'none';
      envelope.classList.add('done');
      cardView.classList.add('show');
      launchConfetti(220);
      playMananitas();
    }, 950);
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });

  replayBtn.addEventListener('click', function () {
    launchConfetti(180);
  });

  musicBtn.addEventListener('click', function () {
    musicMuted = !musicMuted;
    setMusicButtonLabel();

    if (musicMuted) {
      audioEl.pause();
    } else {
      playMananitas();
    }
  });

  setMusicButtonLabel();

  var canvas = document.getElementById('confetti-canvas');
  var ctx = canvas.getContext('2d');
  var particles = [];
  var confettiColors = ['#e85d75', '#e8a33d', '#2f9c95', '#8b5fbf', '#f2c94c', '#fbf3e2'];
  var animId = null;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function makeParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 200,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.2,
      vy: 2 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 2.4,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.02,
      life: 0,
      maxLife: 420 + Math.random() * 200
    };
  }

  function launchConfetti(count) {
    if (prefersReducedMotion) return;
    for (var i = 0; i < count; i++) {
      particles.push(makeParticle());
    }
    if (!animId) {
      animId = requestAnimationFrame(tickConfetti);
    }
  }

  function tickConfetti() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.life++;
      p.sway += p.swaySpeed;
      p.x += p.vx + Math.sin(p.sway) * 1.2;
      p.y += p.vy;
      p.rot += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();

      if (p.y > window.innerHeight + 40 || p.life > p.maxLife) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      animId = requestAnimationFrame(tickConfetti);
    } else {
      animId = null;
    }
  }

  audioEl.loop = true;
  audioEl.autoplay = true;
  audioEl.muted = false;

  function playMananitas() {
    if (musicMuted || !audioEl) return;
    audioEl.volume = 0.75;
    audioEl.muted = false;

    if (audioEl.paused) {
      audioEl.currentTime = 0;
    }

    var playPromise = audioEl.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {
        setTimeout(function () {
          if (!musicMuted && audioEl) {
            audioEl.play();
          }
        }, 300);
      });
    }
  }
})();
