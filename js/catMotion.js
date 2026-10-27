// 고양이 모션: 부위별 이미지를 매 프레임 회전·이동시켜 조합하고, 상태 머신으로 동작을 고릅니다.
//  - 정면 앉기: 숨쉬기, 꼬리 살랑, 눈 깜빡, 귀 쫑긋
//  - 옆모습: 네 다리 번갈아 걷기, 기지개, 식빵 자세로 잠
//  - 반응: 쓰다듬기(골골·꼬리 세움), 간식(고개 숙여 냠냠), 털실(웅크렸다 점프·착지), 책 이야기(갸웃)
import { catPartSprite, pawOffset } from './cat.js';

const rnd = (a, b) => a + Math.random() * (b - a);
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const smooth = (x) => { const v = clamp01(x); return v * v * (3 - 2 * v); };
// 0→1 로 올라갔다 유지했다 내려오는 곡선 (edge = 오르내리는 구간 비율)
const plateau = (p, edge = 0.2) => smooth(p / edge) * smooth((1 - p) / edge);

const REACTIONS = ['pet', 'treat', 'play', 'talk'];
const PARTS = ['front-back', 'front-tail', 'front-body', 'front-pawL', 'front-pawR', 'front-held', 'side-tail', 'side-body', 'leg-near', 'leg-far'];
const MOODS = ['normal', 'blink', 'happy', 'love', 'surprised', 'sleepy'];
const IDLE_ACTIONS = ['groom', 'stretch', 'sleep'];

// 정면 좌표(200×200, 발끝 y≈192) 기준 관절 위치
const HEAD_PIVOT = [100, 128];
const FRONT_TAIL_PIVOT = [136, 168];
const SIDE = { neck: [140, 124], tail: [46, 134], body: [96, 140], legs: { backFar: [80, 148], frontFar: [130, 148], backNear: [68, 150], frontNear: [118, 150] } };

function drawImg(ctx, sprite, x = 0, y = 0, w = 200, h = 200) {
  if (sprite.ready) ctx.drawImage(sprite.canvas, x, y, w, h);
}

// (px,py)를 중심으로 이동·회전·확대한 상태에서 fn 실행
function around(ctx, px, py, { dx = 0, dy = 0, rot = 0, sx = 1, sy = 1 } = {}, fn) {
  ctx.save();
  ctx.translate(px + dx, py + dy);
  if (rot) ctx.rotate((rot * Math.PI) / 180);
  if (sx !== 1 || sy !== 1) ctx.scale(sx, sy);
  ctx.translate(-px, -py);
  fn();
  ctx.restore();
}

export class CatActor {
  /**
   * @param {object} cat 고양이 꾸미기 데이터
   * @param {{ crown?: boolean, baseMood?: 'normal'|'sleepy', canSleep?: boolean, res?: number }} opts
   *   res: 부위 비트맵 해상도 (200단위당 px). 화면에 그릴 크기 × 기기 배율 정도면 충분
   */
  constructor(cat, { crown = false, baseMood = 'normal', canSleep = true, res = 128 } = {}) {
    this.cat = cat;
    this.res = res;
    this.crown = crown;
    this.baseMood = baseMood;
    this.canSleep = canSleep;
    this.paw = pawOffset(cat);
    this.time = 0;
    this.state = 'sit';
    this.t0 = 0;
    this.dur = 0;
    this.speed = 0;
    this.walkPhase = 0;
    this.seed = Math.random() * 10;
    this.idleLeft = rnd(3000, 7000);
    this.blinkAt = rnd(800, 3000);
    this.blinkUntil = 0;
    this.twitchAt = rnd(2000, 6000);
    this.twitchT = -1e9;
    // 표정이 바뀌는 순간 빈 프레임이 없도록 모든 부위·표정을 미리 불러둠
    PARTS.forEach((part) => this.img(part));
    MOODS.forEach((mood) => this.img('head', mood));
  }

  img(part, mood = 'normal') {
    return catPartSprite(this.cat, part, { mood, crown: part === 'head' && this.crown }, this.res);
  }

  set crown(v) {
    this._crown = v;
    if (v && this.time !== undefined) MOODS.forEach((mood) => this.img('head', mood));
  }

  get crown() {
    return this._crown;
  }

  setState(state, dur = 0) {
    this.state = state;
    this.t0 = this.time;
    this.dur = dur;
  }

  get reacting() {
    return REACTIONS.includes(this.state) && this.time - this.t0 < this.dur;
  }

  get asleep() {
    return this.state === 'sleep';
  }

  /** 이동 여부를 매 프레임 알려줌. 움직이면 하던 일(잠·그루밍 등)을 멈추고 걷기 */
  setMotion(moving, speed = 1) {
    this.speed = speed;
    if (this.reacting) return;
    if (moving && this.state !== 'walk') this.setState('walk');
    else if (!moving && this.state === 'walk') {
      this.setState('sit');
      this.idleLeft = rnd(2500, 6000);
    }
  }

