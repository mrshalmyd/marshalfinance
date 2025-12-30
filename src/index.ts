export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;  // ← tambah ini kalau perlu
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.startsWith('/api/') && path === '/api/query' && request.method === 'POST') {
      // ... kode query D1 kamu tetap sama ...
    }

    // Optional: kalau ingin Worker handle fallback sendiri (jarang dipakai)
    // return env.ASSETS.fetch(request);

    // Kalau tidak cocok /api, biarkan assets handler yang ambil alih
    return new Response('Not Found', { status: 404 });
  }
};