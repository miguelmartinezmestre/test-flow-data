import { Handle, Position } from '@xyflow/react';

export default function LineChartNode({ id, data }) {
    const values = Array.isArray(data.values) ? data.values : [];
    const width = 260;
    const height = 140;
    const padding = 18;
    const nums = values.filter((n) => Number.isFinite(n));
    const max = nums.length ? Math.max(...nums) : 0;
    const min = nums.length ? Math.min(...nums) : 0;
    const span = max - min || 1;
    const color = '#ef4444';
    const label = typeof data.label === 'string' ? data.label : 'Serie';

    const onLabelChange = (event) => {
        if (data.onChange) data.onChange(id, { label: event.target.value });
    };

    const points = nums.map((v, i) => {
        const x = padding + (i * (width - padding * 2)) / Math.max(1, nums.length - 1);
        const y = padding + (height - padding * 2) * (1 - (v - min) / span);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: width + 16, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, marginBottom: 6, paddingRight: 14 }}>Line Chart</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <div style={{ width: 10, height: 10, background: color, borderRadius: 2 }} />
                <input type="text" value={label} onChange={onLabelChange} placeholder="Leyenda" style={{ flex: 1 }} />
            </div>
            <svg width={width} height={height} style={{ background: '#fff', border: '1px solid #eee' }}>
                <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
            </svg>
            <Handle type="target" position={Position.Left} id="in" />
        </div>
    );
}


