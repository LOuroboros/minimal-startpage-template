/**
 * Interval which the clock will be updated (in milliseconds).
 */
const clockInterval = 100;

/**
 * Search engine query url
 */
const searchEngineUrl = 'https://google.com/search?q=';

const tabKeyCode = 9;
const enterKeyCode = 13;
const escapeKeyCode = 27;
const searchBarElement = document.getElementById('search-bar');
const clockElement = document.getElementById('clock');
const formElement = document.getElementById('search-form');

/**
 * Return a string containing the formatted current date and time.
 */
function getDateTime() {
    const dateTime = new Date();
    let day = dateTime.getDate();
    let month = dateTime.getMonth() + 1;
    let hour = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    let seconds = dateTime.getSeconds();

    if (hour < 0) {
        hour = 24 + hour;
    }

    let date = (day < 10 ? '0' + day : day) + '/' + (month < 10 ? '0' + month : month) + '/' + dateTime.getFullYear();
    let time = (hour < 10 ? '0' + hour : hour) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);

    return date + '\n' + time;
}

function setClock() {
    clockElement.innerText = getDateTime();
}

function search() {
    let value = searchBarElement.value;
    if (!value) {
        return;
    }

    if (value.startsWith('https://') || value.startsWith('http://')) {
        window.location = value;
    } else {
        window.location = searchEngineUrl + encodeURIComponent(value);
    }
}

/**
 * Link title auto-sizing
 *
 * Most link titles fit comfortably on one line at the default font size.
 * A few (long forum thread titles, subreddit names with extra notes, etc.)
 * don't. Rather than shrinking every title's font (which makes the short,
 * already-fitting ones needlessly small) or letting long ones wrap/clip,
 * this shrinks the font size only for the individual titles that actually
 * need it, stopping once each one fits on a single line - or, failing
 * that (if it hits a minimum readable size and still doesn't fit), lets
 * that one title wrap instead of clipping it.
 */
const linkMinFontSize = 11; // px - floor before we give up shrinking and allow wrapping
const linkDefaultFontSize = 16; // px - starting point for each shrink pass

function fitLinkTitles() {
    const links = document.querySelectorAll('.link');

    links.forEach((link) => {
        // Reset to default state before measuring, so this is safe to
        // re-run on resize without compounding previous shrinks.
        link.style.fontSize = linkDefaultFontSize + 'px';
        link.style.whiteSpace = 'nowrap';

        let fontSize = linkDefaultFontSize;

        while (link.scrollWidth > link.clientWidth && fontSize > linkMinFontSize) {
            fontSize -= 1;
            link.style.fontSize = fontSize + 'px';
        }

        // Still doesn't fit even at the smallest readable size - let this
        // one title wrap to a second line instead of shrinking it further
        // or clipping it.
        if (link.scrollWidth > link.clientWidth) {
            link.style.whiteSpace = 'normal';
        }
    });
}

let resizeTimeout;
function scheduleFitLinkTitles() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(fitLinkTitles, 100);
}


setClock();

setInterval(() => {
    setClock();
}, clockInterval);

searchBarElement.focus();
searchBarElement.value = '';

fitLinkTitles();
window.addEventListener('resize', scheduleFitLinkTitles);

formElement.addEventListener('submit', (ev) => {
    ev.preventDefault();
    search();
});

document.addEventListener('keypress', (event) => {
    if (event.keyCode == escapeKeyCode) {
        searchBarElement.blur();
        searchBarElement.value = '';
    } else if (event.keyCode != tabKeyCode && event.keyCode != enterKeyCode) {
        searchBarElement.focus();
    }
});
