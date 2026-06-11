import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

const POLARIS_COMPONENTS = `
## Page
Purpose: Top-level wrapper for every admin page. Provides consistent title, breadcrumbs, and primary/secondary actions.
When to use: Every full-page view. Use for settings pages, detail views, list pages, and creation flows.
When NOT to use: Don't nest Pages. Don't use for modal or panel content.
Key props: title, subtitle, breadcrumbs, primaryAction (one), secondaryActions (menu), titleMetadata (badges next to title), backAction.
Common scenarios: Product detail pages, settings screens, order views, report pages.
Rework signal: If a developer is building a custom page header, redirect to Page.
Doc URL: https://polaris.shopify.com/components/layout-and-structure/page

## Card
Purpose: The primary container for grouped related content on a page. Creates visual separation between sections.
When to use: Any logical grouping of content — a settings section, product info block, summary panel. Most page content should be in Cards.
When NOT to use: Don't use Card as a button/link (use ResourceItem or a custom selectable item). Don't nest Cards.
Key props: title (optional), actions (header actions), sectioned (padding + dividers between child sections).
Common scenarios: Settings sections, product summaries, order line items, dashboard metrics.
Doc URL: https://polaris.shopify.com/components/layout-and-structure/card

## Layout / Layout.Section
Purpose: Two-column page layout. Splits content into a main section and an optional sidebar.
When to use: When a page has a primary content area and supplementary content (help text, summary, related info).
When NOT to use: Don't use for full-width pages with a single content area — just stack Cards instead.
Key props: Layout.Section oneThird, oneHalf, or default (two-thirds). Layout.Section.secondary for sidebar.
Common scenarios: Settings pages (form + help text sidebar), product edit (details + media/status sidebar), order view.
Rework signal: If someone's building a custom two-column grid on an admin page, suggest Layout.
Doc URL: https://polaris.shopify.com/components/layout-and-structure/layout

## IndexTable
Purpose: The primary data table for admin resource lists. Handles sorting, bulk actions, pagination, and row selection out of the box.
When to use: Displaying a list of resources (products, orders, customers, discounts) where users need to browse, sort, and take bulk actions.
When NOT to use: Don't use for non-resource data (reports, analytics) — use a plain table or custom layout. Don't use for fewer than 5 rows.
Key props: columns, rows, selectable, bulkActions, sortable, loading, emptyState, pagination.
Common scenarios: Products list, orders list, customers list, any admin list with bulk actions.
Rework signal: If the scenario implies a "custom table" or "data grid," point to IndexTable first. It handles selection, sorting, and bulk actions that teams often rebuild.
Doc URL: https://polaris.shopify.com/components/tables/index-table

## ResourceList
Purpose: Simplified list for resources that don't need a full table structure. Items are clickable rows with flexible content.
When to use: When items have variable or rich content that doesn't fit table columns (e.g., product thumbnails + title + status). Fewer structured columns than IndexTable.
When NOT to use: Don't use when you need sortable columns — use IndexTable. Don't use for purely tabular data.
Key props: items, renderItem, filterControl, loading, emptyState, sortOptions.
Common scenarios: Search results, collections of mixed-format items, simple admin lists without sortable columns.
Doc URL: https://polaris.shopify.com/components/lists/resource-list

## Form
Purpose: Wrapper for form content. Handles submit behavior and implicit enter-key submission.
When to use: Wrap all form inputs in Form to get correct submit behavior. Pairs with FormLayout for consistent spacing.
Key props: onSubmit, implicitSubmit.
Doc URL: https://polaris.shopify.com/components/selection-and-input/form

## FormLayout / FormLayout.Group
Purpose: Provides consistent spacing and layout between form fields. Groups related fields side-by-side.
When to use: Inside any Form. Use FormLayout.Group to place two fields on the same row (e.g., first name + last name, city + postal code).
Doc URL: https://polaris.shopify.com/components/selection-and-input/form-layout

## TextField
Purpose: Single-line and multi-line text input. The most common form field in admin.
When to use: Any free-text input — names, descriptions, search, numbers, email, URL.
Key props: label, type (text/email/number/password/tel/url/search), helpText, error, multiline, prefix, suffix, maxLength, requiredIndicator, clearButton.
Common scenarios: Product title, price fields (with prefix "$"), description (multiline), email input, search.
Rework signal: If a custom input is being built, check if TextField with prefix/suffix covers the case.
Doc URL: https://polaris.shopify.com/components/selection-and-input/text-field

## Select
Purpose: Dropdown for choosing a single value from a short, known list.
When to use: Static lists under ~15 options where all options are known upfront.
When NOT to use: Don't use for long or dynamic lists — use Combobox or Autocomplete instead.
Key props: label, options, value, onChange, helpText, error.
Common scenarios: Country selector (if short), status selection, category assignment.
Doc URL: https://polaris.shopify.com/components/selection-and-input/select

## Checkbox
Purpose: Boolean toggle for a single option. Can also be used in groups for multi-select.
When to use: Individual on/off settings, agreement to terms, enabling features.
Key props: label, checked, onChange, helpText.
Doc URL: https://polaris.shopify.com/components/selection-and-input/checkbox

## ChoiceList
Purpose: Group of radio buttons or checkboxes. Better than raw checkboxes for grouped options.
When to use: Selecting one (allowMultiple: false) or more (allowMultiple: true) from a defined set of options.
Common scenarios: Notification frequency (daily/weekly/never), visibility settings, feature flag toggles.
Doc URL: https://polaris.shopify.com/components/selection-and-input/choice-list

## Button / ButtonGroup
Purpose: Primary interactive element for actions. ButtonGroup aligns multiple buttons together.
When to use: Any user action. Use primary for the most important action on a page or section.
When NOT to use: Don't use more than one primary button per section. Don't use buttons for navigation — use Link.
Key props: variant (primary/secondary/tertiary/plain/destructive), size (slim/medium/large), disabled, loading, url, fullWidth, icon.
Common scenarios: Save, cancel, delete (destructive), create new, apply filter.
Rework signal: Scenario implying a styled anchor tag → check Button with url prop.
Doc URL: https://polaris.shopify.com/components/actions/button

## Banner
Purpose: Persistent contextual messaging — for system states, warnings, errors, or informational content.
When to use: Status messages tied to a page or section, form submission errors, upgrade prompts, warnings about state.
When NOT to use: Don't use Banner for transient feedback after an action (use Toast). Don't use for field-level validation errors (use TextField error prop).
Key props: title, status (info/success/warning/critical), action, onDismiss, tone.
Common scenarios: "Your plan doesn't include this feature," "3 products have errors," "Trial ends in 5 days."
Rework signal: Custom alert box or highlighted message box → Banner.
Doc URL: https://polaris.shopify.com/components/feedback-indicators/banner

## Modal
Purpose: Focused overlay for tasks that require user input or confirmation before continuing.
When to use: Confirmations (delete, irreversible action), focused data entry, alerts requiring acknowledgment.
When NOT to use: Don't use for navigation. Don't nest modals. Don't use for complex multi-step flows.
Key props: open, onClose, title (required), primaryAction, secondaryActions, size (small/medium/large/fullscreen), sectioned.
Common scenarios: Delete confirmation, bulk action confirmation, quick add form, image preview.
Doc URL: https://polaris.shopify.com/components/overlays/modal

## Badge
Purpose: Small label that communicates status, category, or metadata at a glance.
When to use: Status indicators (active/draft/archived), count badges, category tags. Keep text to 1–2 words.
When NOT to use: Don't use as an interactive element — use Button or Tag. Don't overuse; badge density hurts readability.
Key props: status/tone (info/success/warning/critical/attention/new), size, progress (complete/incomplete/partiallyComplete).
Common scenarios: Product status (Active/Draft), order fulfillment status, plan tier labels.
Doc URL: https://polaris.shopify.com/components/feedback-indicators/badge

## EmptyState
Purpose: Structured placeholder for when a list, table, or view has no content.
When to use: First-time use of a feature, filtered list with no results, no-permission state, error loading state.
Key props: heading, image/illustration, action (primary CTA), secondaryAction, children (body text).
Common scenarios: "No products yet — add your first product," "No results for this filter."
Doc URL: https://polaris.shopify.com/components/layout-and-structure/empty-state

## Filters
Purpose: Filter bar for IndexTable and ResourceList. Provides query search, filter chips, and saved views.
When to use: Any list/table that users need to filter by multiple criteria.
When NOT to use: Don't build custom filter UI when Filters covers the pattern.
Key props: filters (filter definitions), appliedFilters, onQueryChange, onClearAll, queryValue.
Common scenarios: Product list filters (status, vendor, type), order filters (fulfillment, payment, date).
Rework signal: Custom filter pills or custom search + dropdown combos → check Filters component.
Doc URL: https://polaris.shopify.com/components/selection-and-input/filters

## Tabs
Purpose: Segment content within a page section. Switches between related views without page navigation.
When to use: When content can be logically divided into 2–5 views sharing the same context.
When NOT to use: Don't use tabs for different pages — use navigation. Don't use more than 5–6 tabs.
Key props: tabs, selected, onSelect, fitted (equal-width tabs).
Common scenarios: Product list status tabs (All/Active/Draft), order view tabs (Summary/Timeline/Shipping).
Doc URL: https://polaris.shopify.com/components/navigation/tabs

## Toast
Purpose: Transient confirmation message. Appears briefly after an action and auto-dismisses.
When to use: Confirming that a user action succeeded (saved, copied, deleted).
When NOT to use: Don't use for errors that block workflow — use Banner or inline errors.
Key props: content, duration, onDismiss, action (optional, e.g., Undo).
Common scenarios: "Saved," "Copied to clipboard," "Product deleted" (with Undo action).
Doc URL: https://polaris.shopify.com/components/feedback-indicators/toast

## Popover / ActionList
Purpose: Popover is a contextual overlay anchored to a trigger. ActionList is the menu pattern inside it.
When to use: Overflow menus, contextual actions on table rows, secondary action dropdowns.
When NOT to use: Don't use for complex forms or content requiring a lot of vertical space — use Modal or Sheet.
Key props: Popover: active, activator, onClose. ActionList: items (each with content, onAction, destructive, disabled).
Common scenarios: Row overflow menu in IndexTable, "More actions" button, bulk action menu.
Doc URL: https://polaris.shopify.com/components/overlays/popover

## Pagination
Purpose: Controls for navigating through paginated content.
When to use: Any list with more items than can display on one page.
Key props: hasPrevious, hasNext, onPrevious, onNext, label.
Doc URL: https://polaris.shopify.com/components/navigation/pagination
`;

