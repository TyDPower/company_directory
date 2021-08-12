export const validStr = (str) => {
    let char = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
    let num = /\d/;
    if (str.length > 0) {
        if (num.test(str) || char.test(str)) {
            return false;
        }
        return true;
    }
};

export const validEmail = (email) => {
    let char = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (char.test(email.toLowerCase())) {
        return true;
    }
    return false;
};