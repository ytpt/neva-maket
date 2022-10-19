//Трансформация таблицы в список
const table = document.querySelector('table');

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    table.style.display = 'none';

    const tableSpans = table.querySelectorAll('tbody td span');
    const list = document.createElement('ul');
    list.style.listStyleType = 'none';
    list.style.padding = '0';

    tableSpans.forEach(span => {
        let text = span.innerHTML;
        if (!text) {
            return;
        }

        let newTdElem = document.createElement('span');
        newTdElem.innerHTML = text;

        let tdWrap = document.createElement('li');
        tdWrap.style.border = '1px solid black';
        tdWrap.style.padding = '5px';
        tdWrap.append(newTdElem);
        list.append(tdWrap);
    })
    const blog = document.querySelectorAll('.blog > p')[1];
    blog.parentNode.insertBefore(list, blog.nextSibling);
}

