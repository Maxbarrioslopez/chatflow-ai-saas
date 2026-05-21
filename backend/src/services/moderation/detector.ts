export function normalizeValue(value: string): string {
  return value.toLowerCase().trim();
}

export function matchText(text: string, rule: string, mode: string, caseSensitive: boolean): boolean {
  const t = caseSensitive ? text : text.toLowerCase();
  const r = caseSensitive ? rule : rule.toLowerCase();

  switch (mode) {
    case 'EXACT': return t === r;
    case 'CONTAINS': return t.includes(r);
    case 'REGEX': {
      try { return new RegExp(r, caseSensitive ? '' : 'i').test(t); }
      catch { return false; }
    }
    case 'STARTS_WITH': return t.startsWith(r);
    case 'ENDS_WITH': return t.endsWith(r);
    default: return t.includes(r);
  }
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /\b(\+?\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s.-]?\d{3}[\s.-]?\d{3,4}\b/g;
const RUT_REGEX = /\b\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]\b/g;
const CREDIT_CARD_REGEX = /\b(?:\d[ -]*?){13,16}\b/g;
const JWT_REGEX = /\beyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\b/g;
const API_KEY_REGEX = /\b(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36,}|xox[baprs]-[a-zA-Z0-9-]{10,})\b/g;

export function detectSensitiveData(text: string): Array<{ type: string; value: string; masked: string }> {
  const results: Array<{ type: string; value: string; masked: string }> = [];

  const check = (regex: RegExp, type: string, maskFn: (v: string) => string) => {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const val = match[0];
      results.push({ type, value: val, masked: maskFn(val) });
    }
  };

  check(EMAIL_REGEX, 'email', (v) => `${v[0]}***${v.substring(v.indexOf('@'))}`);
  check(PHONE_REGEX, 'phone', (v) => v.length > 6 ? `${v.slice(0, 3)}****${v.slice(-3)}` : '****');
  check(RUT_REGEX, 'rut', (v) => `${v.slice(0, 2)}.***.***-${v.slice(-1)}`);
  check(CREDIT_CARD_REGEX, 'credit_card', (v) => `****${v.replace(/[^0-9]/g, '').slice(-4)}`);
  check(JWT_REGEX, 'jwt', () => 'eyJ****[truncated]');
  check(API_KEY_REGEX, 'api_key', (v) => `${v.slice(0, 3)}****${v.slice(-4)}`);

  return results;
}

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior|instructions|rules)/i,
  /olvida\s+(todas\s+)?las\s+(instrucciones|reglas|órdenes)/i,
  /act\s+(as\s+if|like)\s+(you\s+have\s+no|without|bypass)/i,
  /actúa\s+como\s+si\s+no\s+tuvieras/i,
  /reveal\s+(your\s+)?(system\s+)?prompt/i,
  /muestra\s+tu\s+prompt/i,
  /developer\s+message/i,
  /system\s+message/i,
  /jailbreak/i,
  /bypass/i,
  /modo\s+(desarrollador|alternativo|secreto)/i,
  /sin\s+restricciones/i,
  /dime\s+tus\s+instrucciones/i,
  /tell\s+me\s+your\s+internal/i,
  /new\s+order/i,
  /nuevas\s+órdenes/i,
  /override/i,
  /token\s*:\s*[A-Za-z0-9_-]{20,}/i,
];

export function detectPromptInjection(text: string): Array<{ pattern: RegExp; matched: string }> {
  const results: Array<{ pattern: RegExp; matched: string }> = [];
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      results.push({ pattern, matched: match[0] });
    }
  }
  return results;
}
