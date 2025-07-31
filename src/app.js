/* ============================================================================
   Main entry point
   ----------------------------------------------------------------------------
   ▸ Загружает palettes.json
   ▸ Генерирует палетки (title + text) с адаптивной шириной и случайным цветом
   ▸ Управляет fade-анимацией палеток через IntersectionObserver
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
     observeFade(container.querySelectorAll('.palette'));
   
   
     // запускаем анимированную сетку-водопад
     new Grid(document.getElementById('grid'));
   }
   
   /* --------------------------- Палетки ------------------------------------- */
   
   async function buildPalettes(root) {
     try {
       const res = await fetch(PALETTES_JSON_URL);
       if (!res.ok) throw new Error(`HTTP ${res.status}`);
       const json = await res.json();
   
       json.forEach((data, index) => root.appendChild(createPalette(data, index)));
     } catch (err) {
       console.error('Failed to load palettes:', err);
     }
   }
   
   function createPalette({ title, text }, index) {
     const el = document.createElement('article');
     el.className = 'palette';
   
           /* статичные цвета по индексу */
      if (index === 0) {
        el.classList.add('palette--dark');  // первая палетка - чёрная
      } else if (index === 1) {
        el.classList.add('palette--accent');  // вторая палетка - оранжевая
      } else if (index === 2) {
        el.classList.add('palette--dark');  // третья палетка - чёрная
      } else if (index === 3) {
        el.classList.add('palette--accent');  // четвёртая палетка - оранжевая
      } else if (index === 4) {
        el.classList.add('palette--dark');  // пятая палетка - чёрная
      } else if (index === 5) {
        el.classList.add('palette--dark');  // шестая палетка - чёрная
      } else if (index === 6) {
        el.classList.add('palette--dark');  // седьмая палетка - чёрная
      } else {
        el.classList.add(Math.random() < 0.5 ? 'palette--dark' : 'palette--accent');  // остальные случайно
      }
   
           /* статичные ширина и отступы по индексу */
      if (index === 0) {
        el.style.width = '60%';  // фиксированная ширина первой палетки
        el.style.marginLeft = '3cm';  // первая палетка - отступ 3 см
                  } else if (index === 1) {
        el.style.width = '65%';  // фиксированная ширина второй палетки (увеличена на 10%)
        el.style.marginLeft = '8cm';  // вторая палетка - отступ 8 см (7 + 1)
      } else if (index === 2) {
        el.style.width = '70%';  // фиксированная ширина третьей палетки
        el.style.marginLeft = '0';  // третья палетка - без отступа
      } else if (index === 3) {
        el.style.width = '75%';  // фиксированная ширина четвёртой палетки
        el.style.marginLeft = '5cm';  // четвёртая палетка - отступ 5 см
      } else if (index === 4) {
        el.style.width = '50%';  // фиксированная ширина пятой палетки (центрированная)
        el.style.marginLeft = 'auto';  // центрирование
        el.style.marginRight = 'auto';
      } else if (index === 5) {
        el.style.width = '80%';  // фиксированная ширина шестой палетки
        el.style.marginLeft = '0';  // шестая палетка - без отступа
      } else if (index === 6) {
        el.style.width = '85%';  // фиксированная ширина седьмой палетки
        el.style.marginLeft = '15%';  // седьмая палетка - отступ для выравнивания с правой гранью шапки
      } else {
        // остальные палетки получают адаптивную ширину и случайный отступ
        const totalChars = (title?.length || 0) + (text?.length || 0);
        const width = clamp(
          MIN_WIDTH + totalChars * CHAR_SCALE,
          MIN_WIDTH,
          MAX_WIDTH
        );
        el.style.width = `${width}%`;
        
        const maxOffset = 100 - width;
        const randomOffset = Math.random() * maxOffset;
        el.style.marginLeft = `${randomOffset}%`;
      }
   
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
        p.innerHTML = text.replace(/\n/g, '<br>');
        el.appendChild(p);
      }
      
      // центрирование заголовка для палетки без текста
      if (index === 4) {
        const titleEl = el.querySelector('.palette__title');
        if (titleEl) {
          titleEl.style.textAlign = 'center';
        }
      }
   
     return el;
   }
   
   function clamp(val, min, max) {
     return Math.min(max, Math.max(min, val));
   }
   
/* --------------------------- Fade animation ------------------------------ */

function observeFade(nodes) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const visible = entry.intersectionRatio >= 0.25;
          entry.target.classList.toggle('is-visible', visible);
        });
      },
      { threshold: [0, 0.25] }
    );
  
    nodes.forEach(n => io.observe(n));
  }
   