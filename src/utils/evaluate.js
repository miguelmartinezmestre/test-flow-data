function toNumber(x) {
    const n = typeof x === 'string' ? parseFloat(x) : x;
    return Number.isFinite(n) ? n : undefined;
}

function computeScalar(a, b, op) {
    const av = toNumber(a);
    const bv = toNumber(b);
    if (!Number.isFinite(av) || !Number.isFinite(bv)) return undefined;
    switch (op) {
        case '+':
            return av + bv;
        case '-':
            return av - bv;
        case '*':
            return av * bv;
        case '/':
            return bv === 0 ? undefined : av / bv;
        default:
            return undefined;
    }
}

function computeWithBroadcast(aVal, bVal, op) {
    const aIsArr = Array.isArray(aVal);
    const bIsArr = Array.isArray(bVal);
    if (!aIsArr && !bIsArr) return computeScalar(aVal, bVal, op);
    if (aIsArr && bIsArr) {
        if (aVal.length !== bVal.length) return undefined;
        return aVal.map((av, i) => computeScalar(av, bVal[i], op));
    }
    if (aIsArr && !bIsArr) return aVal.map((av) => computeScalar(av, bVal, op));
    if (!aIsArr && bIsArr) return bVal.map((bv) => computeScalar(aVal, bv, op));
    return undefined;
}

function equalValues(a, b) {
    if (Array.isArray(a) || Array.isArray(b)) {
        if (!Array.isArray(a) || !Array.isArray(b)) return false;
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i += 1) {
            const ai = a[i];
            const bi = b[i];
            if (Number.isFinite(ai) && Number.isFinite(bi)) {
                if (ai !== bi) return false;
            } else if (ai !== bi) {
                return false;
            }
        }
        return true;
    }
    return a === b;
}

