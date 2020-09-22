const CustomDate = function () {

    const formatBr = (targetDate = new Date()) => {
        let currentDate = targetDate,
            day = currentDate.getDate().toString(),
            month = (1 + parseInt(currentDate.getMonth())).toString(),
            year = currentDate.getFullYear();

        // adjust default (DD/MM/YYYY)
        day = (day.length == 1) ? "0" + day : day;
        month = (month.length == 1) ? "0" + month : month;

        return `${day}/${month}/${year}`;
    };

    formatForSearch = function (dateString) {
        var day = dateString.slice(0, 2),
            month = dateString.slice(3, 5),
            year = dateString.slice(6, 10),
            hour = dateString.slice(11, 13),
            minute = dateString.slice(14, 16),
            seconds = dateString.slice(17, 19);

        return `${year}-${month}-${day}T${hour}:${minute}:${seconds}.000+0000`;
    };

    return {
        formatBr,
        formatForSearch
    };
};

module.exports = CustomDate;