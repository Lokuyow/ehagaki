type SenderCommand = {
    type: "iframe-message-gate.send";
    targetName: string;
    targetOrigin: string;
    message: unknown;
};

window.addEventListener("message", (event) => {
    const command = event.data as Partial<SenderCommand> | null;
    if (
        event.source !== window.parent
        || command?.type !== "iframe-message-gate.send"
        || typeof command.targetName !== "string"
        || typeof command.targetOrigin !== "string"
    ) {
        return;
    }

    const target = Array.from(window.parent.document.querySelectorAll("iframe"))
        .find((iframe) => iframe.name === command.targetName)
        ?.contentWindow;
    target?.postMessage(command.message, command.targetOrigin);
    window.parent.postMessage(
        { type: "iframe-message-gate.sender.sent" },
        event.origin,
    );
});
