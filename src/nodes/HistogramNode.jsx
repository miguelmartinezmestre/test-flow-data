import { Handle, Position } from '@xyflow/react';

function computeBins(values, bins = 10) {
    const nums = values.filter((n) => Number.isFinite(n));
    if (nums.length === 0) return { bins: [], counts: [] };
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const step = (max - min) / (bins || 1) || 1;
    const edges = Array.from({ length: bins + 1 }, (_, i) => min + i * step);
    const counts = Array(bins).fill(0);
    for (const v of nums) {
        let idx = Math.floor((v - min) / step);
        if (idx >= bins) idx = bins - 1;
        if (idx < 0) idx = 0;
        counts[idx] += 1;
    }
    return { bins: edges, counts };
}

export default function HistogramNode({ id, data }) {
    const values = Array.isArray(data.values) ? data.values : [];
    const k = Number.isFinite(data.bins) ? data.bins : 10;
    const width = 260; const height = 140; const padding = 18;
    const { counts } = computeBins(values, k);
    const maxCount = counts.length ? Math.max(...counts) : 0;
    const barWidth = counts.length ? (width - padding * 2) / counts.length : 0;

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: width + 16, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, marginBottom: 6, paddingRight: 14 }}>Histograma</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12 }}>Bins</span>
                <input type="number" min={1} value={k} onChange={(e) => data.onChange && data.onChange(id, { bins: parseInt(e.target.value || '1', 10) })} style={{ width: 60 }} />
            </div>
            <svg width={width} height={height} style={{ background: '#fff', border: '1px solid #eee' }}>
                {counts.map((c, i) => {
                    const h = maxCount > 0 ? (c / maxCount) * (height - padding * 2) : 0;
                    const x = padding + i * barWidth; const y = height - padding - h;
                    return <rect key={i} x={x} y={y} width={Math.max(1, barWidth - 2)} height={h} fill="#22c55e" />;
                })}
            </svg>
            <Handle type="target" position={Position.Left} id="in" />
        </div>
    );
}


