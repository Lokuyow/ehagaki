/**
 * 複数画像同時アップロード - UniqueID統合テスト
 * 
 * 目的:
 * - 複数画像を同時にアップロードした際、各画像ノードが一意のIDを持つことを検証
 * - プレースホルダーの検索・置換が正しく動作することを検証
 * - 画像の削除が正しいノードをターゲットにすることを検証
 * 
 * 背景:
 * UniqueID extensionを導入する前は、プレースホルダーのid属性が競合し、
 * 複数画像アップロード時に同じ画像が重複表示される不具合があった。
 * 
 * 修正内容:
 * 1. プレースホルダー作成時にid属性を設定しない（UniqueID extensionに任せる）
 * 2. プレースホルダー検索はsrc属性のみを使用
 * 3. 削除時はUniqueID extensionが生成したid属性を使用
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import UniqueID from '@tiptap/extension-unique-id';

// PWA関連のモック
vi.mock("virtual:pwa-register/svelte", () => ({
    useRegisterSW: () => ({
        needRefresh: false,
        updateServiceWorker: vi.fn()
    })
}));

describe('複数画像同時アップロード - UniqueID統合テスト', () => {
    let editor: Editor;

    beforeEach(() => {
        // UniqueID extensionを含む実際のエディターを作成
        editor = new Editor({
            extensions: [
                StarterKit,
                Image.configure({
                    HTMLAttributes: {
                        class: 'editor-image',
                    },
                    allowBase64: false,
                }).extend({
                    addAttributes() {
                        return {
                            src: { default: null },
                            isPlaceholder: { default: null },
                            dim: { default: null },
                        };
                    },
                }),
                UniqueID.configure({
                    types: ['image'],
                    attributeName: 'id',
                }),
            ],
            content: '<p></p>',
        });
    });

    describe('UniqueID extensionの動作確認', () => {
        it('画像ノード作成時にUniqueID extensionが自動的にIDを付与すること', () => {
            const { state } = editor;
            const { schema } = state;

            // トランザクションで画像ノードを3つ挿入
            const img1 = schema.nodes.image.create({ src: 'image1.png' });
            const img2 = schema.nodes.image.create({ src: 'image2.png' });
            const img3 = schema.nodes.image.create({ src: 'image3.png' });

            const tr = state.tr
                .insert(1, img1)
                .insert(2, img2)
                .insert(3, img3);

            editor.view.dispatch(tr);

            const imageNodes: Array<{ id: string; src: string }> = [];
            
            editor.state.doc.descendants((node: any) => {
                if (node.type.name === 'image') {
                    imageNodes.push({
                        id: node.attrs.id,
                        src: node.attrs.src
                    });
                }
            });

            // 3つの画像ノードが存在すること
            expect(imageNodes).toHaveLength(3);

            // 各ノードが一意のIDを持つこと
            const ids = imageNodes.map(n => n.id).filter(Boolean);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(3);

            // すべてのノードにIDが設定されていること
            imageNodes.forEach(node => {
                expect(node.id).toBeDefined();
                expect(node.id).not.toBeNull();
                expect(typeof node.id).toBe('string');
                expect(node.id.length).toBeGreaterThan(0);
            });
        });

        it('id属性を明示的に設定しない場合でもUniqueIDが自動生成されること', () => {
            const { state } = editor;
            const { schema } = state;

            // id属性を設定せずに画像ノードを作成
            const imageNode1 = schema.nodes.image.create({
                src: 'placeholder-1',
                isPlaceholder: true
            });

            const imageNode2 = schema.nodes.image.create({
                src: 'placeholder-2',
                isPlaceholder: true
            });

            const tr = state.tr
                .insert(1, imageNode1)
                .insert(2, imageNode2);

            editor.view.dispatch(tr);

            // ノードを取得してIDを確認
            const nodes: any[] = [];
            editor.state.doc.descendants((node) => {
                if (node.type.name === 'image') {
                    nodes.push(node);
                }
            });

            expect(nodes).toHaveLength(2);
            
            // UniqueID extensionによってIDが自動生成されていること
            expect(nodes[0].attrs.id).toBeDefined();
            expect(nodes[1].attrs.id).toBeDefined();
            
            // IDが異なること（一意性の確認）
            expect(nodes[0].attrs.id).not.toBe(nodes[1].attrs.id);
        });
    });

    describe('プレースホルダーの検索と置換', () => {
        it('src属性でプレースホルダーを検索し、正しいノードを置換できること', () => {
            const { state } = editor;
            const { schema } = state;

            // プレースホルダーを3つ挿入（id属性は設定しない）
            const placeholder1 = schema.nodes.image.create({
                src: 'placeholder-123',
                isPlaceholder: true
            });
            const placeholder2 = schema.nodes.image.create({
                src: 'placeholder-456',
                isPlaceholder: true
            });
            const placeholder3 = schema.nodes.image.create({
                src: 'placeholder-789',
                isPlaceholder: true
            });

            let tr = state.tr
                .insert(1, placeholder1)
                .insert(2, placeholder2)
                .insert(3, placeholder3);

            editor.view.dispatch(tr);

            // src属性で2番目のプレースホルダーを検索して置換
            let found = false;
            let nodePos = -1;

            editor.state.doc.descendants((node, pos) => {
                if (!found && node.type.name === 'image' && node.attrs.src === 'placeholder-456') {
                    found = true;
                    nodePos = pos;
                    return false;
                }
            });

            expect(found).toBe(true);
            expect(nodePos).toBeGreaterThan(-1);

            // ノードを置換
            const updatedAttrs = {
                ...editor.state.doc.nodeAt(nodePos)!.attrs,
                src: 'https://example.com/final-image.png',
                isPlaceholder: false
            };

            tr = editor.state.tr.setNodeMarkup(nodePos, undefined, updatedAttrs);
            editor.view.dispatch(tr);

            // 置換後のノードを確認
            const replacedNode = editor.state.doc.nodeAt(nodePos);
            expect(replacedNode).toBeDefined();
            expect(replacedNode!.attrs.src).toBe('https://example.com/final-image.png');
            expect(replacedNode!.attrs.isPlaceholder).toBe(false);
            
            // IDは変更されていないこと（UniqueID extensionが生成したIDを保持）
            expect(replacedNode!.attrs.id).toBeDefined();
            expect(replacedNode!.attrs.id).not.toBe('placeholder-456');

            // 他のプレースホルダーは影響を受けていないこと
            const allNodes: any[] = [];
            editor.state.doc.descendants((node) => {
                if (node.type.name === 'image') {
                    allNodes.push(node);
                }
            });

            expect(allNodes).toHaveLength(3);
            expect(allNodes.filter(n => n.attrs.isPlaceholder === true)).toHaveLength(2);
            expect(allNodes.filter(n => n.attrs.isPlaceholder === false)).toHaveLength(1);
        });

        it('複数のプレースホルダーを順番に置換できること', () => {
            const { state } = editor;
            const { schema } = state;

            const placeholders = [
                { src: 'placeholder-001', final: 'https://example.com/image1.png' },
                { src: 'placeholder-002', final: 'https://example.com/image2.png' },
                { src: 'placeholder-003', final: 'https://example.com/image3.png' },
            ];

            // プレースホルダーを挿入
            let tr = state.tr;
            placeholders.forEach((p, index) => {
                const node = schema.nodes.image.create({
                    src: p.src,
                    isPlaceholder: true
                });
                tr = tr.insert(index + 1, node);
            });
            editor.view.dispatch(tr);

            // 各プレースホルダーを順番に置換
            placeholders.forEach((p) => {
                let found = false;
                let nodePos = -1;

                editor.state.doc.descendants((node: any, pos: number) => {
                    if (!found && node.type.name === 'image' && node.attrs.src === p.src) {
                        found = true;
                        nodePos = pos;
                        return false;
                    }
                });

                expect(found).toBe(true);

                const updatedAttrs = {
                    ...editor.state.doc.nodeAt(nodePos)!.attrs,
                    src: p.final,
                    isPlaceholder: false
                };

                const replaceTr = editor.state.tr.setNodeMarkup(nodePos, undefined, updatedAttrs);
                editor.view.dispatch(replaceTr);
            });

            // すべてのノードが正しく置換されたことを確認
            const finalNodes: any[] = [];
            editor.state.doc.descendants((node: any) => {
                if (node.type.name === 'image') {
                    finalNodes.push(node);
                }
            });

            expect(finalNodes).toHaveLength(3);
            expect(finalNodes.every((n: any) => n.attrs.isPlaceholder === false)).toBe(true);
            
            // 順序が保持されているか確認（ProseMirrorの内部構造により順序が変わる可能性があるため、内容のみ確認）
            const srcs = finalNodes.map((n: any) => n.attrs.src).sort();
            expect(srcs).toEqual([
                'https://example.com/image1.png',
                'https://example.com/image2.png',
                'https://example.com/image3.png',
            ]);

            // すべてのノードが一意のIDを持つこと
            const ids = finalNodes.map((n: any) => n.attrs.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(3);
        });
    });

    describe('画像ノードの削除', () => {
        it('id属性を使用して特定の画像ノードを削除できること', () => {
            const { state } = editor;
            const { schema } = state;

            // 3つの画像を挿入
            const tr = state.tr
                .insert(1, schema.nodes.image.create({ src: 'image1.png' }))
                .insert(2, schema.nodes.image.create({ src: 'image2.png' }))
                .insert(3, schema.nodes.image.create({ src: 'image3.png' }));

            editor.view.dispatch(tr);

            // image2.pngのIDを取得（順序ではなくsrcで識別）
            let targetId: string | null = null;
            let targetSrc: string | null = null;

            editor.state.doc.descendants((node: any, pos: number) => {
                if (node.type.name === 'image' && node.attrs.src === 'image2.png') {
                    targetId = node.attrs.id;
                    targetSrc = node.attrs.src;
                    return false;
                }
            });

            expect(targetId).not.toBeNull();
            expect(targetSrc).toBe('image2.png');

            // 削除前のノード数を確認
            const beforeDelete = editor.state.doc.content.size;

            // id属性を使用して特定のノードを削除
            // descendantsで見つけたposを使って削除（descendantsの中でdispatchしない）
            let deletePos = -1;
            let nodeSize = 0;
            editor.state.doc.descendants((node: any, pos: number) => {
                if (deletePos === -1 && node.type.name === 'image' && node.attrs.id === targetId) {
                    deletePos = pos;
                    nodeSize = node.nodeSize;
                    return false;
                }
            });

            expect(deletePos).toBeGreaterThan(-1);
            
            // 削除トランザクションを実行
            const deleteTr = editor.state.tr.delete(deletePos, deletePos + nodeSize);
            editor.view.dispatch(deleteTr);

            // 削除後のノード数を確認
            const afterDelete = editor.state.doc.content.size;
            expect(afterDelete).toBeLessThan(beforeDelete);

            // 残りの画像ノードを確認
            const remainingNodes: any[] = [];
            editor.state.doc.descendants((node: any) => {
                if (node.type.name === 'image') {
                    remainingNodes.push(node);
                }
            });

            expect(remainingNodes).toHaveLength(2);
            
            // 削除されたノード（image2.png）が存在しないこと
            expect(remainingNodes.every(n => n.attrs.src !== 'image2.png')).toBe(true);
            
            // 残りのノードが image1.png と image3.png であること（順序不問）
            const srcs = remainingNodes.map(n => n.attrs.src).sort();
            expect(srcs).toEqual(['image1.png', 'image3.png']);
            
            // 削除されたノードが残っていないこと
            expect(remainingNodes.every(n => n.attrs.id !== targetId)).toBe(true);
        });

        it('複数の画像から任意の画像を削除しても正しいノードが削除されること', () => {
            const { state } = editor;
            const { schema } = state;
            
            const images = [
                { src: 'image-a.png' },
                { src: 'image-b.png' },
                { src: 'image-c.png' },
                { src: 'image-d.png' },
                { src: 'image-e.png' },
            ];

            // 5つの画像を挿入
            let tr = state.tr;
            images.forEach((img, index) => {
                tr = tr.insert(index + 1, schema.nodes.image.create(img));
            });
            editor.view.dispatch(tr);

            // すべての画像ノードのIDとsrcを記録
            const nodeMap: Array<{ id: string; src: string }> = [];
            editor.state.doc.descendants((node: any) => {
                if (node.type.name === 'image') {
                    nodeMap.push({
                        id: node.attrs.id,
                        src: node.attrs.src
                    });
                }
            });

            expect(nodeMap).toHaveLength(5);

            // 3番目の画像（image-c.png）を削除
            const targetNode = nodeMap.find(n => n.src === 'image-c.png');
            expect(targetNode).toBeDefined();
            
            let found = false;

            editor.state.doc.descendants((node: any, pos: number) => {
                if (!found && node.type.name === 'image' && node.attrs.id === targetNode!.id) {
                    const tr = editor.state.tr.delete(pos, pos + node.nodeSize);
                    editor.view.dispatch(tr);
                    found = true;
                    return false;
                }
            });

            expect(found).toBe(true);

            // 残りの画像を確認
            const remainingNodes: any[] = [];
            editor.state.doc.descendants((node: any) => {
                if (node.type.name === 'image') {
                    remainingNodes.push(node);
                }
            });

            expect(remainingNodes).toHaveLength(4);
            
            // 正しいノードが削除されたことを確認（image-c.pngが存在しない）
            expect(remainingNodes.every(n => n.attrs.src !== 'image-c.png')).toBe(true);
            expect(remainingNodes.every(n => n.attrs.id !== targetNode!.id)).toBe(true);
            
            // 残りのノードの内容を確認（順序不問）
            const srcs = remainingNodes.map(n => n.attrs.src).sort();
            expect(srcs).toEqual([
                'image-a.png',
                'image-b.png',
                'image-d.png',
                'image-e.png',
            ]);
        });
    });

    describe('エッジケースとリグレッション防止', () => {
        it('同じsrc属性を持つ画像でもid属性が異なること', () => {
            const { state } = editor;
            const { schema } = state;
            
            // 同じsrcで3つの画像を挿入（コピー&ペーストのシナリオ）
            const sameSrc = 'https://example.com/same-image.png';
            
            const tr = state.tr
                .insert(1, schema.nodes.image.create({ src: sameSrc }))
                .insert(2, schema.nodes.image.create({ src: sameSrc }))
                .insert(3, schema.nodes.image.create({ src: sameSrc }));

            editor.view.dispatch(tr);

            const nodes: any[] = [];
            editor.state.doc.descendants((node: any) => {
                if (node.type.name === 'image') {
                    nodes.push(node);
                }
            });

            expect(nodes).toHaveLength(3);
            
            // すべて同じsrc
            expect(nodes.every(n => n.attrs.src === sameSrc)).toBe(true);
            
            // しかしIDは異なる
            const ids = nodes.map(n => n.attrs.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(3);
        });

        it('プレースホルダー置換後もid属性の一意性が保たれること', () => {
            const { state } = editor;
            const { schema } = state;

            // 3つのプレースホルダーを挿入
            let tr = state.tr;
            for (let i = 1; i <= 3; i++) {
                const node = schema.nodes.image.create({
                    src: `placeholder-${i}`,
                    isPlaceholder: true
                });
                tr = tr.insert(i, node);
            }
            editor.view.dispatch(tr);

            // 挿入直後のIDを記録
            const originalIds: string[] = [];
            editor.state.doc.descendants((node) => {
                if (node.type.name === 'image') {
                    originalIds.push(node.attrs.id);
                }
            });

            // すべてのプレースホルダーを置換
            for (let i = 1; i <= 3; i++) {
                let found = false;
                let nodePos = -1;

                editor.state.doc.descendants((node, pos) => {
                    if (!found && node.type.name === 'image' && node.attrs.src === `placeholder-${i}`) {
                        found = true;
                        nodePos = pos;
                        return false;
                    }
                });

                const updatedAttrs = {
                    ...editor.state.doc.nodeAt(nodePos)!.attrs,
                    src: `https://example.com/final-${i}.png`,
                    isPlaceholder: false
                };

                const replaceTr = editor.state.tr.setNodeMarkup(nodePos, undefined, updatedAttrs);
                editor.view.dispatch(replaceTr);
            }

            // 置換後のIDを確認
            const finalIds: string[] = [];
            editor.state.doc.descendants((node) => {
                if (node.type.name === 'image') {
                    finalIds.push(node.attrs.id);
                }
            });

            // ID数が変わらないこと
            expect(finalIds).toHaveLength(3);
            
            // IDが保持されていること（UniqueID extensionが生成したIDを維持）
            expect(finalIds).toEqual(originalIds);
            
            // 一意性が保たれていること
            const uniqueFinalIds = new Set(finalIds);
            expect(uniqueFinalIds.size).toBe(3);
        });

        it('大量の画像を同時にアップロードしてもid属性の一意性が保証されること', () => {
            const imageCount = 20;
            const { state } = editor;
            const { schema } = state;

            // 20個のプレースホルダーを一度に挿入
            let tr = state.tr;
            for (let i = 1; i <= imageCount; i++) {
                const node = schema.nodes.image.create({
                    src: `placeholder-${i.toString().padStart(3, '0')}`,
                    isPlaceholder: true
                });
                tr = tr.insert(i, node);
            }
            editor.view.dispatch(tr);

            // すべてのノードのIDを収集
            const allIds: string[] = [];
            editor.state.doc.descendants((node: any) => {
                if (node.type.name === 'image') {
                    allIds.push(node.attrs.id);
                }
            });

            // ノード数の確認
            expect(allIds).toHaveLength(imageCount);
            
            // すべてのIDが一意であることを確認
            const uniqueIds = new Set(allIds);
            expect(uniqueIds.size).toBe(imageCount);
            
            // すべてのIDが定義されていることを確認
            expect(allIds.every(id => id && id.length > 0)).toBe(true);
        });

        it('プレースホルダーの部分置換が他のノードに影響を与えないこと', () => {
            const { state } = editor;
            const { schema } = state;

            // 5つのプレースホルダーを挿入
            let tr = state.tr;
            for (let i = 1; i <= 5; i++) {
                const node = schema.nodes.image.create({
                    src: `placeholder-${i}`,
                    isPlaceholder: true
                });
                tr = tr.insert(i, node);
            }
            editor.view.dispatch(tr);

            // 全ノードの初期状態を記録
            const initialState: Array<{ id: string; src: string; isPlaceholder: boolean }> = [];
            editor.state.doc.descendants((node: any) => {
                if (node.type.name === 'image') {
                    initialState.push({
                        id: node.attrs.id,
                        src: node.attrs.src,
                        isPlaceholder: node.attrs.isPlaceholder
                    });
                }
            });

            // 2番目と4番目のプレースホルダーのみを置換
            [2, 4].forEach((targetIndex) => {
                const targetSrc = `placeholder-${targetIndex}`;
                let found = false;
                let nodePos = -1;

                editor.state.doc.descendants((node: any, pos: number) => {
                    if (!found && node.type.name === 'image' && node.attrs.src === targetSrc) {
                        found = true;
                        nodePos = pos;
                        return false;
                    }
                });

                const updatedAttrs = {
                    ...editor.state.doc.nodeAt(nodePos)!.attrs,
                    src: `https://example.com/final-${targetIndex}.png`,
                    isPlaceholder: false
                };

                const replaceTr = editor.state.tr.setNodeMarkup(nodePos, undefined, updatedAttrs);
                editor.view.dispatch(replaceTr);
            });

            // 置換後の状態を確認
            const finalNodes: any[] = [];
            editor.state.doc.descendants((node: any) => {
                if (node.type.name === 'image') {
                    finalNodes.push(node);
                }
            });

            expect(finalNodes).toHaveLength(5);

            // src属性で置換されたノードを確認
            const finalNode2 = finalNodes.find((n: any) => n.attrs.src === 'https://example.com/final-2.png');
            const finalNode4 = finalNodes.find((n: any) => n.attrs.src === 'https://example.com/final-4.png');
            
            expect(finalNode2).toBeDefined();
            expect(finalNode2?.attrs.isPlaceholder).toBe(false);
            expect(finalNode4).toBeDefined();
            expect(finalNode4?.attrs.isPlaceholder).toBe(false);

            // 未置換のノード（1, 3, 5番目）が影響を受けていないこと
            const placeholder1 = finalNodes.find((n: any) => n.attrs.src === 'placeholder-1');
            const placeholder3 = finalNodes.find((n: any) => n.attrs.src === 'placeholder-3');
            const placeholder5 = finalNodes.find((n: any) => n.attrs.src === 'placeholder-5');
            
            expect(placeholder1).toBeDefined();
            expect(placeholder1?.attrs.isPlaceholder).toBe(true);
            expect(placeholder3).toBeDefined();
            expect(placeholder3?.attrs.isPlaceholder).toBe(true);
            expect(placeholder5).toBeDefined();
            expect(placeholder5?.attrs.isPlaceholder).toBe(true);

            // すべてのノードのIDが初期状態と同じであること
            finalNodes.forEach((node: any) => {
                const initial = initialState.find(s => s.id === node.attrs.id);
                expect(initial).toBeDefined();
            });
        });
    });
});
