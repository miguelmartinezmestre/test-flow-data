import { Handle, Position } from '@xyflow/react';
import { parseCsvText } from '../utils/csv.js';

export default function CSVNode({ id, data }) {
    const onFileChange = async (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const text = await file.text();
        const table = parseCsvText(text, {
            delimiter: data.delimiter || 'auto',
            hasHeader: data.hasHeader ?? 'auto',
            normalizeHeaders: data.normalizeHeaders ?? true,
            trimCells: true,
            dropEmptyRows: true,
            decimalSeparator: data.decimalSeparator || '.',
        });
        if (data.onChange) data.onChange(id, { filename: file.name, table });
    };

    const name = data.filename || 'Cargar CSV';
    const headers = (data.table && data.table.headers) || [];
    const rows = (data.table && data.table.rows) || [];
    const sampleRows = rows.slice(0, 5);

    const onDrop = async (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files && event.dataTransfer.files[0];
        if (!file) return;
        const text = await file.text();
        const table = parseCsvText(text, {
            delimiter: data.delimiter || 'auto',
            hasHeader: data.hasHeader ?? 'auto',
            normalizeHeaders: data.normalizeHeaders ?? true,
            trimCells: true,
            dropEmptyRows: true,
            decimalSeparator: data.decimalSeparator || '.',
        });
        if (data.onChange) data.onChange(id, { filename: file.name, table });
    };

    const prevent = (e) => { e.preventDefault(); };

    const options = (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
            <label style={{ fontSize: 11 }}>
                Delim:
                <select value={data.delimiter || 'auto'} onChange={(e) => data.onChange && data.onChange(id, { delimiter: e.target.value })} style={{ marginLeft: 4 }}>
                    <option value="auto">auto</option>
                    <option value=",">,</option>
                    <option value=";">;</option>
                    <option value="\t">tab</option>
                    <option value="|">|</option>
                </select>
            </label>
            <label style={{ fontSize: 11 }}>
                Dec:
                <select value={data.decimalSeparator || '.'} onChange={(e) => data.onChange && data.onChange(id, { decimalSeparator: e.target.value })} style={{ marginLeft: 4 }}>
                    <option value=".">.</option>
                    <option value=",">,</option>
                </select>
            </label>
            <label style={{ fontSize: 11 }}>
                Header:
                <select value={String(data.hasHeader ?? 'auto')} onChange={(e) => data.onChange && data.onChange(id, { hasHeader: e.target.value === 'auto' ? 'auto' : e.target.value === 'true' })} style={{ marginLeft: 4 }}>
                    <option value="auto">auto</option>
                    <option value="true">sí</option>
                    <option value="false">no</option>
                </select>
            </label>
            <label style={{ fontSize: 11 }}>
                Norm headers
                <input type="checkbox" checked={data.normalizeHeaders ?? true} onChange={(e) => data.onChange && data.onChange(id, { normalizeHeaders: e.target.checked })} style={{ marginLeft: 4 }} />
            </label>
        </div>
    );

    return (
        <div onDragOver={prevent} onDrop={onDrop} style={{ padding: 8, background: '#fff', border: '1px solid #ddd', borderRadius: 6, minWidth: 260, color: '#000', position: 'relative' }}>
            <button onClick={() => data.onDelete && data.onDelete(id)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ fontSize: 12, color: '#000', marginBottom: 6, paddingRight: 14 }}>Archivo CSV</div>
            {options}
            <input type="file" accept=".csv,text/csv" onChange={onFileChange} style={{ width: '100%', marginBottom: 8 }} />
            <div style={{ fontSize: 12, color: '#000' }}>{name}</div>
            <div style={{ fontSize: 11, color: '#000', marginTop: 6, marginBottom: 6 }}>Columnas: {headers.slice(0, 5).join(', ')}{headers.length > 5 ? ' …' : ''}</div>
            {headers.length > 0 && sampleRows.length > 0 && (
                <div style={{ maxHeight: 140, overflow: 'auto', border: '1px solid #eee', borderRadius: 4 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                        <thead>
                            <tr>
                                {headers.map((h) => (
                                    <th key={h} style={{ position: 'sticky', top: 0, background: '#fafafa', borderBottom: '1px solid #eee', textAlign: 'left', padding: '4px 6px', color: '#000' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sampleRows.map((r, i) => (
                                <tr key={i}>
                                    {headers.map((_, j) => (
                                        <td key={j} style={{ borderBottom: '1px solid #f3f3f3', padding: '4px 6px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: '#000' }}>
                                            {String(r[j] ?? '')}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Handle type="source" position={Position.Right} id="table" />
        </div>
    );
}


