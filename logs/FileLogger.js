module.exports = {
    outlog: function (...args) {
        const logpath = "logs/"
        fs = require('fs');
        let dataOggiArr = new Date().toISOString().split('T');
        let oggi = dataOggiArr[0]
        args.forEach(arg => {
            try {
                let oraoggiArr = dataOggiArr[1].split('.');
                let secs = oraoggiArr[0]
                let mills = oraoggiArr[1]

                fs.appendFileSync(`${logpath}/${oggi}.log`,
                    '[O | ' + `${secs} ${mills}` + ' ] ' + (typeof arg === 'string' ? arg : JSON.stringify(arg)) + "\n",
                    { encoding:'utf8'})
            } catch (e) {
                console.error('outlog fails: ', e)
            }
        });
    }
};

