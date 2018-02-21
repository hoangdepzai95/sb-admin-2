function  inArray(array, value) {
    return array.indexOf(value) !== -1;
};

function isLen(str, len) {
    return str.length == len;
}

 function validatePhoneNumber(value) {
    if (value == undefined || value === null || value.length === 0) {
        return false;
    }
    if(/^(:?(:?18)|(:?19))\d{6}$/.test(value)) {
        return true;
    }
    if(/^(:?19)\d{8}$/.test(value)) {
        return true;
    }
    if (/^(:?(:?84)|(:?0))\d{9,10}$/.test(value)) {
        value = value.replace(/^84/, 0);
        if ((new RegExp(value[1] + "{" + value.length + "}")).test((value.substr(1)))) {
            return false;
        }
        var valLen = value.length;
        var regexp = ["(", value.substr(1, 2), ")", "{", (Math.floor(valLen / 2) - ((isLen(value, 10)) ? 1 : 0)), "}", (isLen(value, 10)) ? "[0-9]" : '', '$'];
        if ((new RegExp(regexp.join(''))).test((value.substr(1)))) {
            return false;
        }
        var partOne = value.substr(0, 2),
            codeFirst2 = value.substr(1, 2),
            codeFirst3 = value.substr(1, 3);

        switch (partOne) {
            case '02':
                if (inArray(codeFirst3, [210, 211, 218, 219, 230, 231, 240, 241, 280, 281, 292]) != -1) {
                    return isLen(value, 11);
                }

                if (inArray(codeFirst2, [20, 22, 25, 26, 29]) !== -1) {
                    return isLen(value, 10);
                }

                break;
            case '03':
                if (inArray(codeFirst2, [30, 31, 33, 36, 37, 38, 39]) !== -1) {
                    return isLen(value, 10);
                }
                if (inArray(codeFirst3, [320, 350, 351]) !== -1) {
                    return isLen(value, 11);
                }
                break;
            case '08':
            case '04':
                return isLen(value, 10);
            case '05':
                if (codeFirst2 >= 52 && codeFirst2 <= 59) {
                    return isLen(value, 10);
                }
                if (inArray(codeFirst3, [500, 501, 510, 511]) !== -1) {
                    return isLen(value, 11);
                }
                break;
            case '06':
                if ((codeFirst2 >= 60 && codeFirst2 <= 64) || inArray(codeFirst2, [67, 68]) !== -1) {
                    return isLen(value, 10);
                }
                if ((inArray(codeFirst2, [650, 651]) !== -1)) {
                    return isLen(value, 11);
                }
                break;
            case '07':
                if ((codeFirst2 >= 73 && codeFirst2 <= 77) || inArray(codeFirst2, [70, 79]) !== -1) {
                    return isLen(value, 10);
                }
                if (inArray(codeFirst3, [710, 711, 780, 781]) !== -1) {
                    return isLen(value, 11);
                }
                break;
            case '09':
                if (value.length !== 10) {
                    return false;
                }
                if ((codeFirst2 >= 90 && codeFirst2 <= 98) || codeFirst2 == 43) {
                    return true;
                }
                if (codeFirst3 == 992 || codeFirst3 >= 996 && codeFirst3 <= 999) {
                    return true;
                }
                break;
            case '01':
                if (value.length !== 11) {
                    return false;
                }
                if ((codeFirst3 >= 120 && codeFirst3 <= 129) || (inArray(codeFirst3, [186, 188, 199])) || (codeFirst3 >= 162 && codeFirst3 <= 169)) {
                    return true;
                }
                break;
        }
    }
    return false;
}

 function validateEmail (value) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
}

module.exports = { validateEmail: validateEmail, validatePhoneNumber: validatePhoneNumber }