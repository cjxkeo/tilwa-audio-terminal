export async function onRequestPost(context) {
    try {
        const { env, request } = context;
        
        // Parse the JSON data sent from the terminal frontend
        const { fileName, fileType, fileData } = await request.json();
        
        if (!fileData) {
            return new Response(JSON.stringify({ error: 'No file data received' }), { status: 400 });
        }

        // Generate our unique 9-character code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let uniqueCode = '';
        for (let i = 0; i < 9; i++) {
            uniqueCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Save everything directly into the KV namespace
        const payload = {
            name: fileName,
            type: fileType,
            data: fileData // This is the Base64 encoded audio string
        };
        
        await env.TILWA_DB.put(uniqueCode, JSON.stringify(payload));

        return new Response(JSON.stringify({ code: uniqueCode, name: fileName }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}