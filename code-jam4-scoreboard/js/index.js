const getSessionsData = fetch('https://raw.githubusercontent.com/belashjack/Code-jam4-scoreboard/master/sessions.json')
    .then((response) => {
        return response.json();
    });

const getUsersData = fetch('https://raw.githubusercontent.com/belashjack/Code-jam4-scoreboard/master/users.json')
    .then((response) => {
        return response.json();
    });

Promise.all([getSessionsData, getUsersData]).then((data) => {
    let usersData;
    let sessionsData;
    for (let i = 0; i < data.length; i++) {
        if ('users' in data[i]) {
            usersData = data[i]['users'];
        } else {
            sessionsData = data[i];
        }
    }
    const keys = Object.keys(sessionsData);
    for (let i = 0; i < keys.length; i++) {
        createResult(usersData, sessionsData[keys[i]]);
    }
    createRadioButtons(sessionsData);
});

const createRadioButtons = function createRadioButtons(sessionsData) {
    const changeSession = function changeSession() {
        Array.from(results.children).forEach((result) => {
            result.classList.toggle('hidden');
        });
    };
    const results = document.querySelector('.results');
    const keys = Object.keys(sessionsData);

    for (let i = 0; i < keys.length; i++) {
        const radioButton = document.createElement('label');
        const radioButtonInput = document.createElement('input');
        radioButtonInput.type = 'radio';
        radioButtonInput.name = 'session';
        radioButtonInput.id = sessionsData[keys[i]]['alias'];

        radioButton.innerHTML += sessionsData[keys[i]]['alias'];
        radioButton.appendChild(radioButtonInput);
        document.querySelector('.radio-buttons-container').appendChild(radioButton);

        radioButtonInput.addEventListener('change', changeSession);
        if (i === 0) {
            results.children[i].classList.remove('hidden');
            radioButtonInput.checked = true;
        }
    }
};

const createResult = function createResult(usersData, session) {
    const resultContainer = document.createElement('section');
    resultContainer.classList.add('result', session['alias'], 'hidden');
    const chartContainer = document.createElement('section');
    chartContainer.classList.add('chart-container');
    const tableContainer = document.createElement('section');
    tableContainer.classList.add('table-container');

    resultContainer.appendChild(chartContainer);
    resultContainer.appendChild(tableContainer);
    document.querySelector('.results').appendChild(resultContainer);

    const table = createTable(tableContainer, usersData, session);
    fillTable(table, usersData, session);
    createChart(chartContainer, usersData, session);
};

const createTable = function createTable(tableContainer, usersData, session) {
    const createTooltip = function createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip', 'hidden');
        tableContainer.appendChild(tooltip);
        return tooltip;
    };

    const tooltip = createTooltip();
    const table = document.createElement('table');
    table.classList.add('results-table');
    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');
    const tableHeadRow = document.createElement('tr');
    tableHead.appendChild(tableHeadRow);

    for (let i = 0; i < session['puzzles'].length + 3; i++) {
        const cell = document.createElement('th');
        tableHeadRow.appendChild(cell);
    }

    for (let i = 0; i < usersData.length; i++) {
        const tableBodyRow = document.createElement('tr');
        for (let i = 0; i < session['puzzles'].length + 3; i++) {
            const cell = document.createElement('td');
            tableBodyRow.appendChild(cell);
        }
        tableBody.appendChild(tableBodyRow);
    }

    table.appendChild(tableHead);
    table.appendChild(tableBody);
    tableContainer.appendChild(table);

    const showTooltip = function showTooltip(event) {
        if (event.target.tagName !== 'TD'
            || event.target === event.target.parentNode.firstElementChild
            || event.target === event.target.parentNode.lastElementChild
            || event.target === event.target.parentNode.lastElementChild.previousElementSibling
        ) {
            return;
        }
        event.target.style.cursor = 'help';

        let selector;
        const solution = session['rounds'][event.target.cellIndex - 1]['solutions'][event.target.parentNode.dataset.id];

        if (solution === undefined) {
            selector = '';
        } else {
            selector = session['rounds'][event.target.cellIndex - 1]['solutions'][event.target.parentNode.dataset.id]['code'];
        }

        tooltip.classList.remove('hidden');
        tooltip.textContent = selector;
        tooltip.style.top = `${(event.target.getBoundingClientRect().top + document.documentElement.scrollTop) - tooltip.offsetHeight}px`;
        tooltip.style.left = `${(event.target.getBoundingClientRect().left + document.documentElement.scrollLeft) + event.target.offsetWidth}px`;
    };

    const hideTooltip = function hideTooltip() {
        tooltip.classList.add('hidden');
    };

    table.addEventListener('mouseover', showTooltip);
    table.addEventListener('mouseout', hideTooltip);
    return table;
};

