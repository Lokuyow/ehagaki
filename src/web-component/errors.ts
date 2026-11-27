/**
 * Public Web Component errors carry a stable identifier in `Error.name`
 * (for example `initialization_failed`, `disconnected`, `not_ready`).
 */
export function createNamedError(name: string, message: string): Error {
    const error = new Error(message);
    error.name = name;
    return error;
}
