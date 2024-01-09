import { ITheme } from '@/components/Playground/shared'

const STORAGE_DARK_THEME = 'react-playground-prefer-dark'

export const setPlaygroundTheme = (theme: ITheme) => {
    localStorage.setItem(STORAGE_DARK_THEME, String(theme === 'vs-dark'))
    document
        .querySelectorAll('div[data-id="react-playground"]')
        ?.forEach((item) => item.setAttribute('class', theme))
}

export const getPlaygroundTheme = (): ITheme => {
    const isDarkTheme = JSON.parse(localStorage.getItem(STORAGE_DARK_THEME) || 'false') as ITheme
    return isDarkTheme ? 'vs-dark' : 'light'
}
