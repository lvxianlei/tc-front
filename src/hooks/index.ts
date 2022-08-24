import { useEffect, useState } from "react"
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

    useAuthorities.prototype.setState = setState

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