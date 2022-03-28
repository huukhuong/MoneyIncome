const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

const validatePassword = (password) => {
    return password.length >= 8;
}

const formatNumber = (number) => {
    const n = parseInt(number);
    const dp = 0;
    let w = n.toFixed(dp), k = w | 0, b = n < 0 ? 1 : 0,
        u = Math.abs(w - k), d = ('' + u.toFixed(dp)).substr(2, dp),
        s = '' + k, i = s.length, r = '';
    while ((i -= 3) > b) {
        r = ',' + s.substr(i, 3) + r;
    }
    return s.substr(0, i + 3) + r + (d ? '.' + d : '');
}

export {
    validateEmail,
    validatePassword,
    formatNumber
}