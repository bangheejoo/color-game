# 프로젝트: 컬러게임

## 목적
하나의 다른 컬러타일을 빠르게 찾아내는 게임

## 기술 스택
- 프론트엔드: HTML, CSS, JavaScript + Tailwind CSS
- 배포: GitHub Pages
- 데이터베이스: firebase

## firebase 정보보
const firebaseConfig = {
  apiKey: "AIzaSyBXlxdLJ4bdsVBSaxD5F9RIxudht1EPKhU",
  authDomain: "colorgame-a01e4.firebaseapp.com",
  projectId: "colorgame-a01e4",
  storageBucket: "colorgame-a01e4.firebasestorage.app",
  messagingSenderId: "173475441094",
  appId: "1:173475441094:web:69d940bd79d60edcfaeac7"
};

## 핵심 규칙
- 3x3 타일 형태로 총 9개의 컬러타일이 표시
- 그중에 하나만 미세하게 컬러가 다름
- 다른 컬러타일을 찾아 클릭하면 다음 레벨로 이동
- 타일 개수는 3x3으로 시작하여 최대 6x6까지 늘어남 
- 각 레벨마다 제한시간은 5초
- 최종 30레벨까지 있고 끝나면 점수 계산
- 완료 화면에서 닉네임이랑 점수 저장 가능
- 저장된 기록으로 순위 표시
- 완료 화면에서 링크/카카오톡 공유 가능

## 구조
├── index.html
├── css/
└── js/