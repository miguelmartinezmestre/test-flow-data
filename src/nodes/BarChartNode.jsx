import { Handle, Position } from '@xyflow/react';

export default function BarChartNode({ id, data }) {
    const values = Array.isArray(data.values) ? data.values : [];
    const width = 260;
    const height = 140;
    const padding = 18;
    const nums = values.filter((n) => Number.isFinite(n));
    const max = nums.length ? Math.max(...nums) : 0;
    const barWidth = nums.length ? (width - padding * 2) / nums.length : 0;
    const color = '#4f46e5';
    const label = typeof data.label === 'string' ? data.label : 'Serie';

    const onLabelChange = (event) => {
        if (data.onChange) data.onChange(id, { label: event.target.value });
    };

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: width + 16, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, marginBottom: 6, paddingRight: 14 }}>Bar Chart</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <div style={{ width: 10, height: 10, background: color, borderRadius: 2 }} />
                <input type="text" value={label} onChange={onLabelChange} placeholder="Leyenda" style={{ flex: 1 }} />
            </div>
            <svg width={width} height={height} style={{ background: '#fff', border: '1px solid #eee' }}>
                {nums.map((v, i) => {
                    const h = max > 0 ? (v / max) * (height - padding * 2) : 0;
                    const x = padding + i * barWidth;
                    const y = height - padding - h;
                    return <rect key={i} x={x} y={y} width={Math.max(1, barWidth - 2)} height={h} fill={color} />;
                })}
            </svg>
            <Handle type="target" position={Position.Left} id="in" />
        </div>
    );
}


