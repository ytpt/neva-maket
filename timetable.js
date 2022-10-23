Date.prototype.formatDateNumber = function(number) {
    if (number < 9){
        number = '0' + number;
    }

    return number.toString();
}

Date.prototype.getFormattedTime = function() {
    const hours = this.formatDateNumber(this.getHours());
    const minutes = this.formatDateNumber(this.getMinutes());

    return `${hours}:${minutes}`;
}

Date.prototype.getFormattedDateTime = function() {
    const month = this.formatDateNumber(this.getMonth() + 1);
    const day = this.formatDateNumber(this.getDate());
    const hours = this.formatDateNumber(this.getHours());
    const minutes = this.formatDateNumber(this.getMinutes());

    return `${this.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
}

Date.prototype.compareWithDate = function(compareDate) {
    const difference = compareDate.getTime() - this.getTime(); // in milliseconds

    return {
        minutes: Math.round(difference / 60000)
    }
}

const destinations = {
    AB: {
        key: 'ab',
        name: 'Из А в В',
        selectId: 'A',
        price: 700,
        returnPrice: 500,
        inMinutes: 50,
        slots: [
            '2021-08-21T18:00:00.000+03:00',
            '2021-08-21T18:30:00.000+03:00',
            '2021-08-21T18:45:00.000+03:00',
            '2021-08-21T19:00:00.000+03:00',
            '2021-08-21T19:15:00.000+03:00',
            '2021-08-21T21:00:00.000+03:00'
        ]
    },
    BA: {
        key: 'ba',
        name: 'Из В в А',
        selectId: 'B',
        price: 700,
        returnPrice: 500,
        inMinutes: 50,
        slots: [
            '2021-08-21T18:30:00.000+03:00',
            '2021-08-21T18:45:00.000+03:00',
            '2021-08-21T19:00:00.000+03:00',
            '2021-08-21T19:15:00.000+03:00',
            '2021-08-21T19:35:00.000+03:00',
            '2021-08-21T21:50:00.000+03:00',
            '2021-08-21T21:55:00.000+03:00'
        ]
    }
};

const travelTime = 50;
const oneWayPrice = 700;
const twoWaysPrice = 1200;

let sectionPathElem = document.querySelector('section.select-path');
let sectionTimeElem = document.querySelector('section.select-time');
let sectionTotalElem = document.querySelector('section.total');
let sectionTicketsAmountElem = document.querySelector('section.tickets-count');

const renderTotalResult = function() {
    let totalTimeInMinutes = 0;
    let totalPrice = 0;

    const ticketsAmount = parseInt(sectionTicketsAmountElem.querySelector('input').value);
    if (!ticketsAmount || ticketsAmount < 1) {
        alert('Количество билетов должно быть 1+');
        return;
    }

    const getTravelInfo = function(destinationKey) {
        let info = '';
        const destination = destinations[destinationKey];

        info += `${destination.name}<br>`;
        info += `Время в пути: ${destination.inMinutes} минут.<br>`;

        const selectElem = document.querySelector(`#${destination.selectId}`);

        if (!selectElem) {
            return info;
        }

        const startDate = new Date(selectElem.value);
        let arrivalDate = new Date(startDate.getTime());
        arrivalDate.setMinutes(arrivalDate.getMinutes() + destination.inMinutes);

        info += `Отправление: ${startDate.getFormattedDateTime()}<br>`;
        info += `Прибытие: ${arrivalDate.getFormattedDateTime()}<br>`;

        return info;
    };

    // calculate total price, time and prepare info
    let travels = [];
    switch (document.querySelector('#route').value) {
        case 'ab':
            totalTimeInMinutes = destinations.AB.inMinutes;
            totalPrice = destinations.AB.price;

            travels.push(getTravelInfo('AB'));
            break;
        case 'ba':
            totalTimeInMinutes = destinations.BA.inMinutes;
            totalPrice = destinations.BA.price;

            travels.push(getTravelInfo('BA'));
            break;
        case 'aba':
            const routeA = document.querySelector('#A');
            const routeB = document.querySelector('#B');

            let date = new Date(routeA.value); // start date
            const backDate = routeB ? new Date(routeB.value) : null;

            totalTimeInMinutes = date.compareWithDate(backDate).minutes + destinations.BA.inMinutes;
            totalPrice = destinations.AB.price + destinations.AB.returnPrice;

            travels.push(getTravelInfo('AB'));
            travels.push(getTravelInfo('BA'));
            break;
    }

    totalPrice *= ticketsAmount;

    let travelsText = '';
    travels.forEach(travel => {
        travelsText += `${travel}<br>`;
    });

    sectionTotalElem.innerHTML = `
        <p><b>Маршрут:</b></p>
        ${travelsText}
        <p>
            <b>Количество билетов:</b> ${ticketsAmount}.<br>
            <b>Итоговая стоимость:</b> ${totalPrice} р.<br>
            <b>Общее время в пути:</b> ${totalTimeInMinutes} минут.
        </p> 
    `;
};

