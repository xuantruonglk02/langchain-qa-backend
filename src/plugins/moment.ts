import moment from 'moment';
import 'moment-timezone';

declare module 'moment' {
    interface Moment {
        /**
         * format YYYY-MM-DD HH:mm:ss
         * @return string
         */
        fmFullTimeStringWithTimezone(): string;
    }
}

moment.fn.fmFullTimeStringWithTimezone = function (): string {
    return this.tz('UTC').format('YYYY-MM-DDTHH:mm:ss+00:00');
};

export default moment;
