export function numberFormat(number, decimals = null, dec_point = '.', thousands_sep = ' '): string {
    const n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep =  thousands_sep,
        dec =  dec_point,
        toFixedFix = function (_n, _prec) {
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            const k = Math.pow(10, _prec);
            return Math.round(_n * k) / k;
        },
        s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }

    if (+s[1] === 0) {
        s.splice(1, 1);
    }
    return s.join(dec);
}

export function percentFormat(number) {
    if (!number || !+number) {
        return '-';
    }

    return numberFormat( number * 100, 2) + '%';
}


export function AutoUnsubscribe( blackList = [] ) {

    return function ( constructor ) {
        const original = constructor.prototype.ngOnDestroy;

        constructor.prototype.ngOnDestroy = function () {
            for ( const prop in this ) {
                if (this.hasOwnProperty(prop)) {
                    const property = this[ prop ];
                    if ( !blackList.includes(prop) ) {
                        if ( property && ( typeof property.unsubscribe === 'function' ) ) {
                            property.unsubscribe();
                        }
                    }
                }
            }
            if (original && typeof original === 'function') {
                original.apply(this, arguments);
            }
        };
    };

}

export function parseLikeNumberString(value: string): string {
    return value.replace(/[^0-9]/g, '').slice(0, 10);
}

export function getCookie(name: string): string {
    const reg = new RegExp(`(?:(?:^|.*;\\s*)${name}\\s*\\=\\s*([^;]*).*$)|^.*$`);
    return document.cookie.replace(reg, '$1');
}

export function setCookie(name: string, value: string, expiresDays: number, path: string) {
    const now = new Date();
    now.setTime(now.getTime() + (expiresDays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + now.toUTCString();
    document.cookie = `${name}=${value};${expires};path=${path}`;
}

export function getUrlParam(name: string): string {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export function isDescendantNode(className, node) {
    if (className && node) {
        let element = node;
        while (element && element.classList) {
            if (element.classList.contains(className)) {
                return true;
            }
            element = element.parentNode;
        }
    }
    return false;
}

export function cutLongText(text: string, maxLength: number) {
    if (text.length > maxLength) {
        return `${text.slice(0, maxLength - 3)}...`;
    }
    return text;
}
