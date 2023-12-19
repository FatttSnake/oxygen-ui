import moment from 'moment/moment'
import dayjs from 'dayjs'

export const getNowLocalTime = (format: string = 'yyyy-MM-DD HH:mm:ssZ') => {
    return moment().local().format(format)
}

export const getNowUtc = () => {
    return moment().toISOString()
}

export const utcToLocalTime = (utcTime: string, format: string = 'yyyy-MM-DD HH:mm:ssZ') => {
    return moment.utc(utcTime).local().format(format)
}

export const dayjsToLocalTime = (date: dayjs.Dayjs, format: string = 'YYYY-MM-DD HH:mm:ssZ') => {
    return date.format(format)
}

export const dayjsToUtc = (date: dayjs.Dayjs) => {
    return date.toISOString()
}

export const localTimeToUtc = (localTime: string) => {
    return moment(localTime).toISOString()
}

export const isPastTime = (utcTime: string) => {
    return moment.utc(utcTime).isBefore(moment.now())
}

export const utcToMillisecond = (utcTime: string) => {
    return moment.utc(utcTime).valueOf()
}

export const millisecondToUtc = (millisecond: number) => {
    return moment(millisecond).toISOString()
}
