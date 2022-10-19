//Появление кнопки 'ещё...', если времени больше, чем 4
const card = document.querySelectorAll('.card');

card.forEach(card => {
    const times = card.querySelectorAll('.main__time_hidden li');

    if (times.length > 4) {
        let moreLi = document.createElement('li');
        let moreBtn = document.createElement('button');
        moreBtn.innerHTML = 'ещё...';
        moreLi.append(moreBtn);

        const thirdChild = times[2];
        thirdChild.after(moreLi);

        moreLi.addEventListener('click', function() {
            moreLi.classList.toggle('li-active');
            const timetable = moreLi.parentElement;
            timetable.classList.toggle('main__time_active');

            const moreBtn = moreLi.querySelector('button');
            moreBtn.classList.toggle('btn-active');
        })
    }
})

//Центрирование цены, при отсутствии фразы '1200 р на причале'
card.forEach(card => {
    const footerPrice = card.querySelector('.footer > div');
    
    if (footerPrice.children.length <= 1) {
        console.log(footerPrice)
        footerPrice.classList.toggle('footer__price_center');
    }
})
