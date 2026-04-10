// ── 카카오 앱 키 (https://developers.kakao.com 에서 발급 후 교체) ──
const KAKAO_APP_KEY = 'YOUR_KAKAO_APP_KEY';
const MAX_LEVEL = 30;
const TIME_PER_LEVEL = 10;

// ── 로컬스토리지 순위 ───────────────────────────────────────────────
const Rank = {
  KEY: 'colorgame_ranks',

  load() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch { return []; }
  },

  save(nickname, score, levelReached) {
    const ranks = this.load();
    ranks.push({ nickname: nickname.trim() || '익명', score, levelReached, date: Date.now() });
    ranks.sort((a, b) => b.score - a.score);
    localStorage.setItem(this.KEY, JSON.stringify(ranks.slice(0, 20)));
  },

  render() {
    const ranks = this.load();
    const tbody = document.getElementById('rank-body');
    if (!ranks.length) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#9ca3af;padding:1.5rem;">아직 기록이 없습니다</td></tr>';
      return;
    }
    tbody.innerHTML = ranks.slice(0, 10).map((r, i) => `
      <tr>
        <td class="rank-cell rank-num">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
        <td class="rank-cell">${escapeHtml(r.nickname)}</td>
        <td class="rank-cell rank-score">${r.score.toLocaleString()}</td>
        <td class="rank-cell rank-level">Lv.${r.levelReached}</td>
      </tr>`).join('');
  },
};

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ── 카카오 초기화 ───────────────────────────────────────────────────
function initKakao() {
  if (window.Kakao && !Kakao.isInitialized() && KAKAO_APP_KEY !== 'YOUR_KAKAO_APP_KEY') {
    Kakao.init(KAKAO_APP_KEY);
  }
}

function kakaoShare(score, level) {
  const pageUrl = location.href.split('?')[0];
  if (window.Kakao && Kakao.isInitialized()) {
    Kakao.Share.sendDefault({
      objectType: 'text',
      text: `🎨 컬러게임 ${level}단계 완료!\n최종 점수: ${score.toLocaleString()}점\n색깔 차이를 얼마나 잘 구별할 수 있을까요?`,
      link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
    });
  } else {
    // fallback: 텍스트 복사
    const text = `🎨 컬러게임 ${level}단계 완료! 점수: ${score.toLocaleString()}점\n${pageUrl}`;
    navigator.clipboard?.writeText(text).then(() => alert('링크가 클립보드에 복사되었습니다!'));
  }
}

