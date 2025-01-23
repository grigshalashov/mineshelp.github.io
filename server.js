const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Указываем папку для статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Обработка корневого маршрута
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработка подключения клиента
io.on('connection', (socket) => {
    console.log('Новый клиент подключен');

    // Обработка события генерации мин
    socket.on('generateMines', (mineCount) => {
        const mines = generateMines(5, 5, mineCount); // Генерируем мины для 5x5
        socket.emit('minesGenerated', mines); // Отправляем сгенерированные мины клиенту
    });

    // Обработка отключения клиента
    socket.on('disconnect', () => {
        console.log('Клиент отключен');
    });
});

// Функция для генерации мин
function generateMines(rows, cols, mineCount) {
    const mines = Array.from({ length: rows }, () => Array(cols).fill(false));
    let placedMines = 0;

    while (placedMines < mineCount) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!mines[r][c]) {
            mines[r][c] = true; // Устанавливаем мину
            placedMines++;
        }
    }
    return mines;
}

// Запуск сервера
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Сервер запущен на http://127.0.0.1:${PORT}`));
