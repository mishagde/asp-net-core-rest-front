let waitAll = false;
let countAll = 0;
const pageLengthAll = 5;

let waitInput = false;

let waitClear = false;

let showHideDivs = [
    "table-div",
    "table-div-buttons",
    "input-div",
    "input-div-buttons",
    "clear-div",
    "clear-div-buttons"
];

function showAll() {
    hideAllDivs();
    document.getElementById('table-div').style.display = 'flex';
    document.getElementById('table-div-buttons').style.display = 'inline-block';
}

async function getAll() {
    if (waitAll)
        return;
    waitAll = true;
    fetch('https://localhost:7006/note/?' + new URLSearchParams({
        count: pageLengthAll,
        skip: countAll,
    }))
        .then(r => r.json().then(data => data.map(x => ({
            id: x.id,
            key: x.key,
            value: x.value
        }))))
        .then(obj => {
            if (obj.length === 0)
                return;
            let table = '';
            obj.forEach(x => {
                table += '<tr><td>' + x.id + '</td><td>' + x.key + '</td><td>' + x.value + '</td></tr>';
            });
            document.getElementById("getAll").innerHTML += table;
            countAll += obj.length;
        })
        .finally(() => waitAll = false);
}

function showInput() {
    hideAllDivs();
    document.getElementById('input-div').style.display = 'flex';
    document.getElementById('input-div-buttons').style.display = 'inline-block';
}

function inputDb() {
    if (waitInput)
        return;
    waitInput = true;
    const input = document.getElementById("input-field");
    let text = input.value;
    input.disabled = true;
    fetch('https://localhost:7006/note/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: text
    })
        .then(x => x.text())
        .then(x => alert(x))
        .catch(x => {
            alert('Ну всё. Приехали: ' + x.toString());
        })
        .finally(() => {
            waitInput = false;
            input.disabled = false;
        });
}

function showClear() {
    hideAllDivs();
    document.getElementById('clear-div').style.display = 'flex';
    document.getElementById('clear-div-buttons').style.display = 'inline-block';
}

async function clearDb() {
    if (waitClear)
        return;
    waitClear = true;
    document.getElementById('clear-response').innerText = 'Отправили запрос к базе...';
    fetch('https://localhost:7006/note/clear').then(x => {
        if (x.ok)
            document.getElementById('clear-response').innerText = 'База очищена';
        else
            document.getElementById('clear-response').innerText = 'Статус ошибки: ' + x.status;
    }).catch(x => {
        document.getElementById('clear-response').innerText = 'Ну всё. Приехали: ' + x.toString();
    }).finally(() => {
        waitClear = false;
    });
}

function hideAllDivs() {
    showHideDivs.forEach(x => {
        document.getElementById(x).style.display = 'none'
    });
}