const reset = function() {
    sectionTotalElem.innerHTML = '';
    sectionTicketsAmountElem.classList.add('hidden');
}

const showTicketsSlot = function() {
    reset();

    sectionTicketsAmountElem.querySelector('input').value = 1;
    sectionTicketsAmountElem.classList.remove('hidden');
}

const updateTimes = function (path, id, direction, showTicketAmount) {
    let selectDiv = document.createElement('div');

    const selectName = `time-${id}`;
    let labelElem = document.createElement('label');
    labelElem.setAttribute('for', selectName);
    labelElem.textContent = `Выберите время ${direction}:`;

    let selectElem = document.createElement('select');
    selectElem.setAttribute('name', selectName);
    selectElem.setAttribute('id', id);

    let optionsHTML = '<option value = "" selected disabled>Выбрать</option>';
    path.forEach(timeSlot => {
        const date = (new Date(timeSlot));
        optionsHTML += `<option value="${date}">${date.getFormattedDateTime()}</option>`;
    })
    selectElem.innerHTML = optionsHTML;

    if (showTicketAmount) {
        selectElem.addEventListener('change', showTicketsSlot);
    }

    selectDiv.append(labelElem);
    selectDiv.append(selectElem);
    sectionTimeElem.append(selectDiv);
    sectionTimeElem.classList.remove('hidden');
};

const updateTimeSlotsStatuses = () => {
    let forward = document.querySelector('#A');
    let back = document.querySelector('#B');

    if (!back) {
        alert('net')
        return;
    }

    back.querySelectorAll('option').forEach(option => {
        option.disabled = Date.parse(option.value) <= (Date.parse(forward.value) + (destinations.AB.inMinutes * 60000));
    })

    if (back.value) {
        forward.querySelectorAll('option').forEach(option => {
            option.disabled = Date.parse(option.value) <= (Date.parse(back.value) - (destinations.BA.inMinutes * 60000));
        })
    }
};

let pathSelectElem = sectionPathElem.querySelector('select');
pathSelectElem.onchange = function () {
    reset();
    sectionTimeElem.innerHTML = '';

    switch (pathSelectElem.value) {
        case 'ab':
            updateTimes(destinations.AB.slots, 'A', '', true);
            break;
        case 'ba':
            updateTimes(destinations.BA.slots, 'B', '', true);
            break;
        case 'aba':
            updateTimes(destinations.AB.slots, 'A', 'туда', false);
            let forward = document.querySelector('#A');

            forward.addEventListener('change', function () {
                let back = document.querySelector('#B');

                if (back) {
                    back.parentNode.parentNode.removeChild(back.parentNode)
                }

                updateTimes(destinations.BA.slots, 'B', 'обратно', true);
                updateTimeSlotsStatuses();

                back = document.querySelector('#B');
                if (back) {
                    back.addEventListener('change', function () {
                        updateTimeSlotsStatuses();
                    });
                }
            });
            break;
    }
};