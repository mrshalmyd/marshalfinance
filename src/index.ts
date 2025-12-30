export interface Env {
  DB: finance_db;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Contoh endpoint: /api/query
    if (path === '/api/query' && request.method === 'POST') {
      try {
        const { sql, params } = await request.json<{ sql: string; params?: any[] }>();
        const stmt = env.DB.prepare(sql);
        const result = params ? await stmt.bind(...params).all() : await stmt.all();

        return Response.json({ success: true, results: result.results, meta: result.meta });
      } catch (e: any) {
        return Response.json({ success: false, error: e.message }, { status: 500 });
      }
    }

    return new Response('Not Found', { status: 404 });
  }
};