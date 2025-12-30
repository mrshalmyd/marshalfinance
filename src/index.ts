/* ==========================================================================
   Cloudflare Worker: D1 Query + Static Assets
   ========================================================================== */

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher; // binding untuk static assets (sesuai wrangler.jsonc)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    /* ------------------------------------------------------------------
       API Handler untuk query D1
       ------------------------------------------------------------------ */
    if (path === "/api/query" && request.method === "POST") {
      try {
        const { sql, params } = await request.json();

        // Validasi input SQL
        if (!sql || typeof sql !== "string") {
          return Response.json(
            { success: false, error: "SQL tidak valid" },
            { status: 400 }
          );
        }

        // Siapkan statement
        const stmt = env.DB.prepare(sql);
        const bound = Array.isArray(params) && params.length
          ? stmt.bind(...params)
          : stmt;

        // Eksekusi query
        const { results } = await bound.all();

        return Response.json({ success: true, results });
      } catch (err: any) {
        return Response.json(
          { success: false, error: err.message || "Query gagal" },
          { status: 500 }
        );
      }
    }

    /* ------------------------------------------------------------------
       Fallback: semua route lain dilayani oleh ASSETS (static file)
       ------------------------------------------------------------------ */
    return env.ASSETS.fetch(request);
  },
};
