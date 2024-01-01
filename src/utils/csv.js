export function removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function normalizeHeader(h) {
    return removeDiacritics(String(h || ''))
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

function detectDelimiter(sampleText) {
    const candidates = [',', ';', '\t', '|'];
    const lines = sampleText.replace(/\r/g, '').split('\n').slice(0, 5).filter(Boolean);
    let best = ',';
    let bestScore = -1;
    for (const cand of candidates) {
        let score = 0;
        let count = null;
        for (const line of lines) {
            const c = (line.match(new RegExp(cand.replace(/\t/g, '\\t'), 'g')) || []).length;
            if (count === null) count = c;
            if (c === count && c > 0) score += 1;
        }
        if (score > bestScore) {
            bestScore = score;
            best = cand;
        }
    }
    return best;
}

export function splitCsvLine(line, delimiter = ',') {
    const delim = delimiter === '\t' ? '\t' : delimiter;
    const cells = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === delim && !inQuotes) {
            cells.push(current);
            current = '';
        } else {
            current += ch;
        }
    }
    cells.push(current);
    return cells;
}

function inferType(values, decimalSeparator = '.') {
    let allNumber = true;
    let allDate = true;
    for (const v of values) {
        const s = String(v ?? '').trim();
        if (s === '') continue;
        const num = decimalSeparator === ',' ? parseFloat(s.replace(/\./g, '').replace(',', '.')) : parseFloat(s);
        if (!Number.isFinite(num)) allNumber = false;
        const d = Date.parse(s);
        if (!Number.isFinite(d)) allDate = false;
        if (!allNumber && !allDate) break;
    }
    if (allNumber) return 'number';
    if (allDate) return 'date';
    return 'string';
}

export function parseCsvText(text, options = {}) {
    const { delimiter = 'auto', hasHeader = 'auto', normalizeHeaders = true, trimCells = true, dropEmptyRows = true, decimalSeparator = '.' } = options;
    const clean = text.replace(/\r/g, '');
    if (!clean.trim()) return { headers: [], rows: [], schema: [], meta: { delimiter: ',', hasHeader: false, decimalSeparator } };
    const delim = delimiter === 'auto' ? detectDelimiter(clean) : delimiter;
    const rawLines = clean.split('\n');
    const lines = rawLines.filter((l) => l.length > 0);
    if (lines.length === 0) return { headers: [], rows: [], schema: [], meta: { delimiter: delim, hasHeader: false, decimalSeparator } };
    const first = splitCsvLine(lines[0], delim);
    const second = lines[1] ? splitCsvLine(lines[1], delim) : [];
    let headerPresent = hasHeader === 'auto'
        ? first.some((c) => /[A-Za-z]/.test(c)) || (second.length && first.length === second.length && first.some((c, i) => isNaN(Number(c)) && !isNaN(Number(second[i]))))
        : !!hasHeader;
    let headers = headerPresent ? first : first.map((_, i) => `col_${i + 1}`);
    let rows = (headerPresent ? lines.slice(1) : lines).map((l) => splitCsvLine(l, delim));
    if (trimCells) {
        rows = rows.map((r) => r.map((c) => String(c).trim()));
        headers = headers.map((h) => String(h).trim());
    }
    if (dropEmptyRows) {
        rows = rows.filter((r) => r.some((c) => String(c).trim() !== ''));
    }
    const rawHeaders = headers.slice();
    if (normalizeHeaders) headers = headers.map((h) => normalizeHeader(h));
    const cols = headers.length;
    rows = rows.map((r) => (r.length < cols ? r.concat(Array(cols - r.length).fill('')) : r.slice(0, cols)));
    const schema = Array.from({ length: headers.length }, (_, idx) => inferType(rows.map((r) => r[idx]), decimalSeparator));
    return { headers, rows, schema, meta: { delimiter: delim, hasHeader: headerPresent, decimalSeparator, rawHeaders } };
}


