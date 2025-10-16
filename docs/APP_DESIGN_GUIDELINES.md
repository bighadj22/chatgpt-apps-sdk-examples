# OpenAI App Design Guidelines

This document summarizes the key design and user experience guidelines for building apps on the OpenAI platform, as outlined in the official documentation.

## Core Principles

Your app should adhere to these five core principles to ensure a seamless and valuable user experience within ChatGPT.

- **Conversational:** Experiences should feel like a natural extension of ChatGPT, fitting seamlessly into the conversational flow and UI.
- **Intelligent:** Tools should be aware of conversation context, supporting and anticipating user intent. Responses and UI should feel individually relevant.
- **Simple:** Each interaction should focus on a single clear action or outcome. Information and UI should be reduced to the absolute minimum to support the context.
- **Responsive:** Tools should feel fast and lightweight, enhancing conversation rather than overwhelming it.
- **Accessible:** Designs must support a wide range of users, including those who rely on assistive technologies.

## Best Practices

### Good Use Cases
- Tasks that fit naturally into a conversation (booking, ordering, scheduling, quick lookups).
- Time-bound or action-oriented tasks with a clear start and end.
- Information that is valuable in the moment and can be acted upon immediately.
- Content that can be summarized visually and simply.
- Features that extend ChatGPT in an additive or differentiated way.

### Poor Use Cases
- Displaying long-form or static content better suited for a website.
- Complex, multi-step workflows.
- Using the space for ads, upsells, or irrelevant messaging.
- Surfacing sensitive or private information directly in a card.
- Duplicating ChatGPT’s native system functions (e.g., recreating the input composer).

## Display Modes

### 1. Inline
Appears directly in the flow of conversation, before the model's response.

#### Inline Card
A lightweight, single-purpose widget for quick confirmations, simple actions, or visual aids.

**Rules:**
- **Actions:** Limit to a maximum of two primary actions.
- **Navigation:** No deep navigation, tabs, or multiple views within a card.
- **Scrolling:** No nested or internal scrolling.
- **Inputs:** Do not replicate ChatGPT features like input boxes.

#### Inline Carousel
A set of 3-8 cards presented side-by-side for scanning multiple options.

**Rules:**
- **Content:** Each item should have an image/visual, a title, and minimal metadata (max 2-3 lines).
- **Actions:** Each card may have a single, optional Call to Action (CTA).
- **Consistency:** Maintain a consistent visual hierarchy across all cards.

### 2. Fullscreen
An immersive experience for multi-step workflows or deeper exploration, with the ChatGPT composer always present.

**Rules:**
- **Integration:** Design your UX to work with the ever-present system composer.
- **Purpose:** Use it to deepen engagement, not to replicate your entire native app.

### 3. Picture-in-Picture (PiP)
A persistent floating window for ongoing sessions that run in parallel with the conversation (e.g., games, videos).

**Rules:**
- **Interactivity:** The PiP state should be able to update or respond to user interaction via the composer.
- **Lifecycle:** Close the PiP window automatically when the session ends.
- **Simplicity:** Do not overload with controls or static content.

## Visual Design Guidelines

### Color
- **System First:** Use system-defined colors for text, icons, and structural elements.
- **Branding:** Brand accent colors are permitted on primary buttons, logos, or icons.
- **Don't:**
    - Override background or text colors.
    - Apply colors to text area backgrounds.
    - Use custom gradients or patterns.

### Typography
- **System Font:** Always inherit the system font stack (SF Pro on iOS, Roboto on Android) and respect system sizing rules.
- **Styling:** Use bold, italic, or highlights only within content areas, not for structural UI.
- **Simplicity:** Limit variations in font size.
- **Don't:** Use custom fonts.

### Spacing & Layout
- **Grid:** Use system grid spacing for consistent alignment.
- **Padding:** Keep padding consistent; avoid edge-to-edge text.
- **Hierarchy:** Maintain a clear visual order (headline, supporting text, CTA).

### Icons & Imagery
- **Style:** Use system icons or custom icons that are monochromatic and outlined.
- **Logo:** Do not include your logo as part of the response content; ChatGPT appends it automatically.
- **Aspect Ratio:** All imagery must follow enforced aspect ratios.

## Accessibility
- **Contrast:** Text and background must maintain a minimum WCAG AA contrast ratio.
- **Alt Text:** Provide alt text for all images.
- **Resizing:** Support text resizing without breaking layouts.

## Tone & Proactivity

### Tone of Voice
- **Ownership:** ChatGPT sets the overall voice; your app provides content within that framework.
- **Content Style:** Be concise, scannable, context-driven, helpful, and clear.
- **Avoid:** Spam, jargon, or promotional language.

### Proactivity
- **Allowed:** Contextual nudges or reminders tied to user intent (e.g., "Your order is ready").
- **Not Allowed:** Unsolicited promotions, upsells, or re-engagement attempts without clear context.
- **Transparency:** Always be clear about why your tool is resurfacing.
