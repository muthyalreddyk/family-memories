# Design Brief

**Tone & Purpose**: Warm editorial aesthetic celebrating family connection through a lived-in photo album experience. Every interaction feels intentional and intimate, never sterile or clinical.

**Color Palette**:
| Token | OKLCH | Purpose |
|-------|-------|---------|
| Primary | 0.60 0.15 45 | Terra cotta accent for CTAs, memory highlights, active states |
| Background | 0.96 0.02 80 | Soft warm cream, breathing room around content |
| Card | 0.98 0.01 0 | Off-white memory cards, subtle warmth |
| Foreground | 0.18 0.02 40 | Deep warm brown for readable text |
| Secondary | 0.72 0.04 70 | Warm taupe for secondary accents and metadata |
| Border | 0.92 0.01 70 | Light warm dividers, subtle structure |
| Muted | 0.88 0.02 70 | Dates, upload info, supporting text |

**Typography**:
- Display: Fraunces (serif) — headers, memory titles. Weight 600–700 for warmth and hierarchy.
- Body: Figtree (humanist sans) — descriptions, dates, metadata. Weight 400–500 for warmth and accessibility.
- Mono: Geist Mono — technical info if needed. Weight 400.

**Shape Language**:
- Border radius: 12px (generous rounded corners on cards, buttons, inputs for approachability).
- Spacing: 8px grid, generous padding inside cards (16–24px). Memory feed has breathing room between cards.
- Shadows: Subtle warm shadows (shadow-card: 0 2px 8px / 0.08α, shadow-elevated: 0 8px 24px / 0.12α).

**Structural Zones**:
| Zone | Background | Treatment | Purpose |
|------|-----------|-----------|---------|
| Header | 0.96 0.02 80 | Subtle border-bottom, primary text on warm background | Navigation, user status, logout |
| Main Feed | 0.96 0.02 80 | Default background with card grid | Memory card display, centered column |
| Cards | 0.98 0.01 0 | shadow-card, rounded-lg, 16px padding | Individual memory containers |
| Detail View | 0.96 0.02 80 | Modal or full-width with card-background panel | Enlarged memory, full story text, actions |
| Footer | 0.96 0.02 80 | Border-top, muted text, center-aligned | Copyright, branding |

**Component Patterns**:
- Buttons: Primary (bg-primary, text-primary-foreground) with shadow-card on hover. Secondary uses border + text-secondary.
- Inputs: bg-input, border-border, focus:ring-ring with 2px offset. Placeholder text in muted-foreground.
- Cards: bg-card, shadow-card, rounded-lg, p-4 | p-6 depending on density.
- Grid: Responsive (1 col mobile, 2 col tablet, 3 col desktop via Tailwind breakpoints).

**Motion**:
- Transitions: transition-smooth (0.3s cubic-bezier) on all interactive elements.
- Entrance: Fade-in on memory cards (optional).
- Hover: Subtle shadow elevation and text color shift.

**Constraints**:
- No gradients, no blur effects, no animations beyond smooth transitions.
- Maintain WCAG AA+ contrast in both light and dark modes.
- Typography hierarchy: H1 (32px), H2 (24px), H3 (18px), Body (16px), Small (14px).

**Signature Detail**: Memory cards feel like personal treasures—warm shadows create perceived depth, generous padding creates intimacy, serif headers anchor nostalgia. Each card is a moment of pause.

