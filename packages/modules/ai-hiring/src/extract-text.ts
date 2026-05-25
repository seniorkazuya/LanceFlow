/** Best-effort plain text from resume bytes (text/plain or naive PDF string extraction). */
export function extractResumeText(bytes: Buffer, mimeType: string | null): string {
  if (mimeType === 'text/plain') {
    return bytes.toString('utf8').trim();
  }

  const raw = bytes.toString('latin1');
  if (mimeType === 'application/pdf' || raw.startsWith('%PDF')) {
    const parenChunks = raw.match(/\(([^\\)]+)\)/g) ?? [];
    const fromPdf = parenChunks
      .map((chunk) => chunk.slice(1, -1).replace(/\\n/g, ' ').replace(/\\r/g, ' '))
      .join(' ');
    if (fromPdf.trim().length >= 40) {
      return fromPdf.replace(/\s+/g, ' ').trim();
    }
  }

  const ascii = raw.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
  return ascii.replace(/\s+/g, ' ').trim();
}
