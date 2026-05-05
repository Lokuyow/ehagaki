export function shortenMiddle(value: string, startLength: number, endLength: number): string {
    const minimumLength = startLength + endLength + 3;
    if (value.length <= minimumLength) {
        return value;
    }

    return `${value.slice(0, startLength)}...${value.slice(-endLength)}`;
}
