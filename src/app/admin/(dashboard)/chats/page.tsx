import { requireDb } from "@/lib/db";
import { chatConfigured, CHAT_MODEL } from "@/lib/chat";
import { dateTime } from "@/lib/admin-ui";

export const metadata = { title: "Chat tư vấn" };

const PRODUCT_TOKEN = /\[\[product:([a-z0-9-]+)\]\]/g;

export default async function AdminChatsPage() {
  const { data, error } = await requireDb()
    .from("chat_messages")
    .select("*")
    .order("id", { ascending: false })
    .limit(600);
  if (error) throw error;

  const sessions = new Map<string, typeof data>();
  for (const m of data) {
    const arr = sessions.get(m.session_id) ?? [];
    arr.push(m);
    sessions.set(m.session_id, arr);
  }
  const ready = chatConfigured();
  const answers = data.filter((m) => m.role === "assistant");
  const canned = answers.filter((m) => m.source.startsWith("faq:")).length;
  const byRule = new Map<string, number>();
  for (const m of answers) if (m.source.startsWith("faq:")) byRule.set(m.source.slice(4), (byRule.get(m.source.slice(4)) ?? 0) + 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Chat tư vấn (AI)</h1>
        <p className="text-sm text-muted">
          Hội thoại giữa khách và trợ lý Hala trên website. Trợ lý chỉ trả lời dựa trên danh mục sản phẩm đang bật; dùng trang này để
          xem khách hỏi gì và sản phẩm nào cần bổ sung thông tin.
        </p>
      </div>

      {answers.length > 0 ? (
        <div className="kcard p-4 text-sm">
          <p className="font-bold">
            {answers.length} câu trả lời gần nhất · <span className="text-accent">{canned} trả lời sẵn (0 token)</span> · {answers.length - canned} qua AI
          </p>
          {byRule.size > 0 ? (
            <p className="mt-1 text-muted">
              Câu hỏi thường gặp:{" "}
              {[...byRule.entries()]
                .sort((a, b) => b[1] - a[1])
                .map(([k, n]) => `${k} (${n})`)
                .join(", ")}
              . Bộ câu trả lời sẵn nằm trong <code className="font-mono">src/lib/chat-faq.ts</code>.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className={`kcard p-4 text-sm ${ready ? "bg-tint-green" : "bg-tint-pink"}`}>
        <p className="font-bold">Trạng thái</p>
        <p className="mt-1 text-muted">
          {ready ? (
            <>
              Đang bật · model <code className="font-mono">{CHAT_MODEL}</code>. Đổi bằng biến <code className="font-mono">OPENAI_MODEL</code>.
            </>
          ) : (
            <>
              Chưa đặt <code className="font-mono">OPENAI_API_KEY</code> — nút chat vẫn hiện nhưng khách sẽ được báo tạm thời chưa sẵn sàng.
            </>
          )}
        </p>
      </div>

      {sessions.size === 0 ? (
        <p className="text-sm text-muted">Chưa có hội thoại nào.</p>
      ) : (
        <div className="space-y-4">
          {[...sessions.entries()].map(([sid, msgs]) => {
            const ordered = [...msgs].reverse();
            const first = ordered[0];
            const last = ordered[ordered.length - 1];
            return (
              <details key={sid} className="kcard overflow-hidden">
                <summary className="flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-sm">
                  <span className="font-mono text-xs text-muted">{sid.slice(0, 10)}…</span>
                  <span className="rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">{first.locale}</span>
                  <span className="font-semibold">{ordered.length / 2} lượt hỏi</span>
                  <span className="text-muted">
                    {dateTime(first.created_at)} → {dateTime(last.created_at)}
                  </span>
                  <span className="line-clamp-1 basis-full text-muted">{ordered.find((m) => m.role === "user")?.content}</span>
                </summary>
                <ol className="space-y-2 border-t-2 border-ink bg-bg px-5 py-4 text-sm">
                  {ordered.map((m) => (
                    <li key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`min-w-0 max-w-[80%] whitespace-pre-line break-words [overflow-wrap:anywhere] rounded-2xl border-2 border-ink px-3 py-2 ${
                          m.role === "user" ? "bg-ink text-white" : "bg-bg-elev"
                        }`}
                      >
                        {m.content.replace(PRODUCT_TOKEN, "[$1]")}
                        <div className={`mt-1 text-[10px] ${m.role === "user" ? "text-white/60" : "text-muted"}`}>
                          {dateTime(m.created_at)}
                          {m.role === "assistant" ? (
                            <span className={`ml-2 rounded px-1 font-bold uppercase ${m.source.startsWith("faq:") ? "bg-tint-green" : "bg-tint-yellow"}`}>
                              {m.source.startsWith("faq:") ? `Trả lời sẵn · ${m.source.slice(4)}` : "AI"}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
