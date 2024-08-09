export function scale(number: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

export function openLink(url: string, openInNewTab=true) {
    if (openInNewTab) {
        const win = window.open(url, '_blank');
        win && win.focus();
    } else {
        window.location.href = url;
    }
}

export function getURLParams(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || null;
}

export function isValidQuestion(question: string): boolean {
    return question !== '' && question.endsWith('?') && question !== '?';
}

export function isValidUrl(url: string): boolean {
    let givenURL ;
    try {
        givenURL = new URL(url);
    } catch (error) {
        return false; 
    }
    return true;
}