const fillTable = function fillTable(table, usersData, session) {
    const tableWidthInCells = table.tHead.rows[0].cells.length;

    table.tHead.rows[0].cells[0].textContent = 'Name';
    for (let i = 1; i < tableWidthInCells - 2; i++) {
        table.tHead.rows[0].cells[i].textContent = session['puzzles'][i - 1]['name'];
    }
    table.tHead.rows[0].cells[tableWidthInCells - 2].textContent = 'Total Time';
    table.tHead.rows[0].cells[tableWidthInCells - 1].textContent = 'Comparison';

    for (let i = 0; i < table.tBodies[0].rows.length; i++) {
        const userId = usersData[i]['uid'];
        let totalTime = 0;

        table.tBodies[0].rows[i].cells[0].textContent = usersData[i]['displayName'];
        table.tBodies[0].rows[i].dataset.id = userId;
        for (let j = 1; j < tableWidthInCells - 2; j++) {
            const solution = session['rounds'][j - 1]['solutions'][userId];
            if (solution === undefined || solution['correct'] === 'Incorrect') {
                table.tBodies[0].rows[i].cells[j].textContent = 150;
                totalTime += 150;
            } else {
                table.tBodies[0].rows[i].cells[j].textContent = solution['time']['$numberLong'];
                totalTime += Number(solution['time']['$numberLong']);
            }
        }
        table.tBodies[0].rows[i].cells[tableWidthInCells - 2].textContent = totalTime;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        table.tBodies[0].rows[i].cells[tableWidthInCells - 1].appendChild(checkbox);
    }
};

const createChart = function createChart(chartContainer, usersData, session) {
    const getRandomColor = function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const changeDataSet = function changeDataSet(event) {
        if (event.target.checked) {
            if (config.data.datasets.length + 1 >= 10) {
                checkboxes.forEach((checkbox) => {
                    if (!checkbox.checked) {
                        checkbox.disabled = true;
                    }
                });
            }

            const newColor = getRandomColor();
            const newDataset = {
                label: event.target.parentNode.parentNode.firstElementChild.textContent,
                backgroundColor: newColor,
                borderColor: newColor,
                data: [],
                fill: false,
            };

            for (let i = 0; i < session['puzzles'].length; i++) {
                newDataset.data.push(event.target.parentNode.parentNode.children[i + 1].textContent);
            }

            config.data.datasets.push(newDataset);

            myLine.update();
        } else {
            if (config.data.datasets.length - 1 < 10) {
                checkboxes.forEach((checkbox) => {
                    checkbox.disabled = false;
                });
            }

            const labelName = event.target.parentNode.parentNode.firstElementChild.textContent;

            for (let i = 0; i < config.data.datasets.length; i++) {
                if (config.data.datasets[i].label === labelName) {
                    config.data.datasets.splice(i, 1);
                    break;
                }
            }
            myLine.update();
        }
    };

    const config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [],
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true,
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Puzzle',
                    },
                    ticks: {
                        autoSkip: false,
                    },
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time',
                    },
                }],
            },
        },
    };

    session['puzzles'].forEach((elem) => {
        config.data.labels.push(elem.name);
    });

    const chart = document.createElement('canvas');
    chart.id = session['alias'];
    chartContainer.appendChild(chart);
    const [Chart] = [window.Chart];
    const myLine = new Chart(chart, config);

    const checkboxes = Array.from(document.querySelector(`.${chart.id}`).querySelectorAll('input[type="checkbox"]'));

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', changeDataSet);
    });
};