// ── 게임 핵심 ───────────────────────────────────────────────────────
const Game = (() => {
  const state = { level: 1, score: 0, timeLeft: TIME_PER_LEVEL, timerInterval: null };

  function getGridSize(level) {
    if (level <= 5)  return 3;
    if (level <= 10) return 4;
    if (level <= 15) return 5;
    return 6;
  }

  // 레벨이 높을수록 색 차이가 작아짐 (22 → 5)
  function getDelta(level) {
    return Math.max(5, Math.round(22 - (level - 1) * (17 / (MAX_LEVEL - 1))));
  }

  function randomBaseColor() {
    return {
      h: Math.floor(Math.random() * 360),
      s: 55 + Math.floor(Math.random() * 25),
      l: 45 + Math.floor(Math.random() * 20),
    };
  }

  function hsl({ h, s, l }) { return `hsl(${h},${s}%,${l}%)`; }

  function buildGrid() {
    const size = getGridSize(state.level);
    const base = randomBaseColor();
    const delta = getDelta(state.level);
    const total = size * size;
    const oddIndex = Math.floor(Math.random() * total);
    const oddColor = { ...base, l: Math.min(90, Math.max(10, base.l + delta)) };

    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.className = 'tile';
      btn.style.backgroundColor = i === oddIndex ? hsl(oddColor) : hsl(base);
      btn.addEventListener('click', () => onTileClick(i === oddIndex));
      grid.appendChild(btn);
    }
  }

  function onTileClick(isOdd) {
    if (isOdd) {
      clearInterval(state.timerInterval);
      state.score += state.timeLeft * 10;
      flashFeedback(true);
      setTimeout(() => {
        hideFeedback();
        if (state.level >= MAX_LEVEL) {
          showResult(true);
        } else {
          state.level++;
          nextLevel();
        }
      }, 500);
    } else {
      flashFeedback(false);
      setTimeout(hideFeedback, 400);
    }
  }

  function nextLevel() {
    state.timeLeft = TIME_PER_LEVEL;
    updateHUD();
    buildGrid();
    startTimer();
  }

  function startTimer() {
    clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
      state.timeLeft--;
      updateHUD();
      if (state.timeLeft <= 0) {
        clearInterval(state.timerInterval);
        showResult(false);
      }
    }, 1000);
  }

  function updateHUD() {
    document.getElementById('hud-level').textContent = `${state.level} / ${MAX_LEVEL}`;
    document.getElementById('hud-score').textContent = state.score.toLocaleString();
    document.getElementById('hud-timer').textContent = state.timeLeft;
    const timerEl = document.getElementById('hud-timer');
    timerEl.classList.toggle('danger', state.timeLeft <= 3);

    // 진행 바
    const pct = ((state.level - 1) / MAX_LEVEL) * 100;
    document.getElementById('progress-bar').style.width = pct + '%';
  }

  function flashFeedback(ok) {
    const fb = document.getElementById('feedback');
    fb.textContent = ok ? '✓' : '✗';
    fb.className = 'feedback show ' + (ok ? 'correct' : 'wrong');
  }

  function hideFeedback() {
    document.getElementById('feedback').className = 'feedback';
  }

  function showResult(completed) {
    document.getElementById('game-screen').classList.add('hidden');
    const screen = document.getElementById('result-screen');
    screen.classList.remove('hidden');

    document.getElementById('result-title').textContent = completed ? '🎉 클리어!' : '⏰ 시간 초과';
    document.getElementById('result-desc').textContent = completed
      ? `${MAX_LEVEL}단계를 모두 완료했습니다!`
      : `${state.level}단계에서 시간이 초과되었습니다.`;
    document.getElementById('result-score').textContent = state.score.toLocaleString();
    document.getElementById('result-level').textContent = state.level;

    // 완료 시에만 닉네임 저장 UI 표시
    document.getElementById('save-section').classList.toggle('hidden', !completed);
    document.getElementById('result-saved-msg').classList.add('hidden');

    // 카카오 공유는 항상
    document.getElementById('btn-kakao').onclick = () => kakaoShare(state.score, state.level);
  }

  function startGame() {
    state.level = 1;
    state.score = 0;
    state.timeLeft = TIME_PER_LEVEL;

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('rank-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('progress-bar').style.width = '0%';

    updateHUD();
    buildGrid();
    startTimer();
  }

  function init() {
    document.getElementById('btn-start').addEventListener('click', startGame);
    document.getElementById('btn-restart').addEventListener('click', startGame);
    document.getElementById('btn-to-rank-from-start').addEventListener('click', showRank);
    document.getElementById('btn-to-rank-from-result').addEventListener('click', showRank);
    document.getElementById('btn-rank-back').addEventListener('click', () => {
      document.getElementById('rank-screen').classList.add('hidden');
      document.getElementById('start-screen').classList.remove('hidden');
    });
    document.getElementById('btn-save-score').addEventListener('click', () => {
      const nickname = document.getElementById('nickname-input').value.trim() || '익명';
      Rank.save(nickname, state.score, state.level);
      document.getElementById('result-saved-msg').classList.remove('hidden');
      document.getElementById('save-section').classList.add('hidden');
    });

    initKakao();
  }

  function showRank() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('rank-screen').classList.remove('hidden');
    Rank.render();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Game.init);
