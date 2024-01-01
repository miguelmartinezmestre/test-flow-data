import { useState, useCallback, useMemo } from 'react';
import { ReactFlow, ReactFlowProvider, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NumberNode from './nodes/NumberNode.jsx';
import ComputeNode from './nodes/ComputeNode.jsx';
import CSVNode from './nodes/CSVNode.jsx';
import ColumnNode from './nodes/ColumnNode.jsx';
import AggregateNode from './nodes/AggregateNode.jsx';
import FilterNode from './nodes/FilterNode.jsx';
import ArrayNode from './nodes/ArrayNode.jsx';
import PasteCSVNode from './nodes/PasteCSVNode.jsx';
import SortNode from './nodes/SortNode.jsx';
import NormalizeNode from './nodes/NormalizeNode.jsx';
import BarChartNode from './nodes/BarChartNode.jsx';
import LineChartNode from './nodes/LineChartNode.jsx';
import TableViewNode from './nodes/TableViewNode.jsx';
import CleanTableNode from './nodes/CleanTableNode.jsx';
import SelectColumnsNode from './nodes/SelectColumnsNode.jsx';
import RenameColumnNode from './nodes/RenameColumnNode.jsx';
import FillNullNode from './nodes/FillNullNode.jsx';
import DropNullNode from './nodes/DropNullNode.jsx';
import DeduplicateNode from './nodes/DeduplicateNode.jsx';
import DistinctNode from './nodes/DistinctNode.jsx';
import LimitNode from './nodes/LimitNode.jsx';
import SampleNode from './nodes/SampleNode.jsx';
import TableFilterNode from './nodes/TableFilterNode.jsx';
import TableSortNode from './nodes/TableSortNode.jsx';
import GroupByNode from './nodes/GroupByNode.jsx';
import ExportCSVNode from './nodes/ExportCSVNode.jsx';
import HistogramNode from './nodes/HistogramNode.jsx';
import ScatterPlotNode from './nodes/ScatterPlotNode.jsx';
import { recomputeValues } from './utils/evaluate.js';
import Sidebar from './components/Sidebar.jsx';
import { parseCsvText } from './utils/csv.js';


function FlowCanvas() {
  const [edges, setEdges] = useState([
    { id: 'e1', source: 'csv1', sourceHandle: 'table', target: 'clean1', targetHandle: 'in' },
    { id: 'e2', source: 'clean1', sourceHandle: 'out', target: 'select1', targetHandle: 'in' },
    { id: 'e3', source: 'select1', sourceHandle: 'out', target: 'rename1', targetHandle: 'in' },
    { id: 'e4', source: 'rename1', sourceHandle: 'out', target: 'tablesort1', targetHandle: 'in' },
    { id: 'e5', source: 'tablesort1', sourceHandle: 'out', target: 'tablefilter1', targetHandle: 'in' },
    { id: 'e6', source: 'tablefilter1', sourceHandle: 'out', target: 'groupby1', targetHandle: 'in' },
    { id: 'e7', source: 'groupby1', sourceHandle: 'out', target: 'tableview1', targetHandle: 'in' },
    { id: 'e8', source: 'groupby1', sourceHandle: 'out', target: 'export1', targetHandle: 'in' },

    { id: 'e9', source: 'select1', sourceHandle: 'out', target: 'colX', targetHandle: 'csv' },
    { id: 'e10', source: 'select1', sourceHandle: 'out', target: 'colY', targetHandle: 'csv' },
    { id: 'e11', source: 'colX', sourceHandle: 'out', target: 'sortSeries', targetHandle: 'in' },
    { id: 'e12', source: 'sortSeries', sourceHandle: 'out', target: 'normSeries', targetHandle: 'in' },
    { id: 'e13', source: 'normSeries', sourceHandle: 'out', target: 'fArray1', targetHandle: 'in' },
    { id: 'e14', source: 'fArray1', sourceHandle: 'out', target: 'hist1', targetHandle: 'in' },
    { id: 'e15', source: 'fArray1', sourceHandle: 'out', target: 'aggSeries1', targetHandle: 'in' },
    { id: 'e16', source: 'colY', sourceHandle: 'out', target: 'distinctY', targetHandle: 'in' },
    { id: 'e17', source: 'distinctY', sourceHandle: 'out', target: 'limitY', targetHandle: 'in' },
    { id: 'e18', source: 'limitY', sourceHandle: 'out', target: 'sampleY', targetHandle: 'in' },
    { id: 'e19', source: 'sampleY', sourceHandle: 'out', target: 'line2', targetHandle: 'in' },
    { id: 'e20', source: 'colX', sourceHandle: 'out', target: 'scatter1', targetHandle: 'x' },
    { id: 'e21', source: 'colY', sourceHandle: 'out', target: 'scatter1', targetHandle: 'y' },
    { id: 'e22', source: 'colX', sourceHandle: 'out', target: 'comp1', targetHandle: 'a' },
    { id: 'e23', source: 'num2', sourceHandle: 'out', target: 'comp1', targetHandle: 'b' },
    { id: 'e24', source: 'comp1', sourceHandle: 'out', target: 'bar3', targetHandle: 'in' },
    { id: 'e25', source: 'a1', sourceHandle: 'out', target: 'bar2', targetHandle: 'in' },

    { id: 'e26', source: 'paste1', sourceHandle: 'table', target: 'clean2', targetHandle: 'in' },
    { id: 'e27', source: 'clean2', sourceHandle: 'out', target: 'fill2', targetHandle: 'in' },
    { id: 'e28', source: 'fill2', sourceHandle: 'out', target: 'drop2', targetHandle: 'in' },
    { id: 'e29', source: 'drop2', sourceHandle: 'out', target: 'select2', targetHandle: 'in' },
    { id: 'e30', source: 'select2', sourceHandle: 'out', target: 'rename2', targetHandle: 'in' },
    { id: 'e31', source: 'rename2', sourceHandle: 'out', target: 'dedupe2', targetHandle: 'in' },
    { id: 'e32', source: 'dedupe2', sourceHandle: 'out', target: 'tableview2', targetHandle: 'in' },
    { id: 'e33', source: 'dedupe2', sourceHandle: 'out', target: 'export2', targetHandle: 'in' },
  ]);
  const [nodes, setNodes] = useState(() =>
    recomputeValues([
      { id: 'csv1', type: 'csv', position: { x: 0, y: 0 }, data: {} },
      { id: 'clean1', type: 'cleantable', position: { x: 240, y: -40 }, data: {} },
      { id: 'select1', type: 'selectcolumns', position: { x: 500, y: -40 }, data: {} },
      { id: 'rename1', type: 'renamecolumn', position: { x: 760, y: -40 }, data: {} },
      { id: 'tablesort1', type: 'tablesort', position: { x: 1020, y: -40 }, data: { dir: 'asc' } },
      { id: 'tablefilter1', type: 'tablefilter', position: { x: 1280, y: -40 }, data: { op: 'contains', value: '' } },
      { id: 'groupby1', type: 'groupby', position: { x: 1540, y: -40 }, data: { agg: 'sum' } },
      { id: 'tableview1', type: 'tableview', position: { x: 1800, y: -60 }, data: { size: 10, page: 1 } },
      { id: 'export1', type: 'exportcsv', position: { x: 1800, y: 100 }, data: { filename: 'grouped.csv' } },

      { id: 'colX', type: 'column', position: { x: 500, y: 140 }, data: { locale: 'dot' } },
      { id: 'sortSeries', type: 'sort', position: { x: 620, y: 140 }, data: { dir: 'asc' } },
      { id: 'normSeries', type: 'normalize', position: { x: 760, y: 140 }, data: { method: 'minmax' } },
      { id: 'fArray1', type: 'filter', position: { x: 900, y: 140 }, data: { op: '>=', threshold: 0.5 } },
      { id: 'hist1', type: 'histogram', position: { x: 1040, y: 140 }, data: { bins: 12 } },
      { id: 'aggSeries1', type: 'aggregate', position: { x: 1220, y: 140 }, data: { agg: 'avg' } },

      { id: 'colY', type: 'column', position: { x: 500, y: 300 }, data: {} },
      { id: 'distinctY', type: 'distinct', position: { x: 660, y: 300 }, data: {} },
      { id: 'limitY', type: 'limit', position: { x: 800, y: 300 }, data: { count: 100 } },
      { id: 'sampleY', type: 'sample', position: { x: 940, y: 300 }, data: { count: 50, seed: 7 } },
      { id: 'line2', type: 'linechart', position: { x: 1100, y: 300 }, data: { label: 'Serie Y' } },
      { id: 'scatter1', type: 'scatter', position: { x: 980, y: 440 }, data: {} },

      { id: 'num2', type: 'number', position: { x: 760, y: 520 }, data: { value: 2 } },
      { id: 'comp1', type: 'compute', position: { x: 980, y: 520 }, data: { op: '*' } },
      { id: 'bar3', type: 'barchart', position: { x: 1220, y: 520 }, data: { label: 'X*2' } },

      { id: 'a1', type: 'array', position: { x: 0, y: 600 }, data: { values: [5, 3, 9, 1, 7] } },
      { id: 'bar2', type: 'barchart', position: { x: 300, y: 600 }, data: {} },

      { id: 'paste1', type: 'pastecsv', position: { x: 0, y: 780 }, data: { text: 'key,value\nA,1\nB,4\nC,2\nD,5\nE,3', table: parseCsvText('key,value\nA,1\nB,4\nC,2\nD,5\nE,3') } },
      { id: 'clean2', type: 'cleantable', position: { x: 260, y: 780 }, data: {} },
      { id: 'fill2', type: 'fillnull', position: { x: 460, y: 780 }, data: { value: '0' } },
      { id: 'drop2', type: 'dropnull', position: { x: 620, y: 780 }, data: {} },
      { id: 'select2', type: 'selectcolumns', position: { x: 780, y: 780 }, data: {} },
      { id: 'rename2', type: 'renamecolumn', position: { x: 1040, y: 780 }, data: {} },
      { id: 'dedupe2', type: 'deduplicate', position: { x: 1300, y: 780 }, data: { keys: [] } },
      { id: 'tableview2', type: 'tableview', position: { x: 1560, y: 780 }, data: { size: 8, page: 1 } },
      { id: 'export2', type: 'exportcsv', position: { x: 1560, y: 940 }, data: { filename: 'cleaned.csv' } },
    ], [
      { id: 'e1', source: 'csv1', sourceHandle: 'table', target: 'clean1', targetHandle: 'in' },
      { id: 'e2', source: 'clean1', sourceHandle: 'out', target: 'select1', targetHandle: 'in' },
      { id: 'e3', source: 'select1', sourceHandle: 'out', target: 'rename1', targetHandle: 'in' },
      { id: 'e4', source: 'rename1', sourceHandle: 'out', target: 'tablesort1', targetHandle: 'in' },
      { id: 'e5', source: 'tablesort1', sourceHandle: 'out', target: 'tablefilter1', targetHandle: 'in' },
      { id: 'e6', source: 'tablefilter1', sourceHandle: 'out', target: 'groupby1', targetHandle: 'in' },
      { id: 'e7', source: 'groupby1', sourceHandle: 'out', target: 'tableview1', targetHandle: 'in' },
      { id: 'e8', source: 'groupby1', sourceHandle: 'out', target: 'export1', targetHandle: 'in' },

      { id: 'e9', source: 'select1', sourceHandle: 'out', target: 'colX', targetHandle: 'csv' },
      { id: 'e10', source: 'select1', sourceHandle: 'out', target: 'colY', targetHandle: 'csv' },
      { id: 'e11', source: 'colX', sourceHandle: 'out', target: 'sortSeries', targetHandle: 'in' },
      { id: 'e12', source: 'sortSeries', sourceHandle: 'out', target: 'normSeries', targetHandle: 'in' },
      { id: 'e13', source: 'normSeries', sourceHandle: 'out', target: 'fArray1', targetHandle: 'in' },
      { id: 'e14', source: 'fArray1', sourceHandle: 'out', target: 'hist1', targetHandle: 'in' },
      { id: 'e15', source: 'fArray1', sourceHandle: 'out', target: 'aggSeries1', targetHandle: 'in' },
      { id: 'e16', source: 'colY', sourceHandle: 'out', target: 'distinctY', targetHandle: 'in' },
      { id: 'e17', source: 'distinctY', sourceHandle: 'out', target: 'limitY', targetHandle: 'in' },
      { id: 'e18', source: 'limitY', sourceHandle: 'out', target: 'sampleY', targetHandle: 'in' },
      { id: 'e19', source: 'sampleY', sourceHandle: 'out', target: 'line2', targetHandle: 'in' },
      { id: 'e20', source: 'colX', sourceHandle: 'out', target: 'scatter1', targetHandle: 'x' },
      { id: 'e21', source: 'colY', sourceHandle: 'out', target: 'scatter1', targetHandle: 'y' },
      { id: 'e22', source: 'colX', sourceHandle: 'out', target: 'comp1', targetHandle: 'a' },
      { id: 'e23', source: 'num2', sourceHandle: 'out', target: 'comp1', targetHandle: 'b' },
      { id: 'e24', source: 'comp1', sourceHandle: 'out', target: 'bar3', targetHandle: 'in' },
      { id: 'e25', source: 'a1', sourceHandle: 'out', target: 'bar2', targetHandle: 'in' },

      { id: 'e26', source: 'paste1', sourceHandle: 'table', target: 'clean2', targetHandle: 'in' },
      { id: 'e27', source: 'clean2', sourceHandle: 'out', target: 'fill2', targetHandle: 'in' },
      { id: 'e28', source: 'fill2', sourceHandle: 'out', target: 'drop2', targetHandle: 'in' },
      { id: 'e29', source: 'drop2', sourceHandle: 'out', target: 'select2', targetHandle: 'in' },
      { id: 'e30', source: 'select2', sourceHandle: 'out', target: 'rename2', targetHandle: 'in' },
      { id: 'e31', source: 'rename2', sourceHandle: 'out', target: 'dedupe2', targetHandle: 'in' },
      { id: 'e32', source: 'dedupe2', sourceHandle: 'out', target: 'tableview2', targetHandle: 'in' },
      { id: 'e33', source: 'dedupe2', sourceHandle: 'out', target: 'export2', targetHandle: 'in' },
    ])
  );

  const nodeTypes = useMemo(() => ({
    number: NumberNode,
    compute: ComputeNode,
    csv: CSVNode,
    tableview: TableViewNode,
    cleantable: CleanTableNode,
    selectcolumns: SelectColumnsNode,
    renamecolumn: RenameColumnNode,
    fillnull: FillNullNode,
    dropnull: DropNullNode,
    deduplicate: DeduplicateNode,
    column: ColumnNode,
    aggregate: AggregateNode,
    filter: FilterNode,
    array: ArrayNode,
    pastecsv: PasteCSVNode,
    sort: SortNode,
    normalize: NormalizeNode,
    barchart: BarChartNode,
    linechart: LineChartNode,
    distinct: DistinctNode,
    limit: LimitNode,
    sample: SampleNode,
    tablefilter: TableFilterNode,
    tablesort: TableSortNode,
    groupby: GroupByNode,
    exportcsv: ExportCSVNode,
    histogram: HistogramNode,
    scatter: ScatterPlotNode,
  }), []);

  const updateNodeData = useCallback((nodeId, partial) => {
    setNodes((prev) => {
      const updated = prev.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...partial } } : n));
      return recomputeValues(updated, edges);
    });
  }, [edges]);

  const deleteNode = useCallback((nodeId) => {
    setEdges((prevEdges) => {
      const nextEdges = prevEdges.filter((e) => e.source !== nodeId && e.target !== nodeId);
      setNodes((prevNodes) => recomputeValues(prevNodes.filter((n) => n.id !== nodeId), nextEdges));
      return nextEdges;
    });
  }, []);

  const nodesWithFns = useMemo(
    () => nodes.map((n) => ({ ...n, data: { ...n.data, onChange: updateNodeData, onDelete: deleteNode } })),
    [nodes, updateNodeData, deleteNode],
  );

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => {
        const updated = applyNodeChanges(changes, nodesSnapshot);
        return recomputeValues(updated, edges);
      }),
    [edges],
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((edgesSnapshot) => {
        const nextEdges = applyEdgeChanges(changes, edgesSnapshot);
        setNodes((nodesSnapshot) => recomputeValues(nodesSnapshot, nextEdges));
        return nextEdges;
      });
    },
    [],
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((edgesSnapshot) => {
        const nextEdges = addEdge(params, edgesSnapshot);
        setNodes((nodesSnapshot) => recomputeValues(nodesSnapshot, nextEdges));
        return nextEdges;
      });
    },
    [],
  );

  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData('application/reactflow');
    if (!raw) return;
    let item;
    try { item = JSON.parse(raw); } catch { return; }
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const id = Math.random().toString(36).slice(2, 9);
    const base = { id, type: item.type, position, data: {} };
    if (item.type === 'number') base.data = { value: 0 };
    if (item.type === 'compute') base.data = { op: '+' };
    if (item.type === 'aggregate') base.data = { agg: 'sum' };
    if (item.type === 'filter') base.data = { op: '>', threshold: 0 };
    if (item.type === 'array') base.data = { values: [] };
    if (item.type === 'pastecsv') base.data = { text: '' };
    if (item.type === 'sort') base.data = { dir: 'asc' };
    if (item.type === 'normalize') base.data = { method: 'minmax' };
    if (item.type === 'tableview') base.data = { size: 10, page: 1 };
    if (item.type === 'limit') base.data = { count: 10 };
    if (item.type === 'sample') base.data = { count: 5, seed: 42 };
    setNodes((prev) => [...prev, base]);
  }, [screenToFlowPosition]);

  return (
    <ReactFlow
      nodes={nodesWithFns}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      nodeTypes={nodeTypes}
      fitView
    />
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'grid', gridTemplateColumns: '220px 1fr' }}>
      <Sidebar />
      <div style={{ position: 'relative' }}>
        <ReactFlowProvider>
          <FlowCanvas />
        </ReactFlowProvider>
      </div>
    </div>
  );
}