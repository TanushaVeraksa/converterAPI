const {log} = console;

const ids = [145, 292, 298];
const ids2 = [431, 451, 456];

const currEL = document.getElementById('curr');
const getInfoEl = document.getElementById('info');

async function fetchCurr(id) {
    const url = id 
        ? 'https://www.nbrb.by/api/exrates/currencies/' + id 
        : 'https://www.nbrb.by/api/exrates/currencies/';
    const result = await fetch(url);
    const fetchData = await result.json();
    return fetchData;
}

async function fetchPeriod(id) {
    const url = id 
    ? 'https://www.nbrb.by/api/exrates/rates/' + id 
    : 'https://www.nbrb.by/api/exrates/rates?periodicity=0';
    const result = await fetch(url);
    const fetchData = await result.json();
    return fetchData;
}

const resProm = ids.map(s=>fetchCurr(s));
const resProm2 = ids2.map(s=>fetchPeriod(s));

Promise.all(resProm)
    .then(value => {
        log(value);
        createOption(value);
        selectedCurr(value)
    })

Promise.all(resProm2)
    .then(value => {
        log(value);
        selectedCurr(value)           
    })


function createOption(mass) {
    mass.forEach(elem => {
        const optionsEl = document.createElement('option');
        optionsEl.innerHTML = elem.Cur_Abbreviation;
        currEL.appendChild(optionsEl);
    })
}

let additionalInfo = 'долларов США';

function selectedCurr(mass) {
    getInfoEl.addEventListener('click', function (event) {
        let selected = curr.options[curr.selectedIndex].text;
        mass.forEach(elem => {
            if(elem.Cur_NameMulti !== undefined && elem.Cur_Abbreviation === selected) {
                additionalInfo = elem.Cur_NameMulti;
            }
            if(elem.Cur_Abbreviation === selected && elem.Cur_NameMulti === undefined) {
                log(additionalInfo)
                resOutput(additionalInfo, elem.Cur_OfficialRate, elem.Cur_Scale, elem.Date)
            }
        })
    })
}

const inputMoneyEL = document.getElementById('byn');
const resultEL = document.getElementById('res');

function resOutput(currency, rate, scale, date) {
    let money = (+inputMoneyEL.value / rate) * scale;
    const now = new Date(date);
    let dateNow = now.getDate() + '-' + (now.getMonth() + 1) + '-' + now.getFullYear();
    let info = `Вы можете купить ${money.toFixed(2)} ${changeFirstLetter(currency)} за ${inputMoneyEL.value} BYN по курсу ${rate}
     за ${scale} уе на ${dateNow}`;

    resultEL.innerHTML = info;
}

function changeFirstLetter([...str]) {
   str[0] = str[0].toLowerCase();
   return str.join('');
}





