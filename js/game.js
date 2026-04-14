import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── 카카오 앱 키 (https://developers.kakao.com 에서 발급 후 교체) ──
const KAKAO_APP_KEY = 'YOUR_KAKAO_APP_KEY';
const MAX_LEVEL = 30;
const TIME_PER_LEVEL = 5;

// ── Firebase 초기화 ─────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBXlxdLJ4bdsVBSaxD5F9RIxudht1EPKhU",
  authDomain: "colorgame-a01e4.firebaseapp.com",
  projectId: "colorgame-a01e4",
  storageBucket: "colorgame-a01e4.firebasestorage.app",
  messagingSenderId: "173475441094",
  appId: "1:173475441094:web:69d940bd79d60edcfaeac7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── Firestore 순위 ──────────────────────────────────────────────────
const Rank = {
  COLLECTION: 'rankings',

  async save(nickname, score, levelReached) {
    await addDoc(collection(db, this.COLLECTION), {
      nickname: nickname.trim() || '익명',
      score,
      levelReached,
      date: serverTimestamp(),
    });
  },

  async render() {
    const tbody = document.getElementById('rank-body');
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#9ca3af;padding:1.5rem;">불러오는 중…</td></tr>';
    try {
      const q = query(
        collection(db, this.COLLECTION),
        orderBy('score', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#9ca3af;padding:1.5rem;">아직 기록이 없습니다</td></tr>';
        return;
      }
      tbody.innerHTML = snapshot.docs.map((doc, i) => {
        const r = doc.data();
        return `
          <tr>
            <td class="rank-cell rank-num">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
            <td class="rank-cell">${escapeHtml(r.nickname)}</td>
            <td class="rank-cell rank-score">${r.score.toLocaleString()}</td>
            <td class="rank-cell rank-level">Lv.${r.levelReached}</td>
          </tr>`;
      }).join('');
    } catch (e) {
      console.error('순위 로드 실패:', e);
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#f87171;padding:1.5rem;">순위를 불러올 수 없습니다</td></tr>';
    }
  },
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
      text: `🎨 Color Game ${level}레벨 완료!\n최종 점수: ${score.toLocaleString()}점\n색깔 차이를 얼마나 잘 구별할 수 있을까요?`,
      link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
    });
  } else {
    const text = `🎨 Color Game ${level}레벨 완료! 점수: ${score.toLocaleString()}점\n${pageUrl}`;
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

  // 레벨이 높을수록 색 차이가 작아짐 (20 → 5)
  function getDelta(level) {
    return Math.max(5, Math.round(20 - (level - 1) * (17 / (MAX_LEVEL - 1))));
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
    const timerEl = document.getElementById('hud-timer');
    timerEl.textContent = state.timeLeft;
    timerEl.classList.toggle('danger', state.timeLeft <= 3);

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

    document.getElementById('result-title').textContent = completed ? '🎉 CLEAR!' : '⏰ TIME OVER';
    document.getElementById('result-desc').textContent = completed
      ? `${MAX_LEVEL}레벨을 모두 완료했습니다!`
      : `${state.level}레벨에서 멈췄어요! 다시 도전해볼까요?`;
    document.getElementById('result-score').textContent = state.score.toLocaleString();
    document.getElementById('result-level').textContent = state.level;

    // 완료 시에만 닉네임 저장 UI 표시
    const saveSection = document.getElementById('save-section');
    saveSection.classList.toggle('hidden', !completed);
    document.getElementById('result-saved-msg').classList.add('hidden');

    // 저장 버튼 초기화 (재시작 후 다시 클리어 시 재사용 가능하도록)
    const btn = document.getElementById('btn-save-score');
    btn.disabled = false;
    btn.textContent = '저장';
    document.getElementById('nickname-input').disabled = false;
    document.getElementById('nickname-input').value = '';
    document.getElementById('result-save-guide').classList.remove('hidden');

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

  async function showRank() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('rank-screen').classList.remove('hidden');
    await Rank.render();
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
    document.getElementById('btn-save-score').addEventListener('click', async () => {
      const nickname = document.getElementById('nickname-input').value.trim();
      if (!nickname) {
        document.getElementById('nickname-input').focus();
        return;
      }
      const btn = document.getElementById('btn-save-score');
      btn.disabled = true;
      btn.textContent = '저장 중…';
      try {
        await Rank.save(nickname, state.score, state.level);
        btn.textContent = '저장됨';
        document.getElementById('nickname-input').disabled = true;
        document.getElementById('result-saved-msg').classList.remove('hidden');
        document.getElementById('result-save-guide').classList.add('hidden');
      } catch (e) {
        console.error('저장 실패:', e);
        btn.disabled = false;
        btn.textContent = '저장';
        alert('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    });

    initKakao();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Game.init);
