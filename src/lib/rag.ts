const STOP = new Set(
  "what,when,where,who,whom,whose,which,how,does,do,is,are,was,were,be,the,a,an,of,for,to,in,on,at,by,with,about,into,give,tell,me,please,show,list,need,want,know,our,your,its,and,or,but,from,as,also,per,any,all".split(",")
);

export function queryTerms(q: string): string[] {
  return (
    q
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w))
      .slice(0, 8)
  );
}

export function chunkText(text: string, size = 1200, overlap = 150): string[] {
  const clean = text.replace(/\r/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  if (!clean) return [];
  const chunks: string[] = [];
  let i = 0;
  while (i < clean.length && chunks.length < 60) {
    let end = Math.min(i + size, clean.length);
    if (end < clean.length) {
      const cut = clean.lastIndexOf("\n", end);
      if (cut > i + size * 0.5) end = cut;
    }
    chunks.push(clean.slice(i, end).trim());
    i = end - overlap;
    if (i < 0) i = 0;
    if (end >= clean.length) break;
  }
  return chunks.filter((c) => c.length > 40);
}

export async function extractText(buf: Buffer, ext: string, mime: string): Promise<string> {
  try {
    if (ext === "pdf") {
      const mod: any = await import("pdf-parse");
      const out = await (mod.default || mod)(buf);
      return out.text || "";
    }
    if (ext === "docx") {
      const mammoth = await import("mammoth");
      const out = await mammoth.extractRawText({ buffer: buf });
      return out.value || "";
    }
    if (ext === "xlsx" || ext === "xls") {
      const XLSX = await import("xlsx");
      const wb = XLSX.read(buf, { type: "buffer" });
      return wb.SheetNames.map((n) => `## Sheet: ${n}\n` + XLSX.utils.sheet_to_csv(wb.Sheets[n])).join("\n");
    }
    if (ext === "csv" || ext === "txt") return buf.toString("utf8");
  } catch (e) {
    console.error("extract failed", ext, e);
  }
  return "";
}

export function scoreChunk(content: string, terms: string[]): number {
  const low = content.toLowerCase();
  let s = 0;
  for (const t of terms) {
    let idx = low.indexOf(t);
    let hits = 0;
    while (idx !== -1 && hits < 5) {
      hits++;
      s += t.length > 5 ? 3 : 1;
      idx = low.indexOf(t, idx + 1);
    }
    if (low.includes(t + " ") || low.includes(" " + t)) s += 1;
  }
  return s;
}
