self.addEventListener('fetch', (event) => {
    const fetchEvent = event;
    const url = new URL(fetchEvent.request.url);
    if (fetchEvent.request.method === 'POST' && url.pathname === '/upload') {
        fetchEvent.respondWith(
            (async () => {
                const formData = await fetchEvent.request.formData();
                const image = formData.get('image');
                // 画像データをクライアントに送信
                const allClients = await self.clients.matchAll();
                // Send image data to all clients
                allClients.forEach((client) => {
                    client.postMessage({ image });
                });
                // アップロード後のリダイレクト先
                return Response.redirect('/ehagaki/', 303);
            })()
        );
    }
});