  /** 상호작용 반응: id = pet | treat | play | talk */
  react(id, ms) {
    this.setState(id, ms);
  }

  update(dt) {
    this.time += dt;
    const el = this.time - this.t0;
    if (this.state === 'walk') this.walkPhase += (dt / 1000) * (5 + this.speed * 6);
    if ((REACTIONS.includes(this.state) || IDLE_ACTIONS.includes(this.state)) && el > this.dur) {
      this.setState('sit');
      this.idleLeft = rnd(3000, 8000);
    }
    if (this.state === 'sit') {
      this.idleLeft -= dt;
      if (this.idleLeft <= 0) this.pickIdle();
    }
    if (this.time > this.blinkAt) {
      this.blinkUntil = this.time + 140;
      this.blinkAt = this.time + rnd(2200, 5500);
    }
    if (this.time > this.twitchAt) {
      this.twitchT = this.time;
      this.twitchAt = this.time + rnd(3000, 9000);
    }
  }

  pickIdle() {
    const r = Math.random();
    const sleepChance = this.baseMood === 'sleepy' ? 0.6 : 0.25;
    if (this.canSleep && r < sleepChance) this.setState('sleep', rnd(6000, 14000));
    else if (r < sleepChance + (1 - sleepChance) / 2) this.setState('groom', 2600);
    else this.setState('stretch', 2000);
  }

  // 현재 상태에서의 자세 계산
  pose() {
    const t = this.time;
    const el = this.time - this.t0;
    const p = this.dur ? clamp01(el / this.dur) : 0;
    const blink = t < this.blinkUntil;
    const tw = t - this.twitchT;
    const twitch = tw < 400 ? 4 * Math.exp(-tw / 120) * Math.sin(tw / 22) : 0;
    const P = {
      view: 'front', lift: 0, sx: 1, sy: 1, breath: 1 + 0.018 * Math.sin(t / 650 + this.seed),
      tailRot: 8 * Math.sin(t / 520 + this.seed), headDx: 0, headDy: 0, headRot: twitch,
      pawL: {}, pawR: {}, mood: blink ? 'blink' : this.baseMood,
      legs: { backFar: 0, frontFar: 0, backNear: 0, frontNear: 0 }, showLegs: true, bodyDy: 0, bodyRot: 0, zzz: false,
    };

    switch (this.state) {
      case 'walk': {
        const ph = this.walkPhase;
        const a = 26 * Math.sin(ph);
        Object.assign(P, {
          view: 'side', lift: -2.5 * Math.abs(Math.sin(ph)), headDy: 1.5 * Math.sin(ph * 2),
          tailRot: -6 + 10 * Math.sin(ph * 0.5), mood: blink ? 'blink' : 'normal',
          legs: { frontNear: a, backFar: a, frontFar: -a, backNear: -a },
        });
        break;
      }
      case 'sleep': {
        const k = smooth(el / 600); // 천천히 엎드림
        Object.assign(P, {
          view: 'side', showLegs: k < 0.5, bodyDy: 16 * k, tailRot: -70 * k, headDy: 20 * k, headDx: -4 * k, headRot: 8 * k,
          breath: 1 + 0.035 * Math.sin(t / 900), mood: 'sleepy', zzz: k > 0.9,
        });
        break;
      }
      case 'stretch': {
        const k = plateau(p, 0.3);
        Object.assign(P, {
          view: 'side', bodyRot: 10 * k, headDy: 22 * k, headDx: 10 * k, headRot: 6 * k, tailRot: -24 * k,
          legs: { frontNear: -55 * k, frontFar: -48 * k, backNear: 8 * k, backFar: 8 * k },
          mood: k > 0.5 ? 'happy' : P.mood,
        });
        break;
      }
      case 'groom': {
        const k = plateau(p, 0.2);
        const lick = k > 0.6 ? 3 * Math.sin(t / 70) : 0;
        Object.assign(P, {
          pawR: { dx: -18 * k, dy: -66 * k, rot: -40 * k }, headRot: 10 * k + lick, headDy: 4 * k,
          mood: k > 0.5 ? 'happy' : P.mood,
        });
        break;
      }
      case 'pet':
        Object.assign(P, {
          mood: 'happy', tailRot: -20 + 4 * Math.sin(t / 200), headRot: 6 * Math.sin(t / 140),
          headDx: 0.8 * Math.sin(t / 18), breath: 1 + 0.03 * Math.sin(t / 60),
        });
        break;
      case 'treat':
        Object.assign(P, { mood: 'love', headDy: 10 + 3.5 * Math.abs(Math.sin(t / 80)), tailRot: -10 + 6 * Math.sin(t / 150) });
        break;
      case 'play': {
        if (p < 0.25) { // 웅크리기 (예비 동작)
          const c = smooth(p / 0.25);
          Object.assign(P, { sy: 1 - 0.14 * c, sx: 1 + 0.08 * c, headDy: 6 * c, tailRot: 20 * c * Math.sin(t / 40), mood: 'surprised' });
        } else if (p < 0.7) { // 점프
          const q = (p - 0.25) / 0.45;
          Object.assign(P, {
            lift: -70 * Math.sin(Math.PI * q), sy: 1.08, sx: 0.95, mood: 'surprised', tailRot: -25,
            pawL: { dy: -34, rot: 30 }, pawR: { dy: -34, rot: -30 },
          });
        } else if (p < 0.85) { // 착지 찌그러짐
          const r = Math.sin(Math.PI * (p - 0.7) / 0.15);
          Object.assign(P, { sy: 1 - 0.12 * r, sx: 1 + 0.08 * r, mood: 'happy' });
        } else P.mood = 'happy';
        break;
      }
      case 'talk':
        Object.assign(P, { mood: 'happy', headRot: 10 * Math.sin(t / 350), headDy: 2 * Math.sin(t / 175), tailRot: 6 * Math.sin(t / 700) });
        break;
    }
    return P;
  }

