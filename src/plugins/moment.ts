import moment from 'moment';
import 'moment-timezone';

declare module 'moment' {
    interface Moment {
        /**
         * format YYYY-MM-DDTHH:mm:ss
         * @return string
         */
        fmFullTimeString(): string;
        /**
         * format YYYY-MM-DDTHH:mm:ss+00:00
         * @return string
         */
        fmFullTimeStringWithTimezone(): string;
    }
}

moment.fn.fmFullTimeString = function (): string {
    return this.tz('UTC').format('YYYY-MM-DDTHH:mm:ss');
};
moment.fn.fmFullTimeStringWithTimezone = function (): string {
    return this.tz('UTC').format('YYYY-MM-DDTHH:mm:ss+00:00');
};

export default moment;
