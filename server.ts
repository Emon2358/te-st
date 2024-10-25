import * as mod from "https://deno.land/std@0.224.0/http/server.ts";

const handler = async (request: Request): Promise<Response> => {
  if (request.method === "POST" && request.url.endsWith("/proxy")) {
    const { url } = await request.json();

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
          "Accept": "*/*",
        },
      });

      const body = await response.text();
      
      // CORSヘッダーを追加
      const headers = new Headers(response.headers);
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set("Access-Control-Allow-Methods", "GET, POST");
      headers.set("Access-Control-Allow-Headers", "Content-Type");

      return new Response(body, {
        headers,
      });
    } catch (error) {
      return new Response("Error fetching the URL", { status: 500 });
    }
  }

  return new Response("Not Found", { status: 404 });
};

mod.serve(handler);

