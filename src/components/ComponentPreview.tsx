import type { CSSProperties, ReactNode } from 'react';

// ─── shared design tokens ───────────────────────────────────────────────────
const G = {
  green: '#008060', greenL: '#dffcf0',
  text: '#202223', gray2: '#c9cccf', gray3: '#8c9196',
  border: '#e1e3e5', surface: '#f6f6f7', white: '#ffffff',
  red: '#d72c0d', redL: '#fff4f4',
  yellow: '#ffc453', yellowL: '#fff8e1',
  purple: '#6d33d0', purpleL: '#f4f0ff',
  dark: '#1b1f2e',
};

// ─── tiny layout helpers ────────────────────────────────────────────────────
function Row({ gap = 6, children, style }: { gap?: number; children: ReactNode; style?: CSSProperties }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap, ...style }}>{children}</div>;
}
function Col({ gap = 6, children, style }: { gap?: number; children: ReactNode; style?: CSSProperties }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }}>{children}</div>;
}
function Bar({ w, h = 4, bg = G.gray2, r = 2, mt }: { w: number | string; h?: number; bg?: string; r?: number; mt?: number }) {
  return <div style={{ width: w, height: h, background: bg, borderRadius: r, flexShrink: 0, marginTop: mt }} />;
}
function Pill({ label, bg, color }: { label: string; bg: string; color: string }) {
  return <div style={{ background: bg, color, borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</div>;
}
function Btn({ label, primary }: { label: string; primary?: boolean }) {
  return <div style={{ background: primary ? G.green : G.white, color: primary ? G.white : G.text, border: primary ? 'none' : `1px solid ${G.border}`, borderRadius: 4, padding: '4px 10px', fontSize: 10, fontWeight: primary ? 600 : 400, whiteSpace: 'nowrap' }}>{label}</div>;
}
function MockInput({ label, value, prefix }: { label: string; value?: string; prefix?: string }) {
  return (
    <Col gap={3}>
      <Bar w={label.length * 4.5} h={3} bg={G.gray3} />
      <Row gap={0} style={{ border: `1.5px solid ${G.border}`, borderRadius: 4, background: G.white, height: 22, overflow: 'hidden' }}>
        {prefix && <div style={{ padding: '0 6px', background: G.surface, borderRight: `1px solid ${G.border}`, display: 'flex', alignItems: 'center' }}><Bar w={6} bg={G.gray3} /></div>}
        <div style={{ flex: 1, padding: '0 8px', display: 'flex', alignItems: 'center' }}><Bar w={value ?? '55%'} bg={G.gray2} /></div>
      </Row>
    </Col>
  );
}

// ─── individual component previews ──────────────────────────────────────────

function PagePreview() {
  return (
    <Col gap={5}>
      <Row gap={4}><Bar w={28} h={3} bg={G.gray3} /><span style={{ color: G.gray3, fontSize: 8 }}>/</span><Bar w={36} h={3} bg={G.gray3} /></Row>
      <Row style={{ justifyContent: 'space-between' }}>
        <Bar w={80} h={7} bg={G.text} r={3} />
        <Row gap={5}><Btn label="Discard" /><Btn label="Save" primary /></Row>
      </Row>
      <div style={{ height: 1, background: G.border }} />
      <div style={{ border: `1px solid ${G.border}`, borderRadius: 4, background: G.white, padding: '8px 10px' }}>
        <Bar w="75%" h={4} /><Bar w="55%" h={3} bg={G.gray3} mt={5} />
      </div>
    </Col>
  );
}

function CardPreview() {
  return (
    <div style={{ border: `1px solid ${G.border}`, borderRadius: 6, background: G.white, overflow: 'hidden' }}>
      <Row style={{ justifyContent: 'space-between', padding: '8px 12px', borderBottom: `1px solid ${G.border}` }}>
        <Bar w={60} h={5} bg={G.text} />
        <Bar w={28} h={4} bg={G.green} />
      </Row>
      <Col gap={5} style={{ padding: '10px 12px' }}>
        <Bar w="90%" /><Bar w="75%" /><Bar w="60%" />
      </Col>
    </div>
  );
}

function LayoutPreview() {
  return (
    <Row gap={6} style={{ alignItems: 'stretch', height: 80 }}>
      <div style={{ flex: 2, border: `1px solid ${G.border}`, borderRadius: 4, background: G.white, padding: 8 }}>
        <Bar w={70} h={5} bg={G.text} r={3} />
        <Bar w="90%" mt={8} /><Bar w="75%" h={3} bg={G.gray3} mt={5} />
      </div>
      <div style={{ flex: 1, border: `1px solid ${G.border}`, borderRadius: 4, background: G.surface, padding: 8 }}>
        <Bar w="70%" h={4} bg={G.gray3} />
        <Bar w="100%" mt={8} /><Bar w="80%" mt={5} />
      </div>
    </Row>
  );
}

function IndexTablePreview() {
  return (
    <Col gap={0}>
      <Row gap={8} style={{ background: G.surface, padding: '4px 8px', border: `1px solid ${G.border}`, borderRadius: '4px 4px 0 0' }}>
        <div style={{ width: 10, height: 10, border: `1.5px solid ${G.gray2}`, borderRadius: 2 }} />
        <Bar w={50} h={4} bg={G.gray3} /><Bar w={35} h={4} bg={G.gray3} /><div style={{ marginLeft: 'auto' }} /><Bar w={16} h={4} bg={G.gray3} />
      </Row>
      {[G.green, G.gray2, G.gray2].map((_c, i) => (
        <Row key={i} gap={8} style={{ background: G.white, padding: '5px 8px', borderLeft: `1px solid ${G.border}`, borderRight: `1px solid ${G.border}`, borderBottom: `1px solid ${G.border}` }}>
          <div style={{ width: 10, height: 10, border: `1.5px solid ${G.gray2}`, borderRadius: 2, background: i === 0 ? G.green : G.white }} />
          <Bar w={55} h={4} /><div style={{ marginLeft: 'auto' }} />
          <Pill label={i === 0 ? 'Active' : 'Draft'} bg={i === 0 ? G.greenL : G.surface} color={i === 0 ? G.green : G.gray3} />
        </Row>
      ))}
    </Col>
  );
}

function ResourceListPreview() {
  return (
    <div style={{ border: `1px solid ${G.border}`, borderRadius: 6, background: G.white, overflow: 'hidden' }}>
      {[1, 2, 3].map((_, i) => (
        <Row key={i} gap={8} style={{ padding: '7px 10px', borderBottom: i < 2 ? `1px solid ${G.border}` : 'none' }}>
          <div style={{ width: 22, height: 22, background: G.surface, border: `1px solid ${G.border}`, borderRadius: 3, flexShrink: 0 }} />
          <Col gap={3} style={{ flex: 1 }}><Bar w="60%" h={4} bg={G.text} /><Bar w="40%" h={3} bg={G.gray3} /></Col>
          <Bar w={20} h={4} bg={G.green} />
        </Row>
      ))}
    </div>
  );
}

function TextFieldPreview() {
  return (
    <Col gap={10}>
      <MockInput label="Product title" value="65%" />
      <MockInput label="Price" value="35%" prefix="$" />
    </Col>
  );
}

function SelectPreview() {
  return (
    <Col gap={16}>
      <Col gap={4}>
        <Bar w={40} h={3} bg={G.gray3} />
        <Row style={{ justifyContent: 'space-between', border: `1.5px solid ${G.border}`, borderRadius: 4, background: G.white, padding: '0 8px', height: 28 }}>
          <Bar w="50%" /><span style={{ color: G.gray3, fontSize: 11 }}>▾</span>
        </Row>
        <Bar w={70} h={3} bg={G.gray3} />
      </Col>
    </Col>
  );
}

function CheckboxPreview() {
  return (
    <Col gap={10}>
      {[true, false, false].map((checked, i) => (
        <Row key={i} gap={8}>
          <div style={{ width: 14, height: 14, border: `2px solid ${checked ? G.green : G.gray2}`, borderRadius: 2, background: checked ? G.green : G.white, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {checked && <span style={{ color: G.white, fontSize: 9, lineHeight: 1 }}>✓</span>}
          </div>
          <Bar w={50 + i * 15} h={4} bg={i === 0 ? G.text : G.gray2} />
        </Row>
      ))}
    </Col>
  );
}

function ChoiceListPreview() {
  return (
    <Col gap={8}>
      <Bar w={55} h={5} bg={G.text} />
      {[true, false, false].map((sel, i) => (
        <Row key={i} gap={8}>
          <div style={{ width: 13, height: 13, border: `2px solid ${sel ? G.green : G.gray2}`, borderRadius: '50%', background: sel ? G.green : G.white, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {sel && <div style={{ width: 5, height: 5, background: G.white, borderRadius: '50%' }} />}
          </div>
          <Bar w={45 + i * 20} h={4} bg={i === 0 ? G.text : G.gray2} />
        </Row>
      ))}
    </Col>
  );
}

function ButtonPreview() {
  return (
    <Col gap={10}>
      <Row gap={6}><Btn label="Save" primary /><Btn label="Discard" /><div style={{ background: G.white, color: G.red, border: `1px solid ${G.red}`, borderRadius: 4, padding: '4px 10px', fontSize: 10 }}>Delete</div></Row>
      <Row gap={6}><Btn label="Plain" /><div style={{ background: G.white, border: 'none', color: G.green, fontSize: 10, padding: '4px 0' }}>Link action</div></Row>
      <Row gap={4} style={{ color: G.gray3, fontSize: 9 }}><span>primary</span><span>·</span><span>secondary</span><span>·</span><span>destructive</span></Row>
    </Col>
  );
}

function BannerPreview() {
  return (
    <Col gap={6}>
      {[
        { bg: G.greenL, bc: G.green, icon: 'ℹ', label: 'Product saved' },
        { bg: G.yellowL, bc: G.yellow, icon: '⚠', label: 'Trial ends in 3 days' },
        { bg: G.redL, bc: G.red, icon: '✕', label: 'Payment failed' },
      ].map(({ bg, bc, icon }, i) => (
        <Row key={i} gap={7} style={{ background: bg, border: `1px solid ${bc}`, borderRadius: 4, padding: '5px 8px' }}>
          <span style={{ fontSize: 10, color: bc, flexShrink: 0 }}>{icon}</span>
          <Bar w="65%" h={4} bg={bc} />
        </Row>
      ))}
    </Col>
  );
}

function ModalPreview() {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)', borderRadius: 4, zIndex: 0 }} />
      <div style={{ position: 'relative', margin: '2px 8px', background: G.white, borderRadius: 6, border: `1px solid ${G.border}`, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', zIndex: 1 }}>
        <Row style={{ justifyContent: 'space-between', padding: '7px 10px', borderBottom: `1px solid ${G.border}` }}>
          <Bar w={65} h={5} bg={G.text} /><span style={{ color: G.gray3, fontSize: 12 }}>✕</span>
        </Row>
        <Col gap={5} style={{ padding: '8px 10px' }}><Bar w="90%" /><Bar w="70%" bg={G.gray3} h={3} /></Col>
        <Row gap={6} style={{ justifyContent: 'flex-end', padding: '6px 10px', borderTop: `1px solid ${G.border}`, background: G.surface }}>
          <Btn label="Cancel" /><Btn label="Confirm" primary />
        </Row>
      </div>
    </div>
  );
}

function BadgePreview() {
  return (
    <Col gap={8}>
      <Row gap={6}><Pill label="Active" bg={G.greenL} color={G.green} /><Pill label="Draft" bg={G.surface} color={G.gray3} /><Pill label="Pending" bg={G.yellowL} color="#c05717" /></Row>
      <Row gap={6}><Pill label="Error" bg={G.redL} color={G.red} /><Pill label="New" bg={G.purpleL} color={G.purple} /></Row>
    </Col>
  );
}

function EmptyStatePreview() {
  return (
    <Col gap={8} style={{ alignItems: 'center', padding: '4px 0' }}>
      <div style={{ width: 38, height: 38, background: G.surface, border: `1px solid ${G.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📭</div>
      <Bar w={100} h={5} bg={G.text} r={3} />
      <Bar w={130} h={3} bg={G.gray3} />
      <Btn label="Get started" primary />
    </Col>
  );
}

function FiltersPreview() {
  return (
    <Col gap={6}>
      <Row gap={6} style={{ border: `1.5px solid ${G.border}`, borderRadius: 4, padding: '5px 8px', background: G.white }}>
        <span style={{ color: G.gray3, fontSize: 12 }}>⌕</span><Bar w="60%" h={4} bg={G.gray3} />
      </Row>
      <Row gap={5}>
        {['Status', 'Type', 'Vendor'].map(label => (
          <Row key={label} gap={3} style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 20, padding: '3px 8px', fontSize: 9 }}>
            <span>{label}</span><span style={{ color: G.gray3 }}>▾</span>
          </Row>
        ))}
      </Row>
      <Row gap={5}>
        <Row gap={4} style={{ background: G.greenL, border: `1px solid ${G.green}`, borderRadius: 20, padding: '2px 8px', fontSize: 9, color: G.green }}>
          <span>Active</span><span>✕</span>
        </Row>
      </Row>
    </Col>
  );
}

function TabsPreview() {
  const tabs = ['All', 'Active', 'Draft', 'Archived'];
  return (
    <Col gap={0}>
      <Row gap={0}>
        {tabs.map((t, i) => (
          <div key={t} style={{ padding: '6px 12px', fontSize: 10, color: i === 0 ? G.text : G.gray3, borderBottom: i === 0 ? `2px solid ${G.green}` : '2px solid transparent', fontWeight: i === 0 ? 600 : 400 }}>{t}</div>
        ))}
      </Row>
      <div style={{ height: 1, background: G.border }} />
      <div style={{ border: `1px solid ${G.border}`, borderTop: 'none', borderRadius: '0 0 4px 4px', background: G.white, padding: '10px 12px' }}>
        <Bar w="80%" h={4} /><Bar w="60%" h={3} bg={G.gray3} mt={6} />
      </div>
    </Col>
  );
}

function ToastPreview() {
  return (
    <Col style={{ justifyContent: 'flex-end', height: 70 }}>
      <Row gap={0} style={{ justifyContent: 'center' }}>
        <Row gap={10} style={{ background: G.dark, borderRadius: 6, padding: '8px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
          <span style={{ color: '#c9d1e0', fontSize: 10 }}>Saved successfully</span>
          <span style={{ color: G.green, fontSize: 10, fontWeight: 600 }}>Undo</span>
        </Row>
      </Row>
    </Col>
  );
}

function PopoverPreview() {
  return (
    <div style={{ position: 'relative', height: 95 }}>
      <Row gap={4} style={{ border: `1px solid ${G.border}`, borderRadius: 4, padding: '5px 10px', background: G.white, display: 'inline-flex' }}>
        <span style={{ fontSize: 10 }}>More actions</span><span style={{ color: G.gray3, fontSize: 10 }}>▾</span>
      </Row>
      <div style={{ position: 'absolute', top: 28, left: 0, background: G.white, border: `1px solid ${G.border}`, borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: 130 }}>
        {['Edit', 'Duplicate', 'Archive'].map(item => (
          <div key={item} style={{ padding: '6px 12px', fontSize: 10, color: G.text }}>{item}</div>
        ))}
        <div style={{ padding: '6px 12px', fontSize: 10, color: G.red, borderTop: `1px solid ${G.border}` }}>Delete</div>
      </div>
    </div>
  );
}

function PaginationPreview() {
  return (
    <Row gap={8} style={{ justifyContent: 'center', padding: '10px 0' }}>
      <div style={{ border: `1px solid ${G.border}`, borderRadius: 4, padding: '5px 12px', fontSize: 10, color: G.gray3, background: G.surface }}>← Prev</div>
      <span style={{ fontSize: 10, color: G.gray3 }}>2 of 8</span>
      <div style={{ border: `1px solid ${G.border}`, borderRadius: 4, padding: '5px 12px', fontSize: 10, color: G.text, background: G.white }}>Next →</div>
    </Row>
  );
}

function FormPreview() {
  return (
    <Col gap={8}>
      <MockInput label="Full name" value="60%" />
      <Row gap={6}><MockInput label="City" value="55%" /><MockInput label="ZIP" value="45%" /></Row>
      <Row style={{ justifyContent: 'flex-end' }}><Btn label="Save" primary /></Row>
    </Col>
  );
}

// ─── registry ────────────────────────────────────────────────────────────────

const PREVIEW_MAP: Record<string, () => JSX.Element> = {
  page: PagePreview,
  card: CardPreview,
  layout: LayoutPreview,
  indextable: IndexTablePreview,
  resourcelist: ResourceListPreview,
  textfield: TextFieldPreview,
  select: SelectPreview,
  checkbox: CheckboxPreview,
  choicelist: ChoiceListPreview,
  button: ButtonPreview,
  buttongroup: ButtonPreview,
  banner: BannerPreview,
  modal: ModalPreview,
  badge: BadgePreview,
  emptystate: EmptyStatePreview,
  filters: FiltersPreview,
  tabs: TabsPreview,
  toast: ToastPreview,
  popover: PopoverPreview,
  actionlist: PopoverPreview,
  pagination: PaginationPreview,
  form: FormPreview,
  formlayout: FormPreview,
};

function resolvePreview(name: string): (() => JSX.Element) | null {
  // Normalize: lowercase, strip spaces and special chars, try substrings
  const key = name.toLowerCase().replace(/[\s/.,]+/g, '');
  if (PREVIEW_MAP[key]) return PREVIEW_MAP[key];
  // Partial match — e.g. "Button / ButtonGroup" → "button"
  for (const k of Object.keys(PREVIEW_MAP)) {
    if (key.includes(k) || k.includes(key)) return PREVIEW_MAP[k];
  }
  return null;
}

// ─── public component ────────────────────────────────────────────────────────

export function ComponentPreview({ name }: { name: string }) {
  const Preview = resolvePreview(name);
  if (!Preview) return null;

  return (
    <div className="component-preview">
      <Preview />
    </div>
  );
}
