import { shareStructure } from "./utils/structuralSharing";

/**
 * Keeps object identity stable across recomputations of a thread graph state.
 * Returns `previous` when `next` holds the same data, otherwise `next` with every
 * unchanged sub-tree taken from `previous`. Neither argument is mutated.
 */
export function sharePostHistoryThreadGraphState<T>(previous: T | undefined, next: T): T {
    return shareStructure(previous, next);
}
