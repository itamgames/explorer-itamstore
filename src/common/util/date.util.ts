export const formatDate = (date: Date, isTime: boolean = false) => {
    const year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    let day: string | number = date.getDate();

    if (month < 10) { month = `0${month}`; }
    if (day < 10) { day = `0${day}`; }

    let dateFormat = `${year}-${month}-${day}`;

    if (isTime) {
        let hour: string | number = date.getHours();
        let minute: string | number =  date.getMinutes();
        let second: string | number = date.getSeconds();

        if (hour < 10) { hour = `0${hour}`; }
        if (minute < 10) { minute = `0${minute}`; }
        if (second < 10) { second = `0${second}`; }

        dateFormat += ` ${hour}:${minute}:${second}`;
    }

    return dateFormat;
};
