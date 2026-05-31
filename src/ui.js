export class UI {
  constructor(game) {
    this.game = game;
    this.createOverlay();
  }

  createOverlay() {
    this.el = document.createElement('div');
    this.el.id = 'ui-overlay';
    this.el.innerHTML = `
      <div id="menu">
        <h1>Flappy Bird 3D</h1>
        <p>Press SPACE or Click to start</p>
        <p id="best-menu">Best: ${this.game.bestScore}</p>
      </div>
      <div id="score" style="display:none;font-size:48px;color:#fff;text-align:center;position:absolute;top:20px;left:0;right:0;">0</div>
      <div id="gameover" style="display:none;">
        <h1>Game Over</h1>
        <p id="score-final">Score: 0</p>
        <p id="best-final">Best: ${this.game.bestScore}</p>
        <p>Press SPACE to restart</p>
      </div>
      <div id="loading" style="display:flex;">
        <p>Loading assets...</p>
      </div>
    `;
    this.applyStyles();
    document.body.appendChild(this.el);

    this.menuEl = this.el.querySelector('#menu');
    this.scoreEl = this.el.querySelector('#score');
    this.gameoverEl = this.el.querySelector('#gameover');
    this.loadingEl = this.el.querySelector('#loading');
    this.scoreFinalEl = this.el.querySelector('#score-final');
    this.bestFinalEl = this.el.querySelector('#best-final');
    this.bestMenuEl = this.el.querySelector('#best-menu');
  }

  applyStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #ui-overlay { position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;font-family:Arial,sans-serif; }
      #ui-overlay > div { position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center; }
      #ui-overlay h1 { font-size:48px;color:#fff;text-shadow:2px 2px 4px rgba(0,0,0,0.5);margin-bottom:20px; }
      #ui-overlay p { font-size:18px;color:#fff;text-shadow:1px 1px 2px rgba(0,0,0,0.5);margin:5px 0; }
    `;
    document.head.appendChild(style);
  }

  showLoading() { this.loadingEl.style.display = 'flex'; }
  hideLoading() { this.loadingEl.style.display = 'none'; }

  showMenu() {
    this.menuEl.style.display = 'flex';
    this.scoreEl.style.display = 'none';
    this.gameoverEl.style.display = 'none';
    this.bestMenuEl.textContent = `Best: ${this.game.bestScore}`;
  }

  hideAll() {
    this.menuEl.style.display = 'none';
    this.scoreEl.style.display = 'block';
    this.gameoverEl.style.display = 'none';
  }

  updateScore(s) { this.scoreEl.textContent = String(s); }

  showGameOver(score, best) {
    this.menuEl.style.display = 'none';
    this.scoreEl.style.display = 'none';
    this.gameoverEl.style.display = 'flex';
    this.scoreFinalEl.textContent = `Score: ${score}`;
    this.bestFinalEl.textContent = `Best: ${best}`;
  }
}
