# 프로젝트: 컬러게임

## 목적
하나의 다른 컬러타일을 빠르게 찾아내는 게임

## 기술 스택
- 프론트엔드: React, TypeScript, Tailwind CSS
- 배포: GitHub Pages
- 데이터베이스: firebase

## firebase 정보
const firebaseConfig = {
  apiKey: "AIzaSyBXlxdLJ4bdsVBSaxD5F9RIxudht1EPKhU",
  authDomain: "colorgame-a01e4.firebaseapp.com",
  projectId: "colorgame-a01e4",
  storageBucket: "colorgame-a01e4.firebasestorage.app",
  messagingSenderId: "173475441094",
  appId: "1:173475441094:web:69d940bd79d60edcfaeac7"
};

## 핵심 규칙
- 기본적으로 3x3 타일 형태로 컬러타일이 표시
- 그중에 한 타일이 미세하게 컬러가 다름
- 다른 컬러의 타일을 찾아 클릭하면 다음 레벨로 이동
- 타일 개수는 3x3으로 시작하여 최대 7x7까지 늘어남 
- 각 레벨마다 제한시간은 5초이며 레벨이 올라갈수록 난이도 어려워짐짐
- 게임 시작과 종료 시점에서 적당한 애니메이션
- 점수 계산
  : 기본 점수 = 남은 시간 * 100
  : 콤보 보너스 = 기본 점수 * (콤보 * 0.2)
- 연속으로 맞추게 되면 콤보 
  : 콤보 효과/애니메이션 나타나면서 콤보 보너스 점수로 계산
  : 틀리면 화면 흔들리는 효과/애니메이션 나타나면서 콤보 초기화
- 최종 45레벨까지 존재
- 한번도 틀리지 않고 완료했다면 퍼펙트 효과/애니메이션 및 보너스 점수 플러스 및 순위표에도 뱃지로 표시
- 완료 화면에서 닉네임 입력 후 점수 저장 가능
- 저장된 기록으로 순위 표시
- 순위표는 2종류
  : 오늘의 순위 (날짜별)
  : 최고의 콤보 (콤보갯수)
- 공유기능
  : 완료화면에서 점수정보와 링크 공유 가능
  : 순위표화면에서 점수/순위정보와 링크 공유 가능
  : 공유메세지 예시는 아래와 같은 식
    "나는 컬러게임에서 4,820점!
    최고 콤보 18 🔥
    너는 어디까지 갈 수 있어?
    링크"

## 구조
├── index.html
└── src/
    ├── components/
    ├── pages/
    ├── hooks/
    ├── styles/
    └── utils/