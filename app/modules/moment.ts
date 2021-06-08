import moment from 'moment'

declare module "moment" {
    interface Moment {
        fromNow_seconds(): number;
        olderThan14(): boolean;
    }
}
(moment as any).fn.fromNow_seconds = function (a): number {
    var duration = moment(this).diff(moment(), 'seconds');
    return duration;
};

(moment as any).fn.olderThan14 = function (a): boolean {
    var duration = moment.duration(moment(new Date()).diff(moment(this)));
    if (duration.asYears() <= 14) {
        return false;
    } else {
        return true
    }
};

export default moment