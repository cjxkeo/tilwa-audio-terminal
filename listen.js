export async function onRequestGet(context) {
    const { env, request } = context;
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return new Response(JSON.stringify({ error: 'Code parameter required' }), { status: 400 });
    }

    // Grab the stored JSON directly out of KV
    const trackDataString = await env.TILWA_DB.get(code);
    if (!trackDataString) {
        return new Response(JSON.stringify({ error: 'Track not found' }), { status: 404 });
    }

    return new Response(trackDataString, {
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}