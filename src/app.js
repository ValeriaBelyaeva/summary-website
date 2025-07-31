/* ============================================================================
   Main entry point
   ----------------------------------------------------------------------------
   ▸ Загружает palettes.json
   ▸ Генерирует палетки (title + text) с адаптивной шириной и случайным цветом
   ▸ Добавляет fade-in через IntersectionObserver
   ▸ Инициализирует анимированную сетку (Grid)
   ========================================================================== */

   import Grid from './grid.js';

   /* --------------------------- Константы ----------------------------------- */
   
   const PALETTES_JSON_URL = './palettes.json';
   const CONTAINER_ID = 'palettes';
   
   const MIN_WIDTH = 40;   // % — минимальная ширина палетки
   const MAX_WIDTH = 80;   // % — максимальная ширина палетки
   const CHAR_SCALE = 0.25; // сколько «% ширины» даём за каждый символ текста
   
   /* --------------------------- Инициализация -------------------------------- */
   
   document.addEventListener('DOMContentLoaded', init);
   
   async function init() {
     const container = document.getElementById(CONTAINER_ID);
     if (!container) return console.error(`Container #${CONTAINER_ID} not found`);
   
     await buildPalettes(container);
     observeFadeIn(container.querySelectorAll('.palette'));
   
     // запускаем анимированную сетку-водопад
     new Grid(document.getElementById('grid'));
   }
   
   /* --------------------------- Палетки ------------------------------------- */
   
   async function buildPalettes(root) {
     try {
       const res = await fetch(PALETTES_JSON_URL);
       if (!res.ok) throw new Error(`HTTP ${res.status}`);
       const json = await res.json();
   
       json.forEach(data => root.appendChild(createPalette(data)));
     } catch (err) {
       console.error('Failed to load palettes:', err);
     }
   }
   
   function createPalette({ title, text }) {
     const el = document.createElement('article');
     el.className = 'palette';
   
     /* случайный вариант цвета */
     el.classList.add(Math.random() < 0.5 ? 'palette--dark' : 'palette--accent');
   
     /* ширина ~ объёму текста, но в рамках MIN–MAX */
     const totalChars = (title?.length || 0) + (text?.length || 0);
     const width = clamp(
       MIN_WIDTH + totalChars * CHAR_SCALE,
       MIN_WIDTH,
       MAX_WIDTH
     );
     el.style.width = `${width}%`;

     /* случайный правый отступ в пределах свободного пространства */
     const free = 100 - width;  // % свободного места в контейнере
     el.style.marginRight = `${Math.random() * free}%`;
   
     /* наполнение */
     if (title) {
       const h3 = document.createElement('h3');
       h3.className = 'palette__title';
       h3.textContent = title;
       el.appendChild(h3);
     }
   
     if (text) {
       const p = document.createElement('p');
       p.className = 'palette__text';
       p.textContent = text;
       el.appendChild(p);
     }
   
     return el;
   }
   
   function clamp(val, min, max) {
     return Math.min(max, Math.max(min, val));
   }
   
   /* --------------------------- Fade-in ------------------------------------- */
   
   function observeFadeIn(nodes) {
     const io = new IntersectionObserver(
       entries => {
         entries.forEach(entry => {
           if (entry.isIntersecting) {
             entry.target.classList.add('is-visible');
             io.unobserve(entry.target);
           }
         });
       },
       { threshold: 0.1 }
     );
   
     nodes.forEach(n => io.observe(n));
   }
   