import { Handle, Position } from '@xyflow/react';

export default function ScatterPlotNode({ id, data }) {
    const xs = Array.isArray(data.x) ? data.x : [];
    const ys = Array.isArray(data.y) ? data.y : [];
    const n = Math.min(xs.length, ys.length);
    const width = 260; const height = 160; const padding = 18;
    const X = xs.filter((v) => Number.isFinite(v));
    const Y = ys.filter((v) => Number.isFinite(v));
    const minX = X.length ? Math.min(...X) : 0; const maxX = X.length ? Math.max(...X) : 1;
    const minY = Y.length ? Math.min(...Y) : 0; const maxY = Y.length ? Math.max(...Y) : 1;
    const sx = (v) => padding + ((v - minX) / (maxX - minX || 1)) * (width - padding * 2);
    const sy = (v) => padding + (height - padding * 2) * (1 - (v - minY) / (maxY - minY || 1));

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: width + 16, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, marginBottom: 6, paddingRight: 14 }}>Dispersión</div>
            <svg width={width} height={height} style={{ background: '#fff', border: '1px solid #eee' }}>
                {Array.from({ length: n }).map((_, i) => (
                    <circle key={i} cx={sx(xs[i])} cy={sy(ys[i])} r={3} fill="#2563eb" />
                ))}
            </svg>
            <Handle type="target" position={Position.Left} id="x" style={{ top: 24 }} />
            <Handle type="target" position={Position.Left} id="y" style={{ top: 54 }} />
        </div>
    );
}


