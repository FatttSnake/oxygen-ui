import ReactDOM from 'react-dom/client'
import LoadingMask from '@/components/common/LoadingMask'

export const randomInt = (start: number, end: number) => {
    if (start > end) {
        const t = start
        start = end
        end = t
    }
    start = Math.ceil(start)
    end = Math.floor(end)
    return start + Math.floor(Math.random() * (end - start))
}

export const randomFloat = (start: number, end: number) => {
    return start + Math.random() * (end - start)
}

export const randomColor = (start: number, end: number) => {
    return `rgb(${randomInt(start, end)},${randomInt(start, end)},${randomInt(start, end)})`
}

export const floorNumber = (num: number, digits: number) => {
    if (digits > 0) {
        return Math.floor(num / Math.pow(10, digits - 1)) * Math.pow(10, digits - 1)
    } else {
        const regExpMatchArray = num.toString().match(new RegExp('^\\d\\.\\d{' + -digits + '}'))
        if (regExpMatchArray !== null) {
            return parseFloat(regExpMatchArray[0]).toFixed(-digits)
        } else {
            return num
        }
    }
}

export const showLoadingMask = (id: string) => {
    if (document.querySelector(`#${id}`)) {
        return
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    container.id = id
    container.setAttribute(
        'style',
        'position: fixed; width: 100vw; height: 100vh; z-index: 10000; left: 0; top: 0;'
    )

    return ReactDOM.createRoot(container).render(<LoadingMask />)
}

export const removeLoadingMask = (id: string) => {
    document.querySelectorAll(`#${id}`).forEach((value) => {
        value.parentNode?.removeChild(value)
    })
}
