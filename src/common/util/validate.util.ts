export const checkEmail = (email: string) => {
    const reg: RegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    return reg.test(email);
};

export const checkId = (id: string) => {
    const reg: RegExp = /^[a-z1-5]*$/;
    return reg.test(id) && id.length > 0 && id.length < 10;
};

export const checkPassword = (password: string = '') => {
    const regx: RegExp = /^.*(?=^.{6,12}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
    return regx.test(password);
};

