// Импортируем класс Grid, предполагая, что он находится рядом
// import Grid from './Grid.js';

// --- ДЛЯ ДЕМОНСТРАЦИИ: Класс Grid с пустыми методами, чтобы не было ошибок ---
// В реальном проекте здесь будет ваш полноценный класс Grid
class Grid {
    constructor() { console.log("Grid Initialized"); }
    startInitialDraw(startPoints, length = 300) {
        if (!startPoints || !startPoints.forEach) {
            console.error("Grid Error: startPoints is not a valid array.", startPoints);
            return;
        }
        console.log(`Grid: Drawing initial lines from ${startPoints.length} points.`);
        startPoints.forEach(p => {
            console.log(` -> Drawing from {x: ${p.x.toFixed(0)}, y: ${p.y.toFixed(0)}} down by ${length}px`);
        });
    }
}
// --- КОНЕЦ ДЕМО-КЛАССА ---

/**
 * Главный класс приложения, который управляет всем.
 */
class App {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error(`App Error: Container "${containerSelector}" not found.`);
            return;
        }

        this.grid = new Grid();
        this.init();
    }

    /**
     * Асинхронно загружает данные. В реальном проекте здесь будет fetch.
     * @returns {Promise<Object>} - Объект с данными для страницы.
     */
    async fetchData() {
        console.log("Fetching data...");
        // Имитация загрузки данных
        return {
            header: {
                name: "СПИ-саллухе",
                title: "ML Developer"
            },
            contacts: {
                telegram: "TELEGRAM",
                email: "email@example.com"
            },
            skills: {
                header: "SKILLS",
                body: "Lorem ipsum dolor sit amet, consectetur\nLorem ipsum dolor sit amet, consectetur"
            },
            experience: {
                header: "EXPERIENCE",
                body: "Lorem ipsum dolor sit amet, consectetur sit amet,\nLorem ipsum dolor sit amet"
            }
        };
    }

    /**
     * Заполняет DOM-элементы данными.
     * @param {Object} data - Данные, полученные от fetchData.
     */
    populateContent(data) {
        console.log("Populating content...");
        this.container.querySelectorAll('[data-content-key]').forEach(element => {
            const keyPath = element.dataset.contentKey;
            // Простое получение вложенного значения по ключу "obj.key"
            const value = keyPath.split('.').reduce((acc, key) => acc && acc[key], data);
            
            if (value) {
                // Заменяем переносы строк на теги <br> для HTML
                element.innerHTML = value.replace(/\n/g, '<br>');
            }
        });
    }

    /**
     * Инициализирует анимацию сетки.
     */
    initGridAnimation() {
        console.log("Initializing grid animation...");
        const headerElement = this.container.querySelector('.header');
        
        if (!headerElement) {
            console.error("Grid Init Error: .header element not found.");
            return;
        }

        const rect = headerElement.getBoundingClientRect();
        const scrollY = window.scrollY;

        // Вычисляем ТРИ стартовые точки на нижней границе хедера
        const startPoints = [
            { x: rect.left, y: rect.bottom + scrollY },
            { x: rect.left + rect.width / 2, y: rect.bottom + scrollY },
            { x: rect.right, y: rect.bottom + scrollY }
        ];
        
        // Передаем вычисленные точки в метод отрисовки сетки
        this.grid.startInitialDraw(startPoints);
    }

    /**
     * Главный метод инициализации приложения.
     */
    async init() {
        const data = await this.fetchData();
        this.populateContent(data);
        this.initGridAnimation();
        console.log("Application initialized successfully.");
    }
}

// Запускаем приложение
new App('#app-container');