const PERSONA_CONTEXT: Record<string, string> = {
  product: `The user is a PRODUCT PERSON. They write requirements and need to know what the system can do.
Emphasize: What components exist and what they're capable of. Plain-language capability summary. Constraints they need to put in requirements. Component names they can reference in specs.
De-emphasize: Props, code, visual anatomy details.`,
  designer: `The user is a DESIGNER. They select and compose components to meet requirements.
Emphasize: Component recommendations with rationale. When-to-use vs. alternatives. Layout suggestion with visual context. Anatomy notes. Which variants fit this scenario.
De-emphasize: Code snippets, prop types.`,
  developer: `The user is a DEVELOPER. They implement the design using Polaris components.
Emphasize: Exact component names, relevant props and variants for this scenario, short code patterns, API doc links. Practical implementation notes.
De-emphasize: High-level rationale they already understand.`,
};

const SYSTEM_PROMPT = `You are the Polaris Scenario Advisor — an expert on Shopify's Polaris design system.

Your knowledge base of Polaris components:

${POLARIS_COMPONENTS}

When given a scenario (and optional persona), analyze what the user is building and return a structured JSON recommendation.

IMPORTANT: Return ONLY valid JSON with no markdown fences, no extra text.

JSON schema:
{
  "summary": "string — persona-appropriate 2-3 sentence overview",
  "components": [
    {
      "name": "string — exact Polaris component name",
      "rationale": "string — why this component fits THIS scenario specifically",
      "relevantVariants": ["string"] or omit,
      "codeSnippet": "string — developer persona only: 5–15 line JSX snippet showing the key props for this specific scenario. Omit for product/designer personas.",
      "docUrl": "string"
    }
  ],
  "layout": {
    "description": "string — prose description of the suggested layout",
    "regions": {
      "label": "string",
      "note": "string or omit",
      "direction": "row or column or omit",
      "children": [] or omit
    }
  },
  "guidance": [
    { "component": "string", "do": "string", "avoid": "string or omit" }
  ],
  "warnings": [
    { "trigger": "string", "warning": "string", "suggestion": "string" }
  ]
}

Rules:
- Only recommend components from your knowledge base
- Make rationale specific to the scenario
- If the scenario implies custom UI that Polaris already solves, flag as a rework warning
- 3–7 components is typical
- warnings can be empty []
- codeSnippet: only include when persona is developer. Show the most scenario-relevant props — not every prop. No import statements. Use realistic values that match the scenario, not placeholder text. Escape any backtick or backslash characters in the JSON string.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { scenario, persona, conversationHistory = [] } = req.body as {
    scenario: string;
    persona: string | null;
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  };

  if (!scenario?.trim()) {
    return res.status(400).json({ error: 'scenario is required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const client = new Anthropic({ apiKey });

  const personaInstruction = persona && PERSONA_CONTEXT[persona]
    ? `\n\nPersona context: ${PERSONA_CONTEXT[persona]}`
    : '';

  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: `Scenario: ${scenario}${personaInstruction}` },
  ];

  // Stream SSE so the connection stays alive and we don't hit Vercel's timeout
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages,
    });

    stream.on('text', (text) => {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    });

    await stream.finalMessage();
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.end();
  }
}
