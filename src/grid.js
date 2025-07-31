/* ============================================================================
   Grid — анимированная фоновая сетка-«водопад»
   ----------------------------------------------------------------------------
   ▸ Рисует ровные вертикальные и горизонтальные линии
   ▸ «Уровень воды» (waterLevel) опускается сверху вниз,
     заливая горизонтали акцентным цветом
   ▸ Цикл повторяется каждые WATERFALL_DURATION мс
   ========================================================================== */

   export default class Grid {
    /* --------------------------- Конфигурация ------------------------------ */
  
    static LINE_GAP_X = 120;           // px — шаг вертикалей
    static LINE_GAP_Y = 60;            // px — шаг горизонталей
    static LINE_WIDTH = 1;             // px
    static COLOR_BASE = '#e0e0e0';
    static COLOR_ACCENT = '#ff6b00';
  
    static WATERFALL_DURATION = 8000;  // ms на полный «слив»
  
    /* --------------------------- Жизненный цикл ---------------------------- */
  
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
      if (!canvas) {
        throw new Error('Grid: canvas element is required');
      }
  
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.dpr = window.devicePixelRatio || 1;
  
      this._resize = this._resize.bind(this);
      this._loop = this._loop.bind(this);
  
      window.addEventListener('resize', this._resize);
      this._resize();         // подгоняем под окно
  
      this.startTime = performance.now();
      this.raf = requestAnimationFrame(this._loop);
    }
  
    /* --------------------------- Анимация ---------------------------------- */
  
    _loop(now) {
      this._draw(now);
      this.raf = requestAnimationFrame(this._loop);
    }
  
    _draw(now) {
      const { width, height } = this.canvas;
  
      // переводим в CSS-px, т.к. canvas.width/height уже умножены на dpr
      const cssW = width / this.dpr;
      const cssH = height / this.dpr;
  
      const ctx = this.ctx;
      ctx.clearRect(0, 0, cssW, cssH);
  
      /* вычисляем прогресс водопада 0 → 1 */
      const elapsed = (now - this.startTime) % Grid.WATERFALL_DURATION;
      const progress = elapsed / Grid.WATERFALL_DURATION;
  
      const waterLevel = cssH * progress; // y-координата текущего уровня
  
      ctx.lineWidth = Grid.LINE_WIDTH;
  
      /* --- Вертикальные линии (базовые) --- */
      ctx.strokeStyle = Grid.COLOR_BASE;
      for (
        let x = 0.5;
        x <= cssW;
        x += Grid.LINE_GAP_X
      ) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, cssH);
        ctx.stroke();
      }
  
      /* --- Горизонтальные линии --- */
      for (
        let y = 0.5;
        y <= cssH;
        y += Grid.LINE_GAP_Y
      ) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cssW, y);
  
        ctx.strokeStyle =
          y <= waterLevel ? Grid.COLOR_ACCENT : Grid.COLOR_BASE;
        ctx.stroke();
      }
    }
  
    /* --------------------------- Resize ------------------------------------ */
  
    _resize() {
      const { innerWidth: w, innerHeight: h } = window;
      this.canvas.width = Math.ceil(w * this.dpr);
      this.canvas.height = Math.ceil(h * this.dpr);
      this.canvas.style.width = `${w}px`;
      this.canvas.style.height = `${h}px`;
  
      this.ctx.scale(this.dpr, this.dpr);
    }
  
    /* --------------------------- Tear-down --------------------------------- */
    destroy() {
      cancelAnimationFrame(this.raf);
      window.removeEventListener('resize', this._resize);
    }
  }
  