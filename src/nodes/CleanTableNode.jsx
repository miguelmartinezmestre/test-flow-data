import { Handle, Position } from '@xyflow/react';

export default function CleanTableNode({ id, data }) {
    const trim = data.trim ?? true;
    const dropEmpty = data.dropEmpty ?? true;
    const lower = data.lower ?? false;

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: 220, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, marginBottom: 6, paddingRight: 14 }}>Limpieza básica</div>
            <label style={{ fontSize: 12, display: 'block' }}>
                <input type="checkbox" checked={trim} onChange={(e) => data.onChange && data.onChange(id, { trim: e.target.checked })} /> Trim celdas
            </label>
            <label style={{ fontSize: 12, display: 'block' }}>
                <input type="checkbox" checked={dropEmpty} onChange={(e) => data.onChange && data.onChange(id, { dropEmpty: e.target.checked })} /> Eliminar filas vacías
            </label>
            <label style={{ fontSize: 12, display: 'block' }}>
                <input type="checkbox" checked={lower} onChange={(e) => data.onChange && data.onChange(id, { lower: e.target.checked })} /> Minúsculas
            </label>
            <Handle type="target" position={Position.Left} id="in" />
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
}