export function recomputeValues(inputNodes, edges) {
    const nodes = inputNodes.map((n) => ({ ...n, data: { ...n.data } }));
    const idToIndex = new Map(nodes.map((n, idx) => [n.id, idx]));

    const edgesByTarget = new Map();
    for (const e of edges) {
        const list = edgesByTarget.get(e.target) || [];
        list.push(e);
        edgesByTarget.set(e.target, list);
    }

    const getNodeValue = (nodeId) => {
        const node = nodes[idToIndex.get(nodeId)];
        if (!node) return undefined;
        if (node.type === 'number') return node.data.value;
        if (node.type === 'csv') return node.data.table;
        if (node.type === 'tableview') return node.data.table;
        if (node.type === 'column') return node.data.values;
        if (node.type === 'array') return node.data.values;
        if (node.type === 'pastecsv') return node.data.table;
        if (node.type === 'filter') return node.data.result;
        if (node.type === 'aggregate') return node.data.result;
        if (node.type === 'sort') return node.data.result;
        if (node.type === 'normalize') return node.data.result;
        if (node.type === 'barchart') return undefined;
        if (node.type === 'linechart') return undefined;
        if (node.type === 'compute') return node.data.result;
        return undefined;
    };

    const computeNodeResult = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let aVal;
        let bVal;
        for (const e of inEdges) {
            const v = getNodeValue(e.source);
            if (e.targetHandle === 'a' && aVal === undefined) aVal = v;
            if (e.targetHandle === 'b' && bVal === undefined) bVal = v;
        }
        if (aVal === undefined || bVal === undefined) return undefined;
        return computeWithBroadcast(aVal, bVal, node.data.op);
    };

    const computeColumnValues = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let table;
        for (const e of inEdges) {
            if (e.targetHandle === 'csv') {
                table = getNodeValue(e.source);
            }
        }
        const headers = (table && table.headers) || [];
        let column = node.data.column;
        if (!column && headers.length) {
            const idx = Number.isFinite(node.data.defaultIndex) ? node.data.defaultIndex : 0;
            column = headers[Math.min(Math.max(idx, 0), headers.length - 1)];
        }
        let values;
        if (table && column) {
            const colIndex = headers.indexOf(column);
            if (colIndex >= 0) {
                const rawVals = table.rows.map((r) => r[colIndex]);
                if (node.data.locale === 'comma' || table.meta?.decimalSeparator === ',') {
                    values = rawVals.map((v) => toNumber(typeof v === 'string' ? v.replace(/\./g, '').replace(',', '.') : v));
                } else {
                    values = rawVals.map((v) => toNumber(v));
                }
            }
        }
        return { headers, column, values };
    };
    const computeCleanTable = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let table;
        for (const e of inEdges) if (e.targetHandle === 'in') table = getNodeValue(e.source);
        if (!table) return undefined;
        let { headers, rows } = table;
        const trim = node.data.trim ?? true;
        const dropEmpty = node.data.dropEmpty ?? true;
        const lower = node.data.lower ?? false;
        if (trim) rows = rows.map((r) => r.map((c) => String(c).trim()));
        if (dropEmpty) rows = rows.filter((r) => r.some((c) => String(c).trim() !== ''));
        if (lower) rows = rows.map((r) => r.map((c) => (typeof c === 'string' ? c.toLowerCase() : c)));
        return { ...table, headers, rows };
    };

    const computeSelectColumns = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let table;
        for (const e of inEdges) if (e.targetHandle === 'in') table = getNodeValue(e.source);
        if (!table) return undefined;
        const keep = new Set(node.data.keep || []);
        const headers = table.headers.filter((h) => keep.has(h));
        const idxs = headers.map((h) => table.headers.indexOf(h));
        const rows = table.rows.map((r) => idxs.map((i) => r[i]));
        return { ...table, headers, rows };
    };

    const computeRenameColumns = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let table;
        for (const e of inEdges) if (e.targetHandle === 'in') table = getNodeValue(e.source);
        if (!table) return undefined;
        const mapping = node.data.mapping || {};
        const headers = table.headers.map((h) => mapping[h] || h);
        return { ...table, headers };
    };

    const computeFillNull = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let table;
        for (const e of inEdges) if (e.targetHandle === 'in') table = getNodeValue(e.source);
        if (!table) return undefined;
        const fill = node.data.value ?? '';
        const rows = table.rows.map((r) => r.map((c) => (c === null || c === undefined || c === '' ? fill : c)));
        return { ...table, rows };
    };

    const computeDropNull = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let table;
        for (const e of inEdges) if (e.targetHandle === 'in') table = getNodeValue(e.source);
        if (!table) return undefined;
        const rows = table.rows.filter((r) => r.every((c) => c !== null && c !== undefined && c !== ''));
        return { ...table, rows };
    };

    const computeDeduplicate = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let table;
        for (const e of inEdges) if (e.targetHandle === 'in') table = getNodeValue(e.source);
        if (!table) return undefined;
        const keys = node.data.keys || [];
        if (keys.length === 0) return table;
        const idxs = keys.map((k) => table.headers.indexOf(k)).filter((i) => i >= 0);
        const seen = new Set();
        const rows = [];
        for (const r of table.rows) {
            const k = idxs.map((i) => String(r[i] ?? '')).join('␟');
            if (!seen.has(k)) {
                seen.add(k);
                rows.push(r);
            }
        }
        return { ...table, rows };
    };

    const computeDistinct = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let values;
        for (const e of inEdges) if (e.targetHandle === 'in') values = getNodeValue(e.source);
        if (!Array.isArray(values)) return undefined;
        return Array.from(new Set(values));
    };

    const computeLimit = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let values;
        for (const e of inEdges) if (e.targetHandle === 'in') values = getNodeValue(e.source);
        if (!Array.isArray(values)) return undefined;
        const n = Number.isFinite(node.data.count) ? node.data.count : 10;
        return values.slice(0, Math.max(0, n));
    };

    const computeSample = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let values;
        for (const e of inEdges) if (e.targetHandle === 'in') values = getNodeValue(e.source);
        if (!Array.isArray(values)) return undefined;
        const n = Number.isFinite(node.data.count) ? node.data.count : 5;
        let seed = Number.isFinite(node.data.seed) ? node.data.seed : 42;
        const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
        const idxs = values.map((_, i) => i);
        for (let i = idxs.length - 1; i > 0; i -= 1) {
            const j = Math.floor(rnd() * (i + 1));
            [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
        }
        return idxs.slice(0, Math.max(0, n)).map((i) => values[i]);
    };

    const computeFilter = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let values;
        for (const e of inEdges) {
            if (e.targetHandle === 'in') values = getNodeValue(e.source);
        }
        if (!Array.isArray(values)) return undefined;
        const threshold = Number.isFinite(node.data.threshold) ? node.data.threshold : 0;
        const op = node.data.op || '>';
        const out = [];
        for (const v of values) {
            const n = toNumber(v);
            if (!Number.isFinite(n)) continue;
            let keep = false;
            switch (op) {
                case '>': keep = n > threshold; break;
                case '>=': keep = n >= threshold; break;
                case '<': keep = n < threshold; break;
                case '<=': keep = n <= threshold; break;
                case '==': keep = n === threshold; break;
                case '!=': keep = n !== threshold; break;
                default: keep = false;
            }
            if (keep) out.push(n);
        }
        return out;
    };

    const computeAggregate = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let values;
        for (const e of inEdges) {
            if (e.targetHandle === 'in') values = getNodeValue(e.source);
        }
        if (!Array.isArray(values)) return undefined;
        const nums = values.map((v) => toNumber(v)).filter((v) => Number.isFinite(v));
        const agg = node.data.agg || 'sum';
        if (nums.length === 0) return agg === 'count' ? 0 : undefined;
        switch (agg) {
            case 'sum':
                return nums.reduce((a, b) => a + b, 0);
            case 'avg':
                return nums.reduce((a, b) => a + b, 0) / nums.length;
            case 'min':
                return Math.min(...nums);
            case 'max':
                return Math.max(...nums);
            case 'count':
                return nums.length;
            default:
                return undefined;
        }
    };

    const computeSort = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let values;
        for (const e of inEdges) if (e.targetHandle === 'in') values = getNodeValue(e.source);
        if (!Array.isArray(values)) return undefined;
        const nums = values.map((v) => toNumber(v)).filter((v) => Number.isFinite(v));
        const dir = node.data.dir || 'asc';
        const sorted = [...nums].sort((a, b) => a - b);
        if (dir === 'desc') sorted.reverse();
        return sorted;
    };

    const computeNormalize = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let values;
        for (const e of inEdges) if (e.targetHandle === 'in') values = getNodeValue(e.source);
        if (!Array.isArray(values)) return undefined;
        const nums = values.map((v) => toNumber(v)).filter((v) => Number.isFinite(v));
        if (nums.length === 0) return [];
        const method = node.data.method || 'minmax';
        if (method === 'minmax') {
            const min = Math.min(...nums);
            const max = Math.max(...nums);
            const span = max - min || 1;
            return nums.map((v) => (v - min) / span);
        }
        if (method === 'zscore') {
            const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
            const variance = nums.reduce((acc, v) => acc + (v - mean) * (v - mean), 0) / nums.length;
            const std = Math.sqrt(variance) || 1;
            return nums.map((v) => (v - mean) / std);
        }
        return nums;
    };

    const computeChartValues = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let values;
        for (const e of inEdges) if (e.targetHandle === 'in') values = getNodeValue(e.source);
        if (!Array.isArray(values)) return undefined;
        const nums = values.map((v) => toNumber(v)).filter((v) => Number.isFinite(v));
        return nums;
    };

    const computeHistogramValues = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let values;
        for (const e of inEdges) if (e.targetHandle === 'in') values = getNodeValue(e.source);
        if (!Array.isArray(values)) return undefined;
        return values.map((v) => toNumber(v)).filter((v) => Number.isFinite(v));
    };

    const computeScatterValues = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let x; let y;
        for (const e of inEdges) {
            if (e.targetHandle === 'x') x = getNodeValue(e.source);
            if (e.targetHandle === 'y') y = getNodeValue(e.source);
        }
        if (!Array.isArray(x) || !Array.isArray(y)) return undefined;
        const xv = x.map((v) => toNumber(v)).filter((v) => Number.isFinite(v));
        const yv = y.map((v) => toNumber(v)).filter((v) => Number.isFinite(v));
        return { x: xv, y: yv };
    };

    const computeTableFilterNode = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let table;
        for (const e of inEdges) if (e.targetHandle === 'in') table = getNodeValue(e.source);
        if (!table) return undefined;
        const headers = table.headers;
        const col = node.data.column;
        const idx = headers.indexOf(col);
        if (idx < 0) return table;
        const op = node.data.op || '>';
        const rawVal = node.data.value ?? '';
        const valNum = toNumber(rawVal);
        const rows = table.rows.filter((r) => {
            const v = r[idx];
            const n = toNumber(v);
            if (op === 'contains') return String(v ?? '').includes(String(rawVal));
            if (Number.isFinite(n) && Number.isFinite(valNum)) {
                switch (op) {
                    case '>': return n > valNum;
                    case '>=': return n >= valNum;
                    case '<': return n < valNum;
                    case '<=': return n <= valNum;
                    case '==': return n === valNum;
                    case '!=': return n !== valNum;
                    default: return true;
                }
            }
            return true;
        });
        return { ...table, rows };
    };

    const computeTableSortNode = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let table;
        for (const e of inEdges) if (e.targetHandle === 'in') table = getNodeValue(e.source);
        if (!table) return undefined;
        const headers = table.headers;
        const col = node.data.column;
        const idx = headers.indexOf(col);
        if (idx < 0) return table;
        const dir = node.data.dir || 'asc';
        const rows = [...table.rows].sort((a, b) => {
            const av = a[idx];
            const bv = b[idx];
            const an = toNumber(av);
            const bn = toNumber(bv);
            if (Number.isFinite(an) && Number.isFinite(bn)) return an - bn;
            return String(av).localeCompare(String(bv));
        });
        if (dir === 'desc') rows.reverse();
        return { ...table, rows };
    };

    const computeGroupByNode = (node) => {
        const inEdges = edgesByTarget.get(node.id) || [];
        let table;
        for (const e of inEdges) if (e.targetHandle === 'in') table = getNodeValue(e.source);
        if (!table) return undefined;
        const headers = table.headers;
        const key = node.data.key; const val = node.data.value; const agg = node.data.agg || 'sum';
        const ki = headers.indexOf(key); const vi = headers.indexOf(val);
        if (ki < 0 || vi < 0) return table;
        const groups = new Map();
        for (const r of table.rows) {
            const k = String(r[ki]);
            const v = toNumber(r[vi]);
            if (!groups.has(k)) groups.set(k, []);
            if (Number.isFinite(v)) groups.get(k).push(v);
        }
        const outHeaders = [key, `${val}_${agg}`];
        const outRows = [];
        for (const [k, arr] of groups.entries()) {
            let out;
            if (agg === 'count') out = arr.length; else if (agg === 'sum') out = arr.reduce((a, b) => a + b, 0);
            else if (agg === 'avg') out = arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
            else if (agg === 'min') out = Math.min(...arr);
            else if (agg === 'max') out = Math.max(...arr);
            outRows.push([k, out]);
        }
        return { headers: outHeaders, rows: outRows, meta: table.meta };
    };

    let changed = false;
    const maxPasses = nodes.length;
    for (let pass = 0; pass < maxPasses; pass += 1) {
        let passChanged = false;
        for (const node of nodes) {
            if (node.type === 'column') {
                const prevHeaders = node.data.availableHeaders || [];
                const prevColumn = node.data.column;
                const prevValues = node.data.values;
                const { headers, column, values } = computeColumnValues(node);
                const headersChanged = !equalValues(prevHeaders, headers);
                const columnChanged = prevColumn !== column;
                const valuesChanged = !equalValues(prevValues, values);
                if (headersChanged || columnChanged || valuesChanged) {
                    node.data.availableHeaders = headers;
                    node.data.column = column;
                    node.data.values = values;
                    passChanged = true;
                }
                continue;
            }
            if (node.type === 'cleantable') {
                const next = computeCleanTable(node);
                const prev = node.data.table;
                const equal = equalValues(prev, next);
                if (!equal) { node.data.table = next; node.data.availableHeaders = next?.headers || []; passChanged = true; }
                continue;
            }
            if (node.type === 'selectcolumns') {
                const next = computeSelectColumns(node);
                const prev = node.data.table;
                const equal = equalValues(prev, next);
                if (!equal) { node.data.table = next; node.data.availableHeaders = next?.headers || []; passChanged = true; }
                continue;
            }
            if (node.type === 'renamecolumn') {
                const next = computeRenameColumns(node);
                const prev = node.data.table;
                const equal = equalValues(prev, next);
                if (!equal) { node.data.table = next; node.data.availableHeaders = next?.headers || []; passChanged = true; }
                continue;
            }
            if (node.type === 'fillnull') {
                const next = computeFillNull(node);
                const prev = node.data.table;
                const equal = equalValues(prev, next);
                if (!equal) { node.data.table = next; node.data.availableHeaders = next?.headers || []; passChanged = true; }
                continue;
            }
            if (node.type === 'dropnull') {
                const next = computeDropNull(node);
                const prev = node.data.table;
                const equal = equalValues(prev, next);
                if (!equal) { node.data.table = next; node.data.availableHeaders = next?.headers || []; passChanged = true; }
                continue;
            }
            if (node.type === 'deduplicate') {
                const next = computeDeduplicate(node);
                const prev = node.data.table;
                const equal = equalValues(prev, next);
                if (!equal) { node.data.table = next; node.data.availableHeaders = next?.headers || []; passChanged = true; }
                continue;
            }
            if (node.type === 'filter') {
                const next = computeFilter(node);
                const prev = node.data.result;
                const equal = equalValues(prev, next);
                if (!equal) {
                    node.data.result = next;
                    passChanged = true;
                }
                continue;
            }
            if (node.type === 'aggregate') {
                const next = computeAggregate(node);
                const prev = node.data.result;
                const equal = equalValues(prev, next);
                if (!equal) {
                    node.data.result = next;
                    passChanged = true;
                }
                continue;
            }
            if (node.type === 'sort') {
                const next = computeSort(node);
                const prev = node.data.result;
                const equal = equalValues(prev, next);
                if (!equal) {
                    node.data.result = next;
                    passChanged = true;
                }
                continue;
            }
            if (node.type === 'normalize') {
                const next = computeNormalize(node);
                const prev = node.data.result;
                const equal = equalValues(prev, next);
                if (!equal) {
                    node.data.result = next;
                    passChanged = true;
                }
                continue;
            }
            if (node.type === 'barchart' || node.type === 'linechart') {
                const next = computeChartValues(node);
                const prev = node.data.values;
                const equal = equalValues(prev, next);
                if (!equal) {
                    node.data.values = next;
                    passChanged = true;
                }
                continue;
            }
            if (node.type === 'histogram') {
                const next = computeHistogramValues(node);
                const prev = node.data.values;
                const equal = equalValues(prev, next);
                if (!equal) { node.data.values = next; passChanged = true; }
                continue;
            }
            if (node.type === 'scatter') {
                const next = computeScatterValues(node);
                const prev = { x: node.data.x, y: node.data.y };
                const equal = equalValues(prev?.x, next?.x) && equalValues(prev?.y, next?.y);
                if (!equal) { node.data.x = next?.x; node.data.y = next?.y; passChanged = true; }
                continue;
            }
            if (node.type === 'distinct') {
                const next = computeDistinct(node);
                const prev = node.data.result;
                const equal = equalValues(prev, next);
                if (!equal) { node.data.result = next; passChanged = true; }
                continue;
            }
            if (node.type === 'limit') {
                const next = computeLimit(node);
                const prev = node.data.result;
                const equal = equalValues(prev, next);
                if (!equal) { node.data.result = next; passChanged = true; }
                continue;
            }
            if (node.type === 'sample') {
                const next = computeSample(node);
                const prev = node.data.result;
                const equal = equalValues(prev, next);
                if (!equal) { node.data.result = next; passChanged = true; }
                continue;
            }
            if (node.type === 'tablefilter') {
                const next = computeTableFilterNode(node);
                const prev = node.data.table;
                const equal = equalValues(prev, next);
                if (!equal) { node.data.table = next; node.data.availableHeaders = next?.headers || []; passChanged = true; }
                continue;
            }
            if (node.type === 'tablesort') {
                const next = computeTableSortNode(node);
                const prev = node.data.table;
                const equal = equalValues(prev, next);
                if (!equal) { node.data.table = next; node.data.availableHeaders = next?.headers || []; passChanged = true; }
                continue;
            }
            if (node.type === 'groupby') {
                const next = computeGroupByNode(node);
                const prev = node.data.table;
                const equal = equalValues(prev, next);
                if (!equal) { node.data.table = next; node.data.availableHeaders = next?.headers || []; passChanged = true; }
                continue;
            }
            if (node.type === 'tableview') {
                const inEdges = edgesByTarget.get(node.id) || [];
                let table;
                for (const e of inEdges) if (e.targetHandle === 'in') table = getNodeValue(e.source);
                const prev = node.data.table;
                const equal = equalValues(prev, table);
                if (!equal) { node.data.table = table; passChanged = true; }
                continue;
            }
            if (node.type === 'exportcsv') {
                const inEdges = edgesByTarget.get(node.id) || [];
                let input;
                for (const e of inEdges) if (e.targetHandle === 'in') input = getNodeValue(e.source);
                const prevTable = node.data.table; const prevVals = node.data.values;
                let changedLocal = false;
                if (Array.isArray(input)) {
                    if (!equalValues(prevVals, input)) { node.data.values = input; changedLocal = true; }
                } else if (input && typeof input === 'object' && Array.isArray(input.headers) && Array.isArray(input.rows)) {
                    if (!equalValues(prevTable, input)) { node.data.table = input; changedLocal = true; }
                }
                if (changedLocal) passChanged = true;
                continue;
            }
            if (node.type === 'compute') {
                const next = computeNodeResult(node);
                const prev = node.data.result;
                const equal = equalValues(prev, next);
                if (!equal) {
                    node.data.result = next;
                    passChanged = true;
                }
                continue;
            }
        }
        changed = changed || passChanged;
        if (!passChanged) break;
    }

    return changed ? nodes : inputNodes;
}


