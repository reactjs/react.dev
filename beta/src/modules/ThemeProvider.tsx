import { createContext, Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react";

export enum ColorMode {
    light = 'light',
    dark = 'dark'
}


export const ThemeContext = createContext<{
    colorMode: ColorMode,
    setColorMode: Dispatch<SetStateAction<ColorMode>>
}>({
    colorMode: ColorMode.light,
    setColorMode: () => { }
});

export const ThemeProvider: FC = ({ children }) => {
    const [colorMode, setColorMode] = useState(ColorMode.light);
    const colorModeKey = "@app/colorMode";

    useEffect(() => {
        const savedColorMode = localStorage.getItem(colorModeKey);
        if (savedColorMode) setColorMode(savedColorMode as ColorMode)
    }, [])


    useEffect(() => {
        localStorage.setItem(colorModeKey, colorMode);
        if (!document) return;
        colorMode === ColorMode.dark ?
            document.documentElement.classList.add(ColorMode.dark) :
            document.documentElement.classList.remove(ColorMode.dark)
    }, [colorMode])


    return (
        <ThemeContext.Provider
            value={useMemo(
                () => ({
                    colorMode,
                    setColorMode
                }),
                [colorMode]
            )}>
            {children}
        </ThemeContext.Provider>
    )
}