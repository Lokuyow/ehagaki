import { describe, expect, it } from 'vitest';
import {
    buildPostHistoryManualRepairRelationPhases,
    resolvePostHistoryManualRepairFailure,
    resolvePostHistoryManualRepairResultMessage,
    summarizePostHistoryManualRepairFetchCounts,
} from '../../lib/postHistoryListingRepair';
import type { PostHistoryCurrentViewRefetchResult } from '../../lib/postHistoryCurrentViewRefetchService';

type ProcessedRanges = PostHistoryCurrentViewRefetchResult['processedRanges'];

describe('summarizePostHistoryManualRepairFetchCounts', () => {
    it('処理済み範囲の件数とリレー数を合計する', () => {
        const processedRanges = [
            {
                rawCount: 5,
                uniqueCount: 4,
                requestedRelayUrls: ['wss://a.example', 'wss://b.example'],
                eoseRelayUrls: ['wss://a.example'],
            },
            { rawCount: 2 },
        ] as unknown as ProcessedRanges;

        expect(summarizePostHistoryManualRepairFetchCounts({
            processedRangeCount: 2,
            processedRanges,
        })).toEqual({
            processedRangeCount: 2,
            rawCount: 7,
            uniqueCount: 4,
            requestedRelayCount: 2,
            eoseRelayCount: 1,
        });
    });
});

describe('buildPostHistoryManualRepairRelationPhases', () => {
    it('バッジ更新が走っていなければ relation-repair だけを返す', () => {
        expect(buildPostHistoryManualRepairRelationPhases({
            status: 'success',
            savedDirectReplyCount: 3,
            relationRepairDurationMs: 40,
        }, 100)).toEqual([{
            phase: 'relation-repair',
            startedAt: 100,
            durationMs: 40,
            errorClass: undefined,
            counts: { savedDirectReplyCount: 3 },
        }]);
    });

    it('バッジ更新が完了していれば badge-refresh も返す', () => {
        const phases = buildPostHistoryManualRepairRelationPhases({
            status: 'success',
            savedDirectReplyCount: 0,
            relationRepairDurationMs: 40,
            badgeRefreshDurationMs: 15,
        }, 100);

        expect(phases[1]).toEqual({
            phase: 'badge-refresh',
            startedAt: 100,
            durationMs: 15,
            errorClass: undefined,
        });
    });

    it('relation-repair の失敗は失敗側の所要時間とエラー種別を使う', () => {
        const phases = buildPostHistoryManualRepairRelationPhases({
            status: 'partial',
            savedDirectReplyCount: 0,
            failurePhase: 'relation-repair',
            failureDurationMs: 25,
            failureErrorClass: 'TypeError',
        }, 100);

        expect(phases).toHaveLength(1);
        expect(phases[0]).toMatchObject({
            phase: 'relation-repair',
            durationMs: 25,
            errorClass: 'TypeError',
        });
    });

    it('badge-refresh の失敗は relation-repair にエラーを付けない', () => {
        const phases = buildPostHistoryManualRepairRelationPhases({
            status: 'partial',
            savedDirectReplyCount: 1,
            relationRepairDurationMs: 40,
            failurePhase: 'badge-refresh',
            failureDurationMs: 9,
            failureErrorClass: 'RangeError',
        }, 100);

        expect(phases[0]).toMatchObject({
            phase: 'relation-repair',
            durationMs: 40,
            errorClass: undefined,
        });
        expect(phases[1]).toMatchObject({
            phase: 'badge-refresh',
            durationMs: 9,
            errorClass: 'RangeError',
        });
    });
});

describe('resolvePostHistoryManualRepairResultMessage', () => {
    const base = {
        addedCount: 0,
        updatedCount: 2,
        processedRangeCount: 1,
        fetchFailed: false,
    };

    it('投稿が追加されたら追加件数を伝える', () => {
        expect(resolvePostHistoryManualRepairResultMessage(
            { ...base, addedCount: 4, fetchFailed: true },
            3,
        )).toEqual({
            key: 'postHistory.repairAdded',
            values: { count: 4, processedRangeCount: 1, updatedCount: 2 },
        });
    });

    it('投稿の追加がなく返信が保存されたら返信の件数を伝える', () => {
        expect(resolvePostHistoryManualRepairResultMessage(
            { ...base, fetchFailed: true },
            3,
        )).toEqual({
            key: 'postHistory.repairChildInteractionsAdded',
            values: { count: 3 },
        });
    });

    it('何も追加されず取得に失敗していたら失敗を伝える', () => {
        expect(resolvePostHistoryManualRepairResultMessage(
            { ...base, fetchFailed: true },
            0,
        )).toEqual({ key: 'postHistory.repairFetchFailed', values: null });
    });

    it('何も追加されず取得に成功していたら変更なしを伝える', () => {
        expect(resolvePostHistoryManualRepairResultMessage(base, 0)).toEqual({
            key: 'postHistory.repairNoChanges',
            values: { processedRangeCount: 1, updatedCount: 2 },
        });
    });
});

describe('resolvePostHistoryManualRepairFailure', () => {
    it('取得サービスがタグ付けしたエラーはそのフェーズと開始時刻を使う', () => {
        expect(resolvePostHistoryManualRepairFailure({
            error: {
                phase: 'primary-persist',
                phaseStartedAt: 55,
                errorClass: 'AbortError',
            },
            activePhaseStartedAt: 10,
            primaryRefetchReloadCompleted: true,
        })).toEqual({
            phase: 'primary-persist',
            startedAt: 55,
            errorClass: 'AbortError',
        });
    });

    it('タグのないエラーは再読み込み完了前なら primary-fetch に帰属する', () => {
        expect(resolvePostHistoryManualRepairFailure({
            error: new Error('boom'),
            activePhaseStartedAt: 10,
            primaryRefetchReloadCompleted: false,
        })).toEqual({
            phase: 'primary-fetch',
            startedAt: 10,
            errorClass: undefined,
        });
    });

    it('タグのないエラーは再読み込み完了後なら relation-repair に帰属する', () => {
        expect(resolvePostHistoryManualRepairFailure({
            error: 'boom',
            activePhaseStartedAt: 10,
            primaryRefetchReloadCompleted: true,
        }).phase).toBe('relation-repair');
    });

    it('取得以外のフェーズ名のタグは採用しない', () => {
        expect(resolvePostHistoryManualRepairFailure({
            error: { phase: 'badge-refresh' },
            activePhaseStartedAt: 10,
            primaryRefetchReloadCompleted: false,
        }).phase).toBe('primary-fetch');
    });
});
