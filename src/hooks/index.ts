import { useState, useEffect } from "react"
let catchDic: { authorities: string[], dictionary: any[] } = {
    authorities: [],
    dictionary: []
}

export function useDictionary() {
    const [state, setState] = useState(catchDic)

    useDictionary.prototype.setState = setState

    return state.dictionary
}

export function useAuthorities() {
    const [state, setState] = useState(catchDic)

    useEffect(() => {
        setState(catchDic)
    }, [catchDic])

    useAuthorities.prototype.setState = setState
    useAuthorities.prototype.state = state

    return state.authorities
}

export function setAuthorities(authorities?: string[]) {
    authorities && (catchDic = ({ ...catchDic, authorities }))
    authorities && useAuthorities.prototype.setState?.(({ ...catchDic, authorities }))
}

export function setDictionary(dictionary?: any[]) {
    dictionary && (catchDic = ({ ...catchDic, dictionary }))
    dictionary && useDictionary.prototype.setState?.({ ...catchDic, dictionary })
}

export function getDictionary() {
    return useDictionary.prototype.state
}

export function hasAuthority(authority: string): boolean {
    if (authority === "") {
        return true
    }
    if (!authority) {
        return false;
    }
    for (const value of catchDic.authorities) {
        if (value === authority) {
            return true;
        }
    }
    return false;
}