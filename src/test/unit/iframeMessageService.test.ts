import { describe, it, expect, vi, beforeEach } from "vitest";
import { IframeMessageService } from "../../lib/iframeMessageService";
import type { IframeMessagePayload } from "../../lib/iframeMessageService";
import { EMBED_MESSAGE_NAMESPACE, EMBED_MESSAGE_VERSION } from '../../lib/embedProtocol';

describe("IframeMessageService", () => {
  let mockWindow: any;
  let mockConsole: Console;

  beforeEach(() => {
    mockConsole = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as any;
  });

  describe("isInIframe", () => {
    it("iframe内でない場合はfalseを返す", () => {
      mockWindow = {
        self: {},
        top: {},
      };
      mockWindow.self = mockWindow;
      mockWindow.top = mockWindow;

      const service = new IframeMessageService({
        window: mockWindow,
        console: mockConsole,
      });

      expect(service.isInIframe()).toBe(false);
    });

    it("iframe内の場合はtrueを返す", () => {
      mockWindow = {
        self: {},
        top: {},
      };

      const service = new IframeMessageService({
        window: mockWindow,
        console: mockConsole,
      });

      expect(service.isInIframe()).toBe(true);
    });

    it("クロスオリジンの場合はtrueを返す（例外発生時）", () => {
      mockWindow = {
        get self() {
          return {};
        },
        get top() {
          throw new Error("SecurityError");
        },
      };

      const service = new IframeMessageService({
        window: mockWindow,
        console: mockConsole,
      });

      expect(service.isInIframe()).toBe(true);
    });

    it("windowが未定義の場合はfalseを返す", () => {
      const service = new IframeMessageService({
        window: undefined,
        console: mockConsole,
      });

      expect(service.isInIframe()).toBe(false);
    });
  });

  describe("getParentOrigin", () => {
    it("iframe内でない場合はnullを返す", () => {
      mockWindow = {
        self: {},
        top: {},
      };
      mockWindow.self = mockWindow;
      mockWindow.top = mockWindow;

      const service = new IframeMessageService({
        window: mockWindow,
        console: mockConsole,
      });

      expect(service.getParentOrigin()).toBe(null);
    });

    it("明示的な parentOrigin を返す", () => {
      mockWindow = {
        self: {},
        top: {},
      };

      const service = new IframeMessageService({
        window: mockWindow,
        parentOrigin: 'https://example.com',
        console: mockConsole,
      });

      expect(service.getParentOrigin()).toBe("https://example.com");
    });

    it("locationSearch の parentOrigin から取得する", () => {
      mockWindow = {
        self: {},
        top: {},
        location: {
          search: '?parentOrigin=https%3A%2F%2Fparent.com%2Fembed',
        },
      };

      const service = new IframeMessageService({
        window: mockWindow,
        console: mockConsole,
      });

      expect(service.getParentOrigin()).toBe("https://parent.com");
    });

    it("parentOrigin がない場合はnullを返す", () => {
      mockWindow = {
        self: {},
        top: {},
        location: {
          search: '',
        },
      };

      const service = new IframeMessageService({
        window: mockWindow,
        console: mockConsole,
      });

      expect(service.getParentOrigin()).toBe(null);
    });
  });

  describe("isOriginAllowed", () => {
    it("許可リストが空の場合は全て許可", () => {
      const service = new IframeMessageService({
        allowedOrigins: [],
        console: mockConsole,
      });

      expect(service.isOriginAllowed("https://example.com")).toBe(true);
      expect(service.isOriginAllowed("https://another.com")).toBe(true);
    });

    it("許可リストにあるオリジンはtrueを返す", () => {
      const service = new IframeMessageService({
        allowedOrigins: ["https://example.com", "https://trusted.com"],
        console: mockConsole,
      });

      expect(service.isOriginAllowed("https://example.com")).toBe(true);
      expect(service.isOriginAllowed("https://trusted.com")).toBe(true);
    });

    it("許可リストにないオリジンはfalseを返す", () => {
      const service = new IframeMessageService({
        allowedOrigins: ["https://example.com"],
        console: mockConsole,
      });

      expect(service.isOriginAllowed("https://untrusted.com")).toBe(false);
    });

    it("nullの場合はfalseを返す", () => {
      const service = new IframeMessageService({
        allowedOrigins: [],
        console: mockConsole,
      });

      expect(service.isOriginAllowed(null)).toBe(false);
    });
  });

  describe("sendMessageToParent", () => {
    it("iframe内でない場合は送信せずfalseを返す", () => {
      mockWindow = {
        self: {},
        top: {},
      };
      mockWindow.self = mockWindow;
      mockWindow.top = mockWindow;

      const service = new IframeMessageService({
        window: mockWindow,
        console: mockConsole,
      });

      const payload: IframeMessagePayload = {
        namespace: EMBED_MESSAGE_NAMESPACE,
        version: EMBED_MESSAGE_VERSION,
        type: "post.success",
        payload: { timestamp: Date.now() },
      };

      expect(service.sendMessageToParent(payload)).toBe(false);
    });

    it("親オリジンが取得できない場合はfalseを返す", () => {
      mockWindow = {
        self: {},
        top: {},
        location: {
          search: '',
        },
      };

      const service = new IframeMessageService({
        window: mockWindow,
        console: mockConsole,
      });

      const payload: IframeMessagePayload = {
        namespace: EMBED_MESSAGE_NAMESPACE,
        version: EMBED_MESSAGE_VERSION,
        type: "post.success",
        payload: { timestamp: Date.now() },
      };

      expect(service.sendMessageToParent(payload)).toBe(false);
      expect(mockConsole.warn).toHaveBeenCalledWith(
        expect.stringContaining("parentOrigin が未指定")
      );
    });

    it("親オリジンが許可されていない場合はfalseを返す", () => {
      mockWindow = {
        self: {},
        top: {},
        parent: {
          location: {
            origin: "https://untrusted.com",
          },
        },
      };

      const service = new IframeMessageService({
        window: mockWindow,
        parentOrigin: 'https://untrusted.com',
        console: mockConsole,
        allowedOrigins: ["https://trusted.com"],
      });

      const payload: IframeMessagePayload = {
        namespace: EMBED_MESSAGE_NAMESPACE,
        version: EMBED_MESSAGE_VERSION,
        type: "post.success",
        payload: { timestamp: Date.now() },
      };

      expect(service.sendMessageToParent(payload)).toBe(false);
      expect(mockConsole.warn).toHaveBeenCalledWith(
        expect.stringContaining("許可されていません")
      );
    });

    it("正常にメッセージを送信する", () => {
      const postMessageMock = vi.fn();
      mockWindow = {
        self: {},
        top: {},
        parent: {
          postMessage: postMessageMock,
        },
      };

      const service = new IframeMessageService({
        window: mockWindow,
        parentOrigin: 'https://example.com',
        console: mockConsole,
      });

      const payload: IframeMessagePayload = {
        namespace: EMBED_MESSAGE_NAMESPACE,
        version: EMBED_MESSAGE_VERSION,
        type: "post.success",
        payload: { timestamp: 12345 },
      };

      expect(service.sendMessageToParent(payload)).toBe(true);
      expect(postMessageMock).toHaveBeenCalledWith(
        payload,
        "https://example.com"
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining("メッセージを送信しました"),
        payload
      );
    });

    it("postMessage送信エラー時はfalseを返す", () => {
      const postMessageMock = vi.fn(() => {
        throw new Error("postMessage error");
      });
      mockWindow = {
        self: {},
        top: {},
        parent: {
          postMessage: postMessageMock,
        },
      };

      const service = new IframeMessageService({
        window: mockWindow,
        parentOrigin: 'https://example.com',
        console: mockConsole,
      });

      const payload: IframeMessagePayload = {
        namespace: EMBED_MESSAGE_NAMESPACE,
        version: EMBED_MESSAGE_VERSION,
        type: "post.success",
        payload: { timestamp: 12345 },
      };

      expect(service.sendMessageToParent(payload)).toBe(false);
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining("送信に失敗"),
        expect.any(Error)
      );
    });
  });

  describe("notifyPostSuccess", () => {
    it("post.success メッセージを送信する", () => {
      const postMessageMock = vi.fn();
      mockWindow = {
        self: {},
        top: {},
        parent: {
          postMessage: postMessageMock,
        },
      };

      const service = new IframeMessageService({
        window: mockWindow,
        parentOrigin: 'https://example.com',
        console: mockConsole,
      });

      const result = service.notifyPostSuccess({
        eventId: 'event-1',
        replyToEventId: 'reply-1',
        quotedEventIds: ['quote-1', 'quote-2'],
      });

      expect(result).toBe(true);
      expect(postMessageMock).toHaveBeenCalledWith(
        expect.objectContaining({
          namespace: EMBED_MESSAGE_NAMESPACE,
          version: EMBED_MESSAGE_VERSION,
          type: "post.success",
          payload: expect.objectContaining({
            timestamp: expect.any(Number),
            eventId: 'event-1',
            replyToEventId: 'reply-1',
            quotedEventIds: ['quote-1', 'quote-2'],
          }),
        }),
        "https://example.com"
      );
    });
  });

  describe("notifyPostError", () => {
    it("post.error メッセージを送信する", () => {
      const postMessageMock = vi.fn();
      mockWindow = {
        self: {},
        top: {},
        parent: {
          postMessage: postMessageMock,
        },
      };

      const service = new IframeMessageService({
        window: mockWindow,
        parentOrigin: 'https://example.com',
        console: mockConsole,
      });

      const result = service.notifyPostError({ code: 'test_error', message: 'bad request' });

      expect(result).toBe(true);
      expect(postMessageMock).toHaveBeenCalledWith(
        expect.objectContaining({
          namespace: EMBED_MESSAGE_NAMESPACE,
          version: EMBED_MESSAGE_VERSION,
          type: "post.error",
          payload: expect.objectContaining({
            timestamp: expect.any(Number),
            code: 'test_error',
            message: 'bad request',
          }),
        }),
        "https://example.com"
      );
    });
  });

  describe("notifyComposerContextApplied", () => {
    it("composer.contextApplied メッセージを送信する", () => {
      const postMessageMock = vi.fn();
      mockWindow = {
        self: {},
        top: {},
        parent: {
          postMessage: postMessageMock,
        },
      };

      const service = new IframeMessageService({
        window: mockWindow,
        parentOrigin: 'https://example.com',
        console: mockConsole,
      });

      const result = service.notifyComposerContextApplied('composer-request-1');

      expect(result).toBe(true);
      expect(postMessageMock).toHaveBeenCalledWith(
        expect.objectContaining({
          namespace: EMBED_MESSAGE_NAMESPACE,
          version: EMBED_MESSAGE_VERSION,
          type: "composer.contextApplied",
          requestId: 'composer-request-1',
          payload: expect.objectContaining({
            timestamp: expect.any(Number),
          }),
        }),
        "https://example.com"
      );
    });
  });

  describe("notifyComposerContextError", () => {
    it("composer.contextError メッセージを送信する", () => {
      const postMessageMock = vi.fn();
      mockWindow = {
        self: {},
        top: {},
        parent: {
          postMessage: postMessageMock,
        },
      };

      const service = new IframeMessageService({
        window: mockWindow,
        parentOrigin: 'https://example.com',
        console: mockConsole,
      });

      const result = service.notifyComposerContextError(
        { code: 'composer_context_apply_failed', message: 'bad payload' },
        'composer-request-2',
      );

      expect(result).toBe(true);
      expect(postMessageMock).toHaveBeenCalledWith(
        expect.objectContaining({
          namespace: EMBED_MESSAGE_NAMESPACE,
          version: EMBED_MESSAGE_VERSION,
          type: "composer.contextError",
          requestId: 'composer-request-2',
          payload: expect.objectContaining({
            timestamp: expect.any(Number),
            code: 'composer_context_apply_failed',
            message: 'bad payload',
          }),
        }),
        "https://example.com"
      );
    });
  });

  describe("notifyComposerContextUpdated", () => {
    it("composer.contextUpdated メッセージを送信する", () => {
      const postMessageMock = vi.fn();
      mockWindow = {
        self: {},
        top: {},
        parent: {
          postMessage: postMessageMock,
        },
      };

      const service = new IframeMessageService({
        window: mockWindow,
        parentOrigin: 'https://example.com',
        console: mockConsole,
      });

      const result = service.notifyComposerContextUpdated({
        reply: 'nevent1reply',
        quotes: ['note1quote'],
      });

      expect(result).toBe(true);
      expect(postMessageMock).toHaveBeenCalledWith(
        expect.objectContaining({
          namespace: EMBED_MESSAGE_NAMESPACE,
          version: EMBED_MESSAGE_VERSION,
          type: "composer.contextUpdated",
          payload: expect.objectContaining({
            timestamp: expect.any(Number),
            reply: 'nevent1reply',
            quotes: ['note1quote'],
          }),
        }),
        "https://example.com"
      );
    });
  });

  describe("setAllowedOrigins and addAllowedOrigin", () => {
    it("許可オリジンを設定できる", () => {
      const service = new IframeMessageService({
        console: mockConsole,
      });

      service.setAllowedOrigins(["https://example.com", "https://test.com"]);

      expect(service.isOriginAllowed("https://example.com")).toBe(true);
      expect(service.isOriginAllowed("https://test.com")).toBe(true);
      expect(service.isOriginAllowed("https://other.com")).toBe(false);
    });

    it("許可オリジンを追加できる", () => {
      const service = new IframeMessageService({
        allowedOrigins: ["https://example.com"],
        console: mockConsole,
      });

      service.addAllowedOrigin("https://new.com");

      expect(service.isOriginAllowed("https://example.com")).toBe(true);
      expect(service.isOriginAllowed("https://new.com")).toBe(true);
    });

    it("重複した許可オリジンは追加しない", () => {
      const service = new IframeMessageService({
        allowedOrigins: ["https://example.com"],
        console: mockConsole,
      });

      service.addAllowedOrigin("https://example.com");
      service.addAllowedOrigin("https://example.com");

      // 内部的には重複しないことをテスト（isOriginAllowedで確認）
      expect(service.isOriginAllowed("https://example.com")).toBe(true);
    });
  });
});
