# 🐈 Librarian Cat — 고양이 북클럽

책 한 권마다 고양이 한 마리. 함께 읽고, 발제하고, 고양이 마을을 키우는 북클럽 웹앱.

## 기능

| 기능 | 설명 |
| --- | --- |
| 📖 책 등록 | 제목·저자·출판사·출판년도·쪽수·ISBN·표지·소개. Google Books 검색으로 자동 채우기 |
| 🐱 고양이 꾸미기 | 책마다 고양이 1마리: 이름, 털색 9종, 무늬 6종, 눈 색 5종, 소품 7종(중복 가능) |
| 📝 발제 / 토론 기록 | 책마다 발제·토론 기록 탭, 모임 날짜, 댓글 |
| 📈 독서 진도 | 쪽수 또는 %로 기록, 함께 읽는 사람들의 진도 표시 |
| 🎁 진도별 상호작용 | 0% 잠자기 → 25% 쓰다듬기 → 50% 간식 주기 → 75% 털실 놀이 → 100% 왕관 + 책 이야기(발제 내용을 고양이가 들려줌) |
| 🏡 2.5D 고양이 마을 | 50% 읽으면 아기 고양이, 100% 읽으면 왕관 고양이가 이사 옴. 완독 수에 따라 벤치·꽃밭·분수·캣타워·집·책방·등대 해금. 북클럽 마을 / 내 마을 전환, 밤에는 밤 하늘 |
| 👥 Google 로그인 | Firebase Auth. 로그인한 사람은 누구나 열람·작성, 수정·삭제는 작성자만 |

## 바로 써보기 (데모 모드)

빌드 과정이 없는 정적 사이트입니다. Firebase 설정 전에는 이 브라우저에만 저장되는 데모 모드로 동작합니다.

```bash
python3 -m http.server 8000
# http://localhost:8000 접속
```

> ES 모듈을 쓰기 때문에 `index.html`을 파일로 직접 열면 동작하지 않습니다. 반드시 로컬 서버로 여세요.

## Firebase 연결 (여러 사람이 같이 쓰기)

1. [Firebase 콘솔](https://console.firebase.google.com)에서 프로젝트 생성
2. **Authentication → 로그인 방법 → Google** 사용 설정
3. **Firestore Database** 생성 (프로덕션 모드)
4. **프로젝트 설정 → 내 앱 → 웹 앱 추가** 후 표시되는 `firebaseConfig` 값을 `js/firebase-config.js`에 붙여넣기
5. 보안 규칙과 호스팅 배포:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add          # 만든 프로젝트 선택
   firebase deploy             # firestore.rules + 호스팅 배포
   ```
6. 다른 도메인(GitHub Pages 등)에 올린다면 **Authentication → 설정 → 승인된 도메인**에 해당 도메인을 추가하세요.

### 북클럽 멤버만 허용하기

기본 규칙은 Google 로그인한 누구나 열람/작성할 수 있습니다. 멤버만 허용하려면 `firestore.rules`의 `signedIn()`을 이메일 목록으로 바꾸세요 (파일 안에 예시가 있습니다).

## 구조

```
index.html
css/style.css
js/
  app.js              라우팅(#/, #/new, #/book/:id, #/book/:id/edit, #/village), 로그인 화면
  backend.js          Firestore / localStorage 데모 저장소 + 도메인 API
  firebase-config.js  Firebase 설정
  cat.js              고양이 SVG 렌더러 (털색·무늬·눈·소품·표정·왕관)
  village.js          아이소메트릭 마을 캔버스 엔진 (건물, 고양이 이동, 클릭)
  util.js             공통 유틸
  views/              서재, 책 폼, 책 상세, 마을 화면
firestore.rules       보안 규칙
firebase.json         Firebase 호스팅/규칙 설정
```

### 데이터 모델 (Firestore)

```
books/{bookId}                          책 정보 + cat{name,fur,pattern,eyes,accessories} + createdBy
books/{bookId}/progress/{uid}           독서 진도 {percent, page, name, photo}
books/{bookId}/notes/{noteId}           발제/토론 {type: presentation|discussion, title, content, meetingDate, author}
books/{bookId}/notes/{noteId}/comments  댓글
```