  /** 이미지가 모두 준비됐는지 (처음 몇 프레임은 로딩 중일 수 있음) */
  ready() {
    return ['front-tail', 'front-body', 'side-body'].every((part) => this.img(part).ready);
  }

  /**
   * (x, y) = 발끝 위치, size = 그림 한 변 크기(px)
   */
  draw(ctx, x, y, size, flip = false) {
    const P = this.pose();
    const k = size / 200;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flip ? -k : k, k);
    ctx.translate(-100, -192);
    around(ctx, 100, 192, { dy: P.lift, sx: P.sx, sy: P.sy }, () => (P.view === 'side' ? this.drawSide(ctx, P) : this.drawFront(ctx, P)));
    ctx.restore();
    if (P.zzz) this.drawZzz(ctx, x + (flip ? -1 : 1) * size * 0.3, y - size * 0.55, size);
  }

  drawFront(ctx, P) {
    const [hx, hy] = HEAD_PIVOT;
    const head = () => around(ctx, hx, hy, { dx: P.headDx, dy: P.headDy, rot: P.headRot }, () => drawImg(ctx, this.img('head', P.mood), 30, 0, 140, 140));
    const paw = (side, T) => around(ctx, 100 + side * this.paw, 184, T, () => drawImg(ctx, this.img(side < 0 ? 'front-pawL' : 'front-pawR')));
    const raised = (T) => (T.dy || 0) < -20; // 높이 든 앞발은 얼굴 앞에 그림

    drawImg(ctx, this.img('front-back'));
    around(ctx, ...FRONT_TAIL_PIVOT, { rot: P.tailRot }, () => drawImg(ctx, this.img('front-tail')));
    around(ctx, 100, 188, { sy: P.breath }, () => drawImg(ctx, this.img('front-body')));
    if (!raised(P.pawL)) paw(-1, P.pawL);
    if (!raised(P.pawR)) paw(1, P.pawR);
    drawImg(ctx, this.img('front-held'));
    head();
    if (raised(P.pawL)) paw(-1, P.pawL);
    if (raised(P.pawR)) paw(1, P.pawR);
  }

  drawSide(ctx, P) {
    const leg = (name, far) => {
      const [px, py] = SIDE.legs[name];
      around(ctx, px, py + P.bodyDy, { rot: P.legs[name] || 0 }, () => drawImg(ctx, this.img(far ? 'leg-far' : 'leg-near'), px - 16, py + P.bodyDy - 10, 32, 56));
    };
    if (P.showLegs) { leg('backFar', true); leg('frontFar', true); }
    around(ctx, SIDE.tail[0], SIDE.tail[1] + P.bodyDy, { rot: P.tailRot }, () => {
      ctx.translate(0, P.bodyDy);
      drawImg(ctx, this.img('side-tail'));
    });
    around(ctx, ...SIDE.body, { dy: P.bodyDy, rot: P.bodyRot, sy: P.breath }, () => drawImg(ctx, this.img('side-body')));
    if (P.showLegs) { leg('backNear', false); leg('frontNear', false); }
    const [nx, ny] = SIDE.neck;
    ctx.save();
    ctx.translate(nx + P.headDx, ny + P.headDy + P.bodyDy);
    ctx.rotate((P.headRot * Math.PI) / 180);
    ctx.scale(0.78, 0.78);
    ctx.translate(-HEAD_PIVOT[0], -HEAD_PIVOT[1]);
    drawImg(ctx, this.img('head', P.mood), 30, 0, 140, 140);
    ctx.restore();
  }

  drawZzz(ctx, x, y, size) {
    const t = this.time / 1000;
    ctx.save();
    ctx.fillStyle = '#5A6B9E';
    ctx.textAlign = 'center';
    for (let k = 0; k < 3; k++) {
      const ph = (t * 0.6 + k / 3) % 1;
      ctx.globalAlpha = Math.sin(Math.PI * ph);
      ctx.font = `bold ${Math.round(size * (0.12 + 0.06 * k))}px sans-serif`;
      ctx.fillText('z', x + ph * size * 0.15 + k * size * 0.06, y - ph * size * 0.35);
    }
    ctx.restore();
  }
}
