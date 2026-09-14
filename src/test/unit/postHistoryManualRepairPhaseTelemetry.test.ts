import { describe, expect, it } from "vitest";
import {
    createPostHistoryManualRepairPhaseTelemetry,
} from "../../lib/hooks/usePostHistoryListing.svelte";

describe("post history manual repair phase telemetry", () => {
    it("phase B duration excludes phase A elapsed time", () => {
        const phaseA = createPostHistoryManualRepairPhaseTelemetry({
            phase: "visible-range-state",
            startedAt: 10,
            finishedAt: 110,
        });
        const phaseB = createPostHistoryManualRepairPhaseTelemetry({
            phase: "primary-fetch",
            startedAt: 110,
            finishedAt: 135,
        });

        expect(phaseA).toEqual(expect.objectContaining({ durationMs: 100 }));
        expect(phaseB).toEqual(expect.objectContaining({ durationMs: 25 }));
    });

    it("records only a safe error class for relation and badge failures", () => {
        const relation = createPostHistoryManualRepairPhaseTelemetry({
            phase: "relation-repair",
            startedAt: 0,
            finishedAt: 5,
            error: new TypeError("event content and auth material must not be logged"),
        });
        const badge = createPostHistoryManualRepairPhaseTelemetry({
            phase: "badge-refresh",
            startedAt: 5,
            finishedAt: 9,
            errorClass: "NetworkError",
        });

        expect(relation).toEqual(expect.objectContaining({
            phase: "relation-repair",
            errorClass: "TypeError",
        }));
        expect(badge).toEqual(expect.objectContaining({
            phase: "badge-refresh",
            errorClass: "NetworkError",
        }));
        expect(JSON.stringify([relation, badge])).not.toContain("event content");
        expect(JSON.stringify([relation, badge])).not.toContain("auth material");
        expect(relation).not.toHaveProperty("message");
        expect(relation).not.toHaveProperty("content");
        expect(relation).not.toHaveProperty("auth");
    });
});
