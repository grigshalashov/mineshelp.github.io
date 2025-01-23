<!DOCTYPE html>
<html lang="ru">
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Rubik+Mono+One&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MinesHelper</title>
    <style>

        span{
            font-family: 'Rubik', sans-serif;
        }
        h1 {
            font-family: 'Rubik', sans-serif;
            font-size: 40px;
            font-weight: bold;
            color: cornflowerblue;
        }
        label{
            font-family: 'Rubik', sans-serif;
            font-size: 20px;
        }
        button{
            font-family: 'Rubik', sans-serif;
            font-size: 20px;
            border-radius: 10px;
            border-style: solid;
        }
        body {
            font-family: "RubikOne", sans-serif;
            text-align: center;
            background-color: azure;
        }
        table {
            margin: 20px auto;
            border-collapse: separate;
            border-spacing: 5px;
            border-radius: 7px; /* Скругление краев таблицы */
            background: rgb(2,0,36);
            background: linear-gradient(35deg, rgba(2,0,36,1) 0%, rgba(94,42,115,1) 35%, rgba(59,120,248,1) 100%);
            overflow: hidden; /* Убираем выступающие края */
        }

        td {
            width: 40px;
            height: 40px;
            background-color: #f0f0f0;
            cursor: pointer;
            transition: background-color 0.3s ease;
            border-radius: 5px; /* Скругление краев ячеек */
        }
        .slider {

            outline: yellow; /* remove outline */
            border-radius: 1px; /* round corners */
        }
        .mine {
            background-color: cornflowerblue; /* Цвет для мин */
        }
        button {
            margin-top: 20px;
        }
    </style>
</head>
<body>
<h1>MinesHelper</h1>
<table id="minesweeper"></table>
<label for="mineCount">Количество мин:</label>
<div class = "slider">
    <input type="range" id="mineCount" value="10" min="5" max="15" />
</div>
<span id="mineCountValue">10</span> <!-- Отображение текущего значения ползунка -->
<br>
<button id="generate">Сигнал</button>

<script src="/socket.io/socket.io.js"></script>
<script>
    const socket = io();
    const table = document.getElementById('minesweeper');
    const generateButton = document.getElementById('generate');
    const mineCountInput = document.getElementById('mineCount');
    const mineCountValue = document.getElementById('mineCountValue');

    // Функция для создания таблицы 5x5
    function createTable(rows, cols) {
        table.innerHTML = ''; // Очищаем предыдущую таблицу
        for (let r = 0; r < rows; r++) {
            const row = document.createElement('tr');
            for (let c = 0; c < cols; c++) {
                const cell = document.createElement('td');
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
    }

    // Функция для подсветки мин
    function highlightMines(mines) {
        const cells = table.getElementsByTagName('td');
        for (let r = 0; r < mines.length; r++) {
            for (let c = 0; c < mines[r].length; c++) {
                if (mines[r][c]) {
                    const index = r * 5 + c; // Индекс клетки в таблице
                    cells[index].classList.add('mine'); // Добавляем класс для подсветки
                }
            }
        }
    }
    function playSound(){
        var sound = new Audio('1.mp3');
        sound.play();
    }
    function playSound2(){
        var sound = new Audio('2.mp3');
        sound.play();
    }
    // Обработчик события нажатия на кнопку "Сгенерировать"
    generateButton.addEventListener('click', () => {
        playSound();
        // Сбрасываем предыдущие выделенные клетки
        const cells = table.getElementsByTagName('td');
        for (let i = 0; i < cells.length; i++) {
            cells[i].classList.remove('mine'); // Убираем класс подсветки
        }

        const mineCount = parseInt(mineCountInput.value);
        socket.emit('generateMines', (25-mineCount)/2); // Отправляем количество мин на сервер
    });

    // Обработчик события получения сгенерированных мин
    socket.on('minesGenerated', (mines) => {
        highlightMines(mines); // Подсвечиваем мины
    });

    // Обновление отображаемого значения ползунка
    mineCountInput.addEventListener('input', () => {
        playSound2();
        mineCountValue.textContent = mineCountInput.value;
    });

    // Создаем таблицу 5x5 при загрузке страницы
    createTable(5, 5);
</script>
</body>
</html>
