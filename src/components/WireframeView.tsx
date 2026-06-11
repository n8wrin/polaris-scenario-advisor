import type { LayoutRegion } from '../types';

interface Props {
  region: LayoutRegion;
  depth?: number;
}

const DEPTH_COLORS = [
  { bg: '#f6f6f7', border: '#8c9196' },
  { bg: '#ffffff', border: '#b5bcbf' },
  { bg: '#f1f8f5', border: '#95c9b4' },
  { bg: '#f4f0ff', border: '#b89ee0' },
];

export function WireframeView({ region, depth = 0 }: Props) {
  const colors = DEPTH_COLORS[Math.min(depth, DEPTH_COLORS.length - 1)];
  const hasChildren = region.children && region.children.length > 0;

  return (
    <div
      style={{
        border: `1.5px dashed ${colors.border}`,
        borderRadius: 6,
        background: colors.bg,
        padding: hasChildren ? '8px' : '12px 10px',
        display: 'flex',
        flexDirection: region.direction === 'row' ? 'row' : 'column',
        gap: 8,
        minWidth: 0,
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
          flexShrink: 0,
          ...(hasChildren && region.direction === 'row'
            ? {}
            : hasChildren
            ? { marginBottom: 4 }
            : {}),
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            color: '#202223',
            letterSpacing: 0.2,
            textTransform: 'uppercase',
          }}
        >
          {region.label}
        </span>
        {region.note && (
          <span
            style={{
              fontSize: 11,
              color: '#6d7175',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
            }}
          >
            — {region.note}
          </span>
        )}
      </div>

      {hasChildren && (
        <div
          style={{
            display: 'flex',
            flexDirection: region.direction === 'row' ? 'row' : 'column',
            gap: 8,
            flex: 1,
            minWidth: 0,
          }}
        >
          {region.children!.map((child, i) => (
            <WireframeView key={i} region={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
