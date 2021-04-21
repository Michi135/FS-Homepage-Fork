import isURL from 'validator/lib/isURL'
import isDataURI from 'validator/lib/isDataURI'

const endToMime: Map<string, string> = new Map<string, string>([
    ["svg", "image/svg+xml"]
]);

function getFileExtension(input: string) {
    return input.slice((input.lastIndexOf(".") - 1 >>> 0) + 2);
}

function mimeType(input: string) {
    if (isURL(input, {
        require_protocol: false,
        require_host: false
    })) {
        const ext = getFileExtension(input);
        if (endToMime.has(ext)) {
            return endToMime.get(ext);
        }
    }
    else if (isDataURI(input)) {
        const reg = RegExp(/data:(.*?)?(;base64)?,(.*)/);
        const result = reg.exec(input);

        if (result && result.length > 1 && result[1].startsWith('image'))
            return result[1];
    }
    throw "Not a favicon"
}

export function createFaviconLink(input: string) {
    const type = mimeType(input);

    if (typeof window === 'undefined') {
        return <HTMLLinkElement><unknown>(`<link rel="icon" href="${input}" type="${type}">`)
    }
    else {
        let link = document.createElement("link");
        link.rel = "icon";
        (link.href = input), (link.type = <string>type);

        return link;
    }
}
