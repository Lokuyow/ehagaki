import { describe, expect, it } from 'vitest';
import {
    addDeletedThreadGraphTargets,
    collectThreadGraphChildrenOfDeletedParent,
    isDeletedThreadGraphEvent,
    keepVisibleThreadGraphItems,
    removeThreadGraphEventFromRelations,
} from '../../lib/postHistoryThreadGraphDeletionState';

const ALICE = 'a'.repeat(64);
const BOB = 'b'.repeat(64);

describe('isDeletedThreadGraphEvent', () => {
    const deleted = { [ALICE]: { e1: true as const } };

    it('著者とイベント ID の組が記録されていれば削除済みと判定する', () => {
        expect(isDeletedThreadGraphEvent(deleted, ALICE, 'e1')).toBe(true);
    });

    it('別の著者の同じイベント ID は削除済みと判定しない', () => {
        expect(isDeletedThreadGraphEvent(deleted, BOB, 'e1')).toBe(false);
    });

    it('著者かイベント ID が欠けていれば削除済みと判定しない', () => {
        expect(isDeletedThreadGraphEvent(deleted, null, 'e1')).toBe(false);
        expect(isDeletedThreadGraphEvent(deleted, ALICE, undefined)).toBe(false);
    });
});

describe('addDeletedThreadGraphTargets', () => {
    it('新しい対象を著者ごとに追加し、元のオブジェクトは変更しない', () => {
        const current = { [ALICE]: { e1: true as const } };

        const next = addDeletedThreadGraphTargets(current, new Map([
            [ALICE, new Set(['e2'])],
            [BOB, new Set(['e3'])],
        ]));

        expect(next).toEqual({
            [ALICE]: { e1: true, e2: true },
            [BOB]: { e3: true },
        });
        expect(current).toEqual({ [ALICE]: { e1: true } });
    });

    it('すべて記録済みなら同じオブジェクトを返す', () => {
        const current = { [ALICE]: { e1: true as const } };

        expect(addDeletedThreadGraphTargets(
            current,
            new Map([[ALICE, new Set(['e1'])]]),
        )).toBe(current);
    });

    it('変更のない著者の記録は同じオブジェクトのまま保つ', () => {
        const aliceIds = { e1: true as const };
        const current = { [ALICE]: aliceIds };

        const next = addDeletedThreadGraphTargets(current, new Map([
            [ALICE, new Set(['e1'])],
            [BOB, new Set(['e3'])],
        ]));

        expect(next[ALICE]).toBe(aliceIds);
        expect(next[BOB]).toEqual({ e3: true });
    });
});

describe('removeThreadGraphEventFromRelations', () => {
    it('子の一覧と親への対応の両方からイベントを取り除く', () => {
        const relations = {
            childrenByParentId: { p1: ['c1', 'c2'], p2: ['c3'] },
            parentByChildId: { c1: 'p1', c2: 'p1', c3: 'p2' },
        };

        expect(removeThreadGraphEventFromRelations(relations, 'c1')).toEqual({
            childrenByParentId: { p1: ['c2'], p2: ['c3'] },
            parentByChildId: { c2: 'p1', c3: 'p2' },
        });
        expect(relations.childrenByParentId.p1).toEqual(['c1', 'c2']);
    });

    it('含まれていないイベントなら両方とも同じオブジェクトを返す', () => {
        const relations = {
            childrenByParentId: { p1: ['c1'] },
            parentByChildId: { c1: 'p1' },
        };

        const next = removeThreadGraphEventFromRelations(relations, 'x');

        expect(next.childrenByParentId).toBe(relations.childrenByParentId);
        expect(next.parentByChildId).toBe(relations.parentByChildId);
    });

    it('片方にしか含まれていなければ、もう片方は同じオブジェクトを返す', () => {
        const relations = {
            childrenByParentId: { p1: ['c1'] },
            parentByChildId: {},
        };

        const next = removeThreadGraphEventFromRelations(relations, 'c1');

        expect(next.childrenByParentId).toEqual({ p1: [] });
        expect(next.parentByChildId).toBe(relations.parentByChildId);
    });
});

describe('collectThreadGraphChildrenOfDeletedParent', () => {
    const parentByChildId = { c1: 'p1', c2: 'p1', c3: 'p2' };

    it('削除された親を持つ子をすべて集める', () => {
        expect(collectThreadGraphChildrenOfDeletedParent({
            parentByChildId,
            nodesById: { p1: { authorPubkey: ALICE } },
            eventId: 'p1',
            authorPubkey: ALICE,
        })).toEqual(new Set(['c1', 'c2']));
    });

    it('親ノードの著者が削除の著者と違えば集めない', () => {
        expect(collectThreadGraphChildrenOfDeletedParent({
            parentByChildId,
            nodesById: { p1: { authorPubkey: BOB } },
            eventId: 'p1',
            authorPubkey: ALICE,
        }).size).toBe(0);
    });

    it('親ノードが未取得か、削除の著者が不明なら著者を照合せずに集める', () => {
        expect(collectThreadGraphChildrenOfDeletedParent({
            parentByChildId,
            nodesById: {},
            eventId: 'p1',
            authorPubkey: ALICE,
        })).toEqual(new Set(['c1', 'c2']));
        expect(collectThreadGraphChildrenOfDeletedParent({
            parentByChildId,
            nodesById: { p1: { authorPubkey: BOB } },
            eventId: 'p1',
            authorPubkey: null,
        })).toEqual(new Set(['c1', 'c2']));
    });
});

describe('keepVisibleThreadGraphItems', () => {
    it('表示対象の ID を持つ要素だけを元の順序で残す', () => {
        const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

        expect(keepVisibleThreadGraphItems(
            items,
            new Set(['c', 'a']),
            (item) => item.id,
        )).toEqual([{ id: 'a' }, { id: 'c' }]);
    });
});
