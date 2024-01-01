import { Handle, Position } from '@xyflow/react';

export default function TableViewNode({ id, data }) {
    const table = data.table;
    const headers = (table && table.headers) || [];
    const rows = (table && table.rows) || [];
    const page = Number.isFinite(data.page) ? data.page : 1;
    const size = Number.isFinite(data.size) ? data.size : 10;
    const start = (page - 1) * size;
    const pageRows = rows.slice(start, start + size);

    const onSizeChange = (e) => data.onChange && data.onChange(id, { size: parseInt(e.target.value || '10', 10) });
    const onPrev = () => data.onChange && data.onChange(id, { page: Math.max(1, page - 1) });
    const onNext = () => data.onChange && data.onChange(id, { page: page + 1 });

    return (
        <div style={{ padding: 8, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 6, minWidth: 320, position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, marginBottom: 6, paddingRight: 14 }}>Vista tabla</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11 }}>Tamaño página</span>
                <input type="number" min={1} value={size} onChange={onSizeChange} style={{ width: 60 }} />
                <button onClick={onPrev} style={{ marginLeft: 'auto' }}>◀</button>
                <span style={{ fontSize: 11 }}>Pág. {page}</span>
                <button onClick={onNext}>▶</button>
            </div>
            <div style={{ maxHeight: 180, overflow: 'auto', border: '1px solid #eee', borderRadius: 4 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                        <tr>
                            {headers.map((h) => (
                                <th key={h} style={{ position: 'sticky', top: 0, background: '#fafafa', borderBottom: '1px solid #eee', textAlign: 'left', padding: '4px 6px', color: '#000' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageRows.map((r, i) => (
                            <tr key={i}>
                                {headers.map((_, j) => (
                                    <td key={j} style={{ borderBottom: '1px solid #f3f3f3', padding: '4px 6px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: '#000' }}>{String(r[j] ?? '')}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Handle type="target" position={Position.Left} id="in" />
        </div>
    );
}


