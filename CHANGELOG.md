# Changelog & Design Evolution

## [2026-11-19] - Specialized Skeleton Loaders & User Flow Redirection

### 1. Route-Specific Skeleton Loaders (Respective to Each Page's Design)
- **What was changed**: Replaced the previous single generic dashboard skeleton with bespoke, pixel-accurate skeleton loaders matching the exact visual layout of each individual view.
- **How it was earlier**:
  - `ProtectedRoute` and `PublicRoute` previously returned a generic dashboard layout (with statistics cards, folders, and forms table) on all routes whenever auth or data was loading.
  - Users navigating to `/ai-chat` or `/forms/:id/edit` or `/login` saw a brief flash of dashboard metric cards before the real page appeared.
- **What is updated**:
  - **AI Chat (`/ai-chat`)**: Renders `AIChatSkeleton` matching the AI Chat hero layout (Unified left sidebar + top profile/bell bar + welcome pill badge + big "Create a Form" title placeholder + centered search/prompt input bar with action button + 3 feature cards for AI / Blank / Templates + template chips).
  - **Dashboard & Forms (`/dashboard`, `/forms`)**: Renders `DashboardSkeleton` matching the forms manager (Sidebar + top search bar + forms title + 4 stats cards + 4 filter tabs + folders column + 6 table rows).
  - **Form Builder (`/forms/:formId/edit`, `/forms/new`)**: Renders `BuilderSkeleton` matching the 3-column studio layout (Sidebar + top navigation header + sub-header with publish actions + 5 workflow tabs + left field palette + center form canvas with field inputs + right property inspector).
  - **Auth Pages (`/login`, `/register`, `/reset-password`)**: Renders `AuthPageSkeleton` (minimal centered card with logo, title, input fields, and action button placeholder).
  - **Public Form Submission (`/form/:shareUrl`)**: Renders `FormRenderer` skeleton (centered standalone public form card with title, description, and 4 field blocks without any internal sidebars).
  - **Spreadsheet Responses (`ResponseViewer`)**: Renders spreadsheet table header and rows placeholder instead of prematurely showing "No responses yet".
  - **Form Analytics (`FormAnalytics`)**: Renders modal skeleton with 4 KPI cards and responsive bar chart placeholder instead of a spinner.
  - **User Responses (`UserResponses`)**: Renders search bar and response history card skeletons.
  - **Super Admin (`SuperAdminDashboard`)**: Renders Super Admin console skeleton with KPI cards and dual chart container blocks.

---

### 2. Sidebar Navigation Routing & View State Synchronization
- **What was changed**: Unified navigation handlers across all pages and fixed broken links where clicking items (such as "New Chat") inadvertently opened Settings.
- **How it was earlier**:
  - `EnhancedOorbFormsApp.tsx` did not handle `'ai-chat'` in `handleNavigate`. Clicking "New Chat" fell through to an unhandled ternary condition that defaulted to `<UserSettings />`.
  - `EnhancedOorbFormsApp.tsx` ignored `location.state.view`, preventing incoming navigation from opening Responses, Integrations, or Templates.
  - `AIChatInterface.tsx` rendered `<Sidebar>` without an `onNavigate` handler.
  - `Sidebar.tsx` highlighted both "Dashboard" and "Forms" simultaneously.
- **What is updated**:
  - `EnhancedOorbFormsApp.tsx` explicitly handles `'ai-chat'` and `'workflows'` by calling `navigate('/ai-chat')`.
  - Added full support for `location.state.view` so transitions to `my-responses`, `integrations`, `settings`, and `templates` render their respective views.
  - `AIChatInterface.tsx` now passes a dedicated `onNavigate` prop to `<Sidebar>`, allowing navigation to Dashboard, Forms, Responses, Templates, Integrations, and Settings.
  - `Sidebar.tsx` active state strictly evaluates `currentView === view`, ensuring single active item highlighting.
  - Added protected route `/forms` in `App.tsx` pointing to `EnhancedGESSIONSFormsApp`.

---

### 3. Form Builder Canvas Editing & Scrolling
- **What was changed**: Replaced hardcoded form builder display with live inline editing and fixed flexbox viewport clipping.
- **How it was earlier**:
  - Form canvas title and description were static text.
  - Field labels and options could not be clicked and edited directly on the canvas.
  - Canvas container used `display: flex; justify-content: center` on an `overflow-y-auto` element, cutting off fields at the bottom (e.g. Phone Number).
- **What is updated**:
  - Canvas title and description are inline editable on click or blur.
  - Field labels, options, and helper texts are inline editable directly in the canvas.
  - Replaced flex centering on the scroll container with `h-full min-h-0 overflow-y-auto` and centered card `mx-auto mb-16`.
  - Added live preview mode with toggle in `EnhancedFormBuilder.tsx`.

---

### 4. AI Chat Viewport Scrollbar (Slider) Alignment
- **What was changed**: Moved the scrollbar from the middle-right of the screen to the outer viewport edge in `AIChatInterface.tsx`.
- **How it was earlier**:
  - `overflow-y-auto` was placed directly on the centered `<main className="max-w-4xl mx-auto w-full overflow-y-auto">` container.
  - Because `max-w-4xl` was centered on the screen with `mx-auto`, the browser scrollbar attached to its right boundary, making the scrollbar "slider" appear in the middle of the screen to the left of the orange asterisk watermark.
- **What is updated**:
  - Moved `overflow-y-auto` to the full-width outer container (`<div className="flex-1 overflow-y-auto min-h-0">`), leaving `<main>` as a centered content child.
  - The scrollbar now sits at the right edge of the viewport.
  - Fixed residual `/forms-by-gessions` links to use `/dashboard`.

---

### 5. Sage Green Palette Theming for AI Chat Screen
- **What was changed**: Replaced the orange/terracotta theme of the `/ai-chat` screen with a refined muted sage & olive green palette derived from the user's reference color swatch.
- **How it was earlier**:
  - Main background was warm cream (`#FAF5EE`).
  - Brand accents, asterisk logo, watermark, sparkles, action icons, and buttons used vibrant orange (`#E8601C` / `#C94D10`).
  - Bottom-left decorative wave vectors used peach/clay shades (`#F5E3D3` and `#EED3BF`).
  - Action cards and recent form borders used terracotta borders (`#F6DAC7`, `#ECE5DA`).
- **What is updated**:
  - **Background**: Soft muted sage green (`#E5EBDC`) matching the reference swatch.
  - **Decorative Waves**: Soft celadon & moss curve layers (`#D6E0CA` and `#C8D4BA`).
  - **Watermark & Logo**: Calming olive-forest sage (`#7A9871` and `#3F6338`).
  - **Prompt Bar & Buttons**: Crisp white bar with `#CBD6BF` border and deep forest olive button (`#3F6338` hover `#324F2C`).
  - **Action Cards**: "Create with AI" card tinted in light tea sage (`#EEF5E7` with `#CBD8BD` border) with matching `#3F6338` icons and deep charcoal-forest text (`#1B271A`).
  - **Your Forms Section**: Subtle sage cards (`#EEF5E7` badge, `#CBD8BD` border) with matching forest links.
  - **Skeleton Sync**: Updated `AIChatSkeleton` in `App.tsx` to mirror this new sage theme during load states.

---

### 6. Alabaster Off-White Minimalist Theme for AI Chat Screen
- **What was changed**: Replaced the sage/green theme with the user's intended warm off-white / light alabaster linen palette (`#F7F7F5`) paired with clean charcoal typography and subtle tone-on-tone accents.
- **How it was earlier**:
  - Screen was styled with green/sage tones (`#E5EBDC`).
  - Watermark and button used forest green (`#3F6338`).
- **What is updated**:
  - **Background**: Modern, clean warm off-white / alabaster linen (`#F7F7F5`).
  - **Decorative Waves**: Soft neutral alabaster tones (`#EEEEEA` and `#E5E5DF`).
  - **Asterisk Watermark**: Subtle warm alabaster silhouette (`#B8B8B0` at 35% opacity) creating a refined background watermark.
  - **Brand & Logo**: Crisp charcoal (`#181816`).
  - **Prompt Bar & Button**: Pure white bar with `#E0E0DA` border, focused with subtle `#181816/15` ring, and sleek charcoal action button (`#181816` hover `#2E2E2A`).
  - **Action Cards**: "Create with AI" card in soft neutral linen tint (`#F0F0EB` with `#DFDFD8` border); other cards in pure white (`#FFFFFF` with `#E2E2DC` border).
  - **Your Forms Cards**: Pure white cards with `#E2E2DC` borders and charcoal accents.
  - **Skeleton Sync**: Updated `AIChatSkeleton` in `App.tsx` to match this minimalist alabaster palette.

---

### 7. Precise Background Calibration (`#f6f6f3`)
- **What was changed**: Adjusted background tone of the AI Chat workspace and skeleton loader to exact hex code `#f6f6f3`.
- **How it was earlier**: Background was set to `#F7F7F5`.
- **What is updated**:
  - `AIChatInterface.tsx`: Container background and notification bell ring updated to exact `#f6f6f3`.
  - `App.tsx`: `AIChatSkeleton` background updated to exact `#f6f6f3`.

---

### 8. Nordic Cloud Slate & Deep Midnight Theme (`#F4F6F9`)
- **What was changed**: Applied the crisp Nordic Cloud Slate palette (`#F4F6F9`) with Deep Midnight (`#0F172A`) typography and Royal Cobalt (`#2563EB`) interactive highlights for a modern high-end SaaS feel.
- **How it was earlier**:
  - Screen used flat `#f6f6f3` with monochrome charcoal borders.
- **What is updated**:
  - **Background**: Airy Nordic Cloud Slate (`#F4F6F9`).
  - **Decorative Waves**: Soft periwinkle-slate waves (`#E5EBF4` and `#D9E3F0`).
  - **Watermark & Logo**: Slate-400 watermark (`#94A3B8` at 30% opacity) and Deep Midnight logo (`#0F172A`).
  - **Prompt Bar & Button**: Pure white input box with `#CBD5E1` border, focused with `#2563EB/20` ring, and deep midnight button (`#0F172A` hover `#1E293B`).
  - **Action Cards**: "Create with AI" card styled in soft ice blue tint (`#F0F5FA` with `#CBDDEE` border, `#2563EB` icons); other cards in pure white (`#FFFFFF` with `#E2E8F0` border).
  - **Your Forms Section**: Pure white cards with `#E2E8F0` borders and cobalt hover interactions (`#2563EB`).
  - **Skeleton Sync**: Updated `AIChatSkeleton` in `App.tsx` with matching slate tones (`#F4F6F9` / `#E2E8F0` / `#CBD5E1`).

---

### 9. Royal Iris & Electric Violet Theme (`#F8F7FD` & `#6366F1`)
- **What was changed**: Replaced the cool slate theme with a vibrant, modern AI SaaS palette featuring soft lavender pearl mist (`#F8F7FD`), Electric Violet/Iris accents (`#6366F1`), and deep midnight-indigo typography (`#1E1B4B`).
- **How it was earlier**:
  - Screen was using cool grey/slate tones (`#F4F6F9`) with dark charcoal (`#0F172A`) and cobalt blue (`#2563EB`).
- **What is updated**:
  - **Background**: Soft luminous lavender pearl mist (`#F8F7FD`).
  - **Decorative Waves**: Gentle lavender-tinted waves (`#EDE9FE` and `#DDD6FE`).
  - **Watermark & Logo**: Soft periwinkle/iris watermark (`#818CF8` at 25% opacity) with Electric Violet logo (`#6366F1`).
  - **Prompt Bar & Button**: Pure white bar with `#CBD5E1` border, focused with `#6366F1/20` glow, and Electric Violet action button (`#6366F1` hover `#4F46E5`).
  - **Action Cards**: "Create with AI" card styled in light violet tint (`#F5F3FF` with `#DDD6FE` border and `#6366F1` icons/arrows); other cards in pure white with soft violet hover borders (`hover:border-[#6366F1]/40`).
  - **Your Forms Section**: Pure white cards with `#F5F3FF` icon container, `#DDD6FE` border, and `#6366F1` highlights.
  - **Skeleton Sync**: Updated `AIChatSkeleton` in `App.tsx` with `#F8F7FD` background, `#EDE9FE` wave tones, and `#DDD6FE` accents.

---

### 10. Warm Neutral Aesthetic Theme (`#FAF7F2` & `#5C4A3E`)
- **What was changed**: Applied the "Neutral" color scheme from the reference inspiration palette, featuring warm linen/sand canvas tones, warm espresso/mocha CTA buttons, and rich mocha typography.
- **How it was earlier**:
  - Screen was styled with Electric Violet (`#6366F1`) and lavender mist (`#F8F7FD`).
- **What is updated**:
  - **Background**: Warm natural linen/oat canvas (`#FAF7F2`).
  - **Decorative Waves**: Soft warm sand layers (`#EDE5D8` and `#E2D7C5`).
  - **Watermark & Logo**: Warm neutral stone watermark (`#D3C7B6` at 30% opacity) and rich mocha logo (`#5C4A3E`).
  - **Typography**: Deep espresso mocha headings (`#2C2520`) with warm taupe-gray secondary text (`#786E64`).
  - **Prompt Bar & Button**: Pure white bar with `#DDD5C7` warm border, focused with `#5C4A3E/15` ring, and deep warm mocha action button (`#5C4A3E` hover `#483A30`).
  - **Action Cards**: "Create with AI" card in warm oat tint (`#F5EFE6` with `#DDD5C7` border and `#5C4A3E` icons/arrows); other cards in pure white (`#FFFFFF` with `#EAE4DC` border and `#5C4A3E/40` hover).
  - **Your Forms Section**: Pure white cards with `#F5EFE6` icon containers, `#DDD5C7` badge borders, and `#5C4A3E` links/buttons.
  - **Skeleton Sync**: Updated `AIChatSkeleton` in `App.tsx` with `#FAF7F2` background and matching warm sand placeholder elements (`#E5DFD5`, `#F5EFE6`, `#DDD5C7`).

---

### 11. Full Website Cohesive Neutral Theme Rollout
- **What was changed**: Expanded the selected "Neutral" color scheme (`#FAF7F2` linen canvas, `#5C4A3E` mocha accents, `#F5EFE6` warm sand cards, `#2C2520` typography) across the entire application — including the shared Sidebar, Forms Dashboard, Form Builder Studio, User Responses, and Route Skeletons.
- **How it was earlier**:
  - `Sidebar.tsx` used vibrant orange (`#E8601C` / `#C94D10`) for the logo, active nav items, badges, and terracotta plan cards.
  - `FormDashboard.tsx` had bright orange asterisk watermark, orange stats icon containers, orange checkboxes, and bright purple completion rate card.
  - `EnhancedFormBuilder.tsx` used terracotta buttons (`#C94D10`), orange selection dashed borders (`#E8601C`), orange tabs, and orange radio/checkbox accents.
  - Skeletons in `App.tsx` were on legacy `#FAF8F5` background.
  - `UserResponses.tsx` used default indigo tones (`#6366F1` / `bg-indigo-50`).
- **What is updated**:
  - **Shared Sidebar (`Sidebar.tsx`)**:
    - Logo updated to `#5C4A3E` mocha asterisk.
    - Container background set to `#FAF7F2`.
    - Active nav item pill updated to `#F5EFE6` with `#5C4A3E` active icon and `#2C2520` text.
    - Badges updated to `#EDE5D8` background with `#5C4A3E` text.
    - Plan card updated to mocha leather gradient (`linear-gradient(135deg, #5C4A3E 0%, #483A30 100%)`) with `#5C4A3E` button.
  - **Forms Dashboard (`FormDashboard.tsx`)**:
    - Canvas background unified to `#FAF7F2`.
    - Big decorative watermark set to `#D3C7B6` at 30% opacity.
    - "Create form" primary button styled in `#5C4A3E` with `#483A30` hover.
    - Search bar focus ring set to `#5C4A3E/15` ring and `#5C4A3E` border.
    - Stats cards updated with `#F5EFE6` icon containers and `#5C4A3E` icons; completion rate card unified to warm sand `#F5EFE6` / `#DDD5C7`.
    - Filter tabs active underline and pill set to `#5C4A3E` and `#F5EFE6`.
    - Folders list active item set to `#F5EFE6` with `#5C4A3E` folder icon.
    - Table header & rows checkboxes, icon containers, and hover links styled in `#5C4A3E`.
    - Pagination active page button updated to `#5C4A3E`.
  - **Form Builder Studio (`EnhancedFormBuilder.tsx`)**:
    - Studio canvas and subheader backgrounds unified to `#FAF7F2`.
    - Primary "Publish" button updated to `#5C4A3E` (hover `#483A30`).
    - Build / Settings / Workflows / Integrations / Analytics tabs active underline and icon updated to `#5C4A3E`.
    - Left Field Palette buttons updated with `#5C4A3E` hover borders and icons.
    - Interactive Canvas selected field dashed outline updated to `#5C4A3E` with warm sand `#FAF7F2` floating toolbar.
    - Right Property Inspector active items, type picker, and required toggles styled in `#5C4A3E`.
  - **User Responses (`UserResponses.tsx`)**:
    - Replaced generic indigo buttons and badges with `#5C4A3E` and `#F5EFE6` warm neutral tones.
  - **Route Skeletons (`App.tsx`)**:
    - Synchronized `SidebarSkeleton`, `DashboardSkeleton`, and `BuilderSkeleton` to `#FAF7F2` canvas with warm neutral placeholder blocks.

---

### 12. Sidebar Collapse / Expand Toggle & Icon-Only Minimized Mode
- **What was changed**: Added an intuitive collapse/expand toggle button in the sidebar header and implemented a sleek, icon-only minimized mode (70px width) with smooth CSS transitions and persistent state.
- **How it was earlier**:
  - `Sidebar.tsx` was fixed at 240px width with no toggle button.
  - `onToggle` prop was unhandled and `disableMinimize` had no effect.
  - All navigation links and headers assumed the expanded layout at all times.
- **What is updated**:
  - **Toggle Control**:
    - Expanded mode displays a `PanelLeftClose` icon button in the header (`h-[68px]`) to collapse the sidebar into icon-only mode.
    - Minimized mode renders a centered Asterisk button with a hover overlay showing `PanelLeftOpen` to expand back to 240px with a single click.
  - **Icon-Only Layout (70px Width)**:
    - **Header**: Centered asterisk button with tooltip.
    - **Workspace Selector**: Compact 40×40 building icon box with organization tooltip.
    - **Navigation Links**: Centered 40×40 icon buttons (`NAV_ITEMS` and `BOTTOM_ITEMS`) with active state (`bg-[#F5EFE6] text-[#5C4A3E]`), badge indicator dot, and native `title` tooltips on hover.
    - **Plan Card**: Compact 40×40 gradient button with Crown icon.
  - **State Persistence**:
    - Remembers the user's preference in `localStorage ('oorb_sidebar_minimized')`.
    - Automatically notifies the parent view (`EnhancedOorbFormsApp.tsx`) via `onToggle` so dashboard margins adapt smoothly (`marginLeft: 70px`).
  - **Smooth Transitions**:
    - Added `transition-all duration-300 ease-in-out` on the `<aside>` element.

---

### 13. Comprehensive Warm Neutral Theme Rollout Across All Auxiliary Views & Modals
- **What was changed**: Applied the complete Warm Neutral palette (`#FAF7F2` canvas, `#5C4A3E` primary mocha accents, `#F5EFE6` subtle sand containers, `#2C2520` typography, `#DDD5C7` borders) across all authentication screens, auxiliary views, public form renderer, response viewer, template library, and settings.
- **How it was earlier**:
  - `LoginPage.tsx` & `RegisterPage.tsx`: Used orange accents (`#E8601C`), orange gradients, and `#FDF6EE` backgrounds.
  - `ResetPasswordPage.tsx`: Used dark theme (`#0d0d14` gradient) with indigo buttons (`bg-indigo-600`) and glowing blue circles.
  - `TemplateLibrary.tsx`: Used bright indigo buttons (`bg-indigo-600`), indigo pills, and indigo hover rings.
  - `FormRenderer.tsx`: Used `#F0F4F8` background, `bg-indigo-600` submit button and progress bar, and blue radio/checkbox inputs.
  - `ResponseViewer.tsx`: Used `bg-gradient-to-br from-blue-50 to-purple-50` background with blue and indigo action buttons.
  - `UserSettings.tsx`: Used `bg-indigo-50` info boxes, `bg-indigo-100` avatar placeholders, and `bg-indigo-600` save buttons.
- **What is updated**:
  - **Login & Register (`LoginPage.tsx`, `RegisterPage.tsx`)**:
    - Left brand panel updated to `#FAF7F2` with `#D3C7B6` Asterisk watermark and `#5C4A3E` brand logo.
    - Checkmark icons updated to `#5C4A3E`.
    - Form action buttons styled in `#5C4A3E` with `#483A30` hover and soft mocha shadow (`rgba(92,74,62,0.25)`).
    - Input focus borders unified to `#5C4A3E`.
    - OTP verification container and mail badge updated to `#F5EFE6` with `#5C4A3E` icon and buttons.
  - **Reset Password (`ResetPasswordPage.tsx`)**:
    - Replaced dark indigo theme with clean `#FAF7F2` canvas and `#FFFFFF` card with `#DDD5C7` border.
    - Asterisk logo container and primary button updated to `#5C4A3E` (hover `#483A30`).
    - Input focus states updated to `#5C4A3E` border with subtle ring.
  - **Template Library (`TemplateLibrary.tsx`)**:
    - Header icon container updated to `#5C4A3E` with `#EDE5D8` / `#5C4A3E` pill badge.
    - Active category tab styled in `#5C4A3E` with white text and soft shadow.
    - Template card hover accent line and button updated to `#5C4A3E` (hover `#483A30`).
    - Search input focus ring updated to `#5C4A3E/20` and border to `#5C4A3E`.
  - **Public Form Renderer (`FormRenderer.tsx`)**:
    - Canvas background unified to `#FAF7F2`.
    - Real-time progress bar styled in `#5C4A3E`.
    - Radio and checkbox inputs styled with `accent-[#5C4A3E]`.
    - "Submit Form" button and login modal action button styled in `#5C4A3E` (hover `#483A30`).
    - "Powered by" footer badge and Gessions Forms text styled in `#5C4A3E`.
    - Form submission success screen updated with `#FAF7F2` background, `#F5EFE6` icon circle, and `#5C4A3E` accents.
  - **Response Viewer (`ResponseViewer.tsx`)**:
    - Page background updated from blue/purple gradient to clean `#FAF7F2`.
    - Header CSV export button styled in `#5C4A3E` (hover `#483A30`).
    - Spreadsheet table rows hover state unified to `#FAF7F2`.
    - Table action buttons (View Details, Test Results) and pagination "Next" button updated to `#5C4A3E`.
    - Response details modal accent strip styled with `border-[#5C4A3E]` and `bg-[#F5EFE6]`.
  - **User Settings (`UserSettings.tsx`)**:
    - Personal Information guide panel updated to `#F5EFE6` with `#DDD5C7` border and `#5C4A3E` icon.
    - Default avatar placeholder updated to `#F5EFE6` with `#5C4A3E` monogram text.
    - Input fields focus rings updated to `#5C4A3E/20` and `#5C4A3E` border.
    - "Save Changes" and "Change Password" buttons updated to `#5C4A3E` with `#483A30` hover.

---

### 14. Align Public Form Filling Screen with Form Builder Studio Interactive Preview
- **What was changed**: Replaced the disjointed split-card layout, clunky admin stats headers, and generic input styles in `FormRenderer.tsx` so that public form responders see the exact elegant, unified card design that is shown in the Form Builder Studio preview mode.
- **How it was earlier**:
  - `FormRenderer.tsx` rendered an external `FormHeader` component with internal metadata badges ("PUBLISHED", read times, view counts, response counts, dates) in a separate top card.
  - Below was a separate bottom card with a large "Account / Anonymous Responder / Switch account" bar, `space-y-10` excessive padding, generic `rounded-md` borders, and an oversized footer block.
  - `FileUploadField.tsx` had blue focus borders, blue spinners, and old styling.
  - Form inputs had generic `border-gray-300` and `focus:ring-blue-500`.
- **What is updated**:
  - **Single Unified Card Layout**:
    - Replaced the disjointed header/body split with a single centered card (`max-w-[620px] bg-white rounded-2xl border border-[#ECE8E1] shadow-sm overflow-hidden`).
    - Optional header banner image renders directly at the top of the card (`aspect-[4/1] max-h-[220px] object-cover`).
    - Sleek 6px progress bar placed neatly across the top of the card.
  - **Typography & Spacing**:
    - Form title styled with `text-[26px] font-serif font-black text-[#2C2520] mb-2 tracking-tight`.
    - Form description styled with `text-[14px] text-slate-500 mb-6 leading-relaxed`.
    - Clean field spacing (`space-y-5`) with `text-[13px] font-bold text-[#2C2520]` labels, `#5C4A3E` required asterisks, and `text-[11.5px] text-slate-400` helper text.
  - **Inputs & Fields Matching Preview Mode**:
    - Text, email, phone, number, url, and date inputs styled with `w-full px-3.5 py-2 text-[13px] bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl outline-none focus:border-[#5C4A3E] focus:bg-white transition-all text-[#2C2520]`.
    - Textarea configured with `rows={3}` and matching rounded-xl warm styling.
    - Select dropdown configured with clean placeholder option and matching warm neutral styling.
    - Radio and Checkbox options styled with clean `gap-2.5 text-[13px] text-slate-700` and `accent-[#5C4A3E]`.
    - Rating stars styled with clean gold/amber fill and `text-slate-300` hover/unselected state.
    - `FileUploadField.tsx` updated with `border border-dashed border-[#D5CFC5] bg-[#FAF7F2] rounded-xl p-5`, `#5C4A3E` icon, and warm neutral typography.
    - `QuestionAnswerField.tsx` preview mode styled in `#FAF7F2` with `#5C4A3E` accents.
  - **Action Button & Footer**:
    - Primary submit button matches preview: `w-full py-3 px-4 rounded-xl bg-[#5C4A3E] text-white font-bold text-[14px] hover:bg-[#483A30] active:scale-[0.98] transition-all shadow-sm`.
    - Subtle, minimal watermark at the bottom: `Forms by Gessions`.
    - Synchronized loading skeleton to match the exact 620px card dimensions.

---

### 15. Full Application Modals, Dialogs, and Popups UI/UX Overhaul
- **What was changed**: Upgraded every popup, modal, and floating dialog across the application to the cohesive Warm Neutral design system (`#FAF7F2` canvas, `#5C4A3E` primary mocha buttons/accents, `#483A30` hover, `#F5EFE6` secondary containers, `#DDD5C7` / `#E5DFD5` borders, `#2C2520` typography, rounded-2xl / rounded-3xl cards, and backdrop blur).
- **How it was earlier**:
  - Modals used inconsistent styling, harsh black or dark indigo overlays (`bg-black/50`, `bg-slate-900/40`), generic sharp rectangular borders (`rounded-lg`, `rounded-xl`), legacy indigo/purple gradients (`from-indigo-600 to-purple-600`), and orange action buttons (`#E8601C` / `#C94D10`).
  - Text, badges, and field answer boxes used cold blue or gray backgrounds (`bg-slate-50`, `border-slate-200`) and standard black text.
- **What is updated**:
  - **[FolderModal.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/FolderModal.tsx)**:
    - Overlay backdrop updated to `bg-slate-900/50 backdrop-blur-sm`.
    - Card container upgraded to `bg-white rounded-2xl border border-[#DDD5C7] shadow-2xl`.
    - Modal header styled with `#FAF7F2` background, `#2C2520` title, and rounded-xl close button.
    - Name and description inputs styled with `#FAF7F2` background, `#E5DFD5` border, and `#5C4A3E` focus state.
    - Action buttons styled with primary `bg-[#5C4A3E] hover:bg-[#483A30]` and cancel `border-[#DDD5C7] hover:bg-[#FAF7F2]`.
  - **[FolderContentsModal.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/FolderContentsModal.tsx)**:
    - Modal card upgraded to `bg-white rounded-3xl border border-[#DDD5C7] shadow-2xl`.
    - Header styled with `#FAF7F2` background, `#2C2520` title, and `#5C4A3E` "New Form" action button.
    - Form cards styled in `#FAF7F2` with `#E5DFD5` borders, hover border `#5C4A3E`, and `#F5EFE6` icon containers.
    - Empty state styled with `#FAF7F2` container and `#5C4A3E` action button.
  - **[AIFormBuilder.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/AIFormBuilder.tsx)**:
    - Replaced legacy indigo/purple gradient with `#FAF7F2` header, `#5C4A3E` icon box, and `#2C2520` typography.
    - Main prompt textarea updated to `#FAF7F2` with `#E5DFD5` border and `#5C4A3E` focus ring.
    - "Generate" CTA button updated to `bg-[#5C4A3E] hover:bg-[#483A30]`.
    - Sample prompt suggestion cards updated to `#FAF7F2` with `#F5EFE6` hover and `#5C4A3E` icons.
    - Generating animation box updated to `#5C4A3E`.
  - **[MyResponsesModal.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/MyResponsesModal.tsx)**:
    - Modal card updated to `bg-white rounded-3xl border border-[#DDD5C7] shadow-2xl` with `#FAF7F2` header.
    - Response cards updated to `#FAF7F2` with `#E5DFD5` border.
    - "View Details" button styled in `#5C4A3E` text, and "Edit Response" button styled in `bg-[#5C4A3E] hover:bg-[#483A30]`.
    - Sub-modal (Response Details) updated to `rounded-2xl border border-[#DDD5C7]` with `#F5EFE6` field containers and `#5C4A3E` left borders.
  - **[TestResultsViewer.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/TestResultsViewer.tsx)**:
    - Modal card updated to `rounded-3xl border border-[#DDD5C7] shadow-2xl` with `#FAF7F2` header and `#F5EFE6` award badge.
    - Overall Score card updated to `#FAF7F2` with `#E5DFD5` border and `#2C2520` text.
    - Question results updated to `#FAF7F2` card styling with warm `#F5EFE6` / `#5C4A3E` answer badges.
    - Summary stats boxes updated to `#FAF7F2` with `#E5DFD5` borders.
  - **[LoginPage.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/auth/LoginPage.tsx)**:
    - Forgot Password modal header badge updated to `#F5EFE6` with `#5C4A3E` icon (replacing orange `#E8601C`).
    - Enterprise banner icon box updated to `rgba(92,74,62,0.1)` with `#5C4A3E` stroke.
  - **[FormRenderer.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/FormRenderer.tsx)**:
    - "Your Response Details" modal updated with `rounded-3xl border border-[#DDD5C7]`, `#FAF7F2` header, `#E5DFD5` borders, and `#2C2520` typography.
    - "Login Required" modal updated with `rounded-3xl border border-[#DDD5C7]`, `#FAF7F2` header, and `#5C4A3E` / `#DDD5C7` action buttons.
  - **[ResponseViewer.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/ResponseViewer.tsx)**:
    - "Response Details" modal updated with `rounded-3xl border border-[#DDD5C7]`, `#FAF7F2` header, `#FAF7F2` answer containers with `#5C4A3E` left border accents, and updated submitter metadata badges.
  - **[EnhancedFormBuilder.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/EnhancedFormBuilder.tsx)**:
    - Settings panel save action button updated from legacy orange `#C94D10` to `bg-[#5C4A3E] hover:bg-[#483A30]`.
  - **[FormDashboard.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/FormDashboard.tsx)**:
    - Search input focus ring updated from `#E8601C` to `#5C4A3E`.
    - Table selected row background updated to `#F5EFE6/50`.

---

### 16. Standardize Modal and Dialog Border Radius to Crisp `rounded-xl`
- **What was changed**: Replaced all oversized, bulbous border radius values (`rounded-3xl` (24px), `rounded-[32px]`, `rounded-[28px]`, `rounded-2xl`) on all modals, dialog cards, and their internal containers with sleek, balanced `rounded-xl` (12px) curvature.
- **How it was earlier**:
  - Modals used excessively large border radius (`rounded-3xl` / `rounded-[32px]`), giving them an overly circular and bubbly appearance.
- **What is updated**:
  - **[FolderModal.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/FolderModal.tsx)**: Card border radius reduced to `rounded-xl`.
  - **[FolderContentsModal.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/FolderContentsModal.tsx)**: Dialog card radius reduced from `rounded-3xl` to `rounded-xl`.
  - **[AIFormBuilder.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/AIFormBuilder.tsx)**: Dialog card reduced from `rounded-[32px]` to `rounded-xl`; prompt textarea, buttons, and suggestion cards standardized to `rounded-xl`.
  - **[TemplateLibrary.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/TemplateLibrary.tsx)**: Modal card reduced from `rounded-[32px]` to `rounded-xl`; search input, category filters, template cards (`rounded-[28px]` -> `rounded-xl`), and buttons standardized to `rounded-xl`.
  - **[MyResponsesModal.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/MyResponsesModal.tsx)**: Main modal (`rounded-3xl` -> `rounded-xl`), response cards (`rounded-2xl` -> `rounded-xl`), and sub-modal details (`rounded-2xl` -> `rounded-xl`).
  - **[TestResultsViewer.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/TestResultsViewer.tsx)**: Dialog card (`rounded-3xl` -> `rounded-xl`), score card and question blocks reduced to `rounded-xl`.
  - **[ResponseViewer.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/ResponseViewer.tsx)**: Response details modal (`rounded-3xl` -> `rounded-xl`) and field items reduced to `rounded-r-xl`.
  - **[FormRenderer.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/FormRenderer.tsx)**: Response details and Login Required modals reduced from `rounded-3xl` to `rounded-xl`.
  - **[LoginPage.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/auth/LoginPage.tsx)**: Forgot password modal radius reduced from 20px to 12px.

---

### 17. Integrations & Analytics Modals Redesign, Functional Close Button, & Implemented Filtering
- **What was changed**:
  1. Updated `IntegrationsPanel.tsx` to the Warm Neutral design language with `rounded-xl` borders, `#FAF7F2` header, `#DDD5C7` borders, and `#5C4A3E` action buttons.
  2. Filtered integrations list to only include implemented services: **Google Sheets**, **Email Notifications**, and **Google Drive** (removed non-functional dummy entries: Webhook, Slack, Notion, Discord).
  3. Fixed broken modal close buttons across `EnhancedFormBuilder.tsx` by passing `onClose={() => setActiveTab('build')}` to both `<IntegrationsPanel />` and `<FormAnalytics />`, and enabling backdrop click-to-close.
  4. Redesigned `FormAnalytics.tsx` from harsh square blue/gray cards to Warm Neutral styling (`rounded-xl`, `#FAF7F2` headers, `#5C4A3E` trends, and matching charts).
  5. Updated mobile export drawer in `ResponseViewer.tsx` to Warm Neutral.
- **How it was earlier**:
  - `IntegrationsPanel` was rendered as a modal with harsh `bg-black/50`, bright purple/indigo icons, and non-working close buttons because `onClose` was not passed from `EnhancedFormBuilder.tsx`.
  - Non-implemented integrations (Slack, Discord, Notion, Webhook) cluttered the left menu.
  - `FormAnalytics` had sharp square `rounded-sm` corners, blue progress bars, and an inactive close button.
- **What is updated**:
  - **[IntegrationsPanel.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/IntegrationsPanel.tsx)**:
    - Reduced menu to active, supported integrations: Google Sheets, Email Notifications, Google Drive.
    - Updated container to `bg-white rounded-xl border border-[#DDD5C7] shadow-2xl`.
    - Styled header with `#FAF7F2` background, `#5C4A3E` Zap icon badge, `#2C2520` title, and working close button.
    - Updated inputs, buttons (`bg-[#5C4A3E] hover:bg-[#483A30]`), and connection cards to warm neutral tones.
  - **[FormAnalytics.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/FormAnalytics.tsx)**:
    - Updated card to `rounded-xl border border-[#DDD5C7] shadow-2xl`, with `#FAF7F2` header and working close button.
    - Stat cards and field metrics updated with warm neutral styling and `#5C4A3E` chart bars.
  - **[EnhancedFormBuilder.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/EnhancedFormBuilder.tsx)**:
    - Properly passes `onClose={() => setActiveTab('build')}` and form settings to `<IntegrationsPanel />` and `<FormAnalytics />`.
  - **[ResponseViewer.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/ResponseViewer.tsx)**:
    - Mobile export drawer styled with `#FAF7F2` header, `#DDD5C7` border, and `#5C4A3E` buttons.

---

### 18. Fix Context Menu Cropping & Implement Real Form Duplication
- **What was changed**:
  1. Resolved the issue where the row actions context menu (`renderContextMenu`) was getting clipped by the table card's bottom border.
  2. Implemented full functional form duplication via `duplicateForm` in `FormDashboard.tsx`.
- **How it was earlier**:
  - The forms table container had `overflow-hidden`, and the context menu was statically positioned at `top-8`. For rows near the bottom of the table or when only a few rows existed, the dropdown menu was clipped and truncated.
  - The "Duplicate" menu option only triggered a dummy toast notification without actually creating a copy of the form.
- **What is updated**:
  - **[FormDashboard.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/FormDashboard.tsx)**:
    - Removed `overflow-hidden` from the table card container so floating menus can render cleanly without clipping.
    - Added smart placement detection (`isNearBottom`) so that rows near the bottom of the table open the context menu upwards (`bottom-8 mb-1`) instead of downwards.
    - Added `duplicateForm(formId)` which fetches the original form definition, clones all fields with unique IDs, resets status to `draft`, appends `(Copy)` to the title, persists the new form in the database via `formAPI.createForm`, and updates the dashboard state immediately.

---

### 19. Add Form Renaming Feature & Modal
- **What was changed**: Added a "Rename form" option in the table row context menu with an interactive Warm Neutral modal dialog.
- **How it was earlier**:
  - The context menu lacked a quick rename action; users had to open the form in the full builder to edit the title.
- **What is updated**:
  - **[FormDashboard.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/FormDashboard.tsx)**:
    - Added "Rename form" item with `Edit3` icon in `renderContextMenu`.
    - Added `renamingForm` state and `handleRenameSubmit` handler calling `formAPI.updateForm`.
    - Added a Warm Neutral modal dialog (`rounded-xl`, `#FAF7F2` header, `#DDD5C7` border, `#5C4A3E` save button) to rename the form directly from the dashboard.

---

### 20. Add Remote Origin to Backend CORS Whitelist
- **What was changed**: Added `http://72.62.248.59` to `BASE_ORIGINS` in the backend server.
- **How it was earlier**:
  - The CORS whitelist only contained localhost origins and standard production domains (`forms-by-gessions.vercel.app`, `forms.GESSIONStech.com`, devtunnels).
- **What is updated**:
  - **[server/server.js](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/server/server.js)**:
    - Included `'http://72.62.248.59'` in `BASE_ORIGINS` so cross-origin requests originating from the remote IP client are permitted.

---

### 21. Add Coworker Notification Email Setting & Multi-Recipient Delivery
- **What was changed**:
  1. Added a Coworker / Additional Notification Email input field under the "Email Notifications" toggle in the Form Editor's General Settings tab.
  2. Updated the response submission handler to deliver notification emails to **both** the form creator and any designated coworker(s).
- **How it was earlier**:
  - In `EnhancedFormBuilder.tsx`, the settings tab only displayed a single toggle for "Email Notifications" with no option to add secondary or coworker recipients.
  - In `server/routes/responses.js`, setting `notificationEmail` replaced the creator's email (`const recipientEmail = form.settings?.notificationEmail || creator?.email`), which prevented the original creator from getting emails if a coworker was configured.
- **What is updated**:
  - **[EnhancedFormBuilder.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/EnhancedFormBuilder.tsx)**:
    - When "Email Notifications" is checked, an additional input field appears with Warm Neutral styling (`#FAF7F2`, `#DDD5C7` border, `#5C4A3E` accents).
    - Supports single or comma-separated email addresses with descriptive helper text explaining that notifications will be sent to both the creator and the coworker.
  - **[server/routes/responses.js](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/server/routes/responses.js)**:
    - Collects all recipients (creator's email + any comma-separated coworker emails) into a `Set` to deduplicate and normalize them.
    - Sends the submission summary email to the combined recipient list via `transporter.sendMail({ to: recipientList.join(', ') })`.

---

### 22. Form Closing Date, Validity Controls & Upgraded "Form Closed" UI
- **What was changed**:
  1. Re-implemented and elevated the Form Closing Date / "Form Valid Till" feature in the Form Builder Settings and Dashboard.
  2. Redesigned the "Form Closed", "Form Not Available", and "Form Not Found" public screens to match the modern Warm Neutral design aesthetic.
- **How it was earlier**:
  - The Form Builder General Settings lacked any controls for form closing dates, validity expiration, or custom closure messages.
  - The public "Form Closed" screen used an outdated cold slate style (`#F0F4F8` background, `bg-slate-400` top border, `bg-slate-900` dark button).
  - When a form was manually closed (`status === 'closed'`), it hit `form.status !== 'published'` first, displaying a plain "Form Not Available" fallback rather than the dedicated "Form Closed" screen.
- **What is updated**:
  - **[EnhancedFormBuilder.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/EnhancedFormBuilder.tsx)**:
    - Added an **"Accepting Responses"** manual toggle in General Settings allowing creators to instantly open or close their forms (`published` vs `closed`).
    - Added a **"Form Valid Till (Closing Date)"** section with a toggle, datetime-local picker (`expiryDate`), helper explanation, and an optional **"Custom Closed Message"** textarea (`closedMessage`).
    - Updated the top bar Publish dropdown to indicate current status (`Published` / `Closed` / `Publish`) and provide one-click **"Close Form"** and **"Reopen Form"** actions.
  - **[FormRenderer.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/FormRenderer.tsx)**:
    - Elevated the **"Form Closed"** screen with Warm Neutral styling: `#FAF7F2` canvas, `#5C4A3E` accent strip, `#F5EFE6` rounded badge with warm `Lock` icon, form title pill badge, custom closure message display, closure timestamp badge, `#5C4A3E` action button, and "Forms by Gessions" branding.
    - Checked `isClosed || form.status === 'closed'` ahead of draft status so closed forms reliably show the dedicated closing screen.
    - Styled "Form Not Found" and "Form Not Available" (draft mode) with matching Warm Neutral cards.
  - **[FormDashboard.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/FormDashboard.tsx)**:
    - Added direct **"Close form"** / **"Reopen form"** actions in the row context menu.
  - **[server/models/Form.js](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/server/models/Form.js)**:
    - Added `closedMessage: { type: String, default: null }` in `settings`.

---

### 23. Fix Form Builder Field Reordering Dragger & Add Quick Move Controls
- **What was changed**: Replaced the non-functional `react-beautiful-dnd` drag handle with native HTML5 drag-and-drop on both the 6-dots dragger icon and the field cards, and added direct Move Up / Move Down buttons to the floating action toolbar.
- **How it was earlier**:
  - The form canvas wrapped fields with `react-beautiful-dnd` (`DragDropContext`, `Droppable`, `Draggable`). Because the application runs in React 18 with `<React.StrictMode>` (in `main.tsx`), `react-beautiful-dnd` failed to bind its DOM drag listeners and silently broke.
  - Dragging the 6-dot dragger handle had no effect, and there were no alternative controls to reorder fields.
- **What is updated**:
  - **[EnhancedFormBuilder.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/EnhancedFormBuilder.tsx)**:
    - Replaced `react-beautiful-dnd` with native HTML5 Drag and Drop (`onDragStart`, `onDragOver`, `onDragLeave`, `onDrop`, `onDragEnd`), which works reliably in React 18 without any external library friction.
    - Bound `draggable` directly to the 6-dot `GripVertical` handle (`cursor-grab active:cursor-grabbing`) and the card body.
    - Added real-time drop feedback: the dragged card dims (`opacity-40 border-dashed`), while the hover target highlights with `#5C4A3E` borders and a focus ring.
    - Added quick **Move Up (`ChevronUp`)** and **Move Down (`ChevronDown`)** buttons in the floating action toolbar for instant one-click reordering.
    - Reordering immediately updates form fields and triggers automatic draft synchronization.

---

### 24. Production Build & TypeScript Type Alignment
- **What was changed**: Resolved all TypeScript compilation errors and verified that `npm run build` (`tsc && vite build`) compiles with zero errors into production assets.
- **How it was earlier**:
  - `tsc` failed during production build due to orphaned template state in `AIChatInterface.tsx`, unhandled optional `activeId` typing in `EnhancedFormBuilder.tsx`, missing `organization` and `department` on the `User` interface in `AuthContext.tsx`, missing `toast` import in `FormAnalytics.tsx`, and required `onClose` prop on `IntegrationsPanel`.
- **What is updated**:
  - **[AIChatInterface.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/chat/AIChatInterface.tsx)**: Removed undeclared `setSelectedTemplate` call.
  - **[EnhancedFormBuilder.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/EnhancedFormBuilder.tsx)**: Guaranteed non-null assertion on verified `activeId!`.
  - **[AuthContext.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/contexts/AuthContext.tsx)**: Added optional `organization?: string` and `department?: string` to `User` interface.
  - **[FormAnalytics.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/FormAnalytics.tsx)**: Added missing `import toast from 'react-hot-toast'`.
  - **[IntegrationsPanel.tsx](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/src/components/forms/IntegrationsPanel.tsx)**: Marked `onClose?: () => void` as optional for flexible standalone usage.
  - Build successfully completed in 11.01s producing optimized output in `dist/`.

---

### 25. Security Hardening & Full Production Readiness Overhaul
- **What was changed**: Conducted a comprehensive security audit and remediated critical vulnerabilities across privilege management, file uploads, rate limiting, and NoSQL injection.
- **How it was earlier**:
  - `POST /api/admin/make-me-admin` existed in `server/routes/admin.js`, allowing any registered user to arbitrarily escalate their privileges to Super Admin.
  - File upload endpoint `/api/responses/upload` accepted all file types with `resource_type: 'auto'` and had no MIME or extension whitelist.
  - Express server lacked security headers (`X-Content-Type-Options`, `X-Frame-Options`, `HSTS`, `X-XSS-Protection`) and rate limiting on sensitive routes.
  - User model exposed `password`, `otp`, `otpExpires`, and `googleRefreshToken` in default projections.
  - Auth routes did not validate primitive string types for `email` and `password`, opening vectors for NoSQL operator injection.
- **What is updated**:
  - **[admin.js](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/server/routes/admin.js)**: Permanently removed `/api/admin/make-me-admin` privilege escalation backdoor.
  - **[responses.js](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/server/routes/responses.js)**: Configured strict `multer` `fileFilter` rejecting `.html`, `.svg`, `.exe`, `.js`, `.sh`, `.php`, and unapproved MIME types; removed synchronous disk file logging.
  - **[server.js](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/server/server.js)**: Disabled `X-Powered-By`, added standard security headers, applied rate limiters on `/api/auth` (20 req/15 min) and `/api/responses` (30 req/min), and added a production-safe centralized error handler.
  - **[User.js](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/server/models/User.js)**: Added `select: false` to `password`, `otp`, `otpExpires`, and `googleRefreshToken` to prevent accidental credential leakage in queries.
  - **[auth.js](file:///c:/Users/Hp/Downloads/oorb-forms-2-main/oorb-forms-2-main/server/routes/auth.js)**: Added strict string type enforcement and email normalization to prevent NoSQL operator injection. Added password length enforcement (minimum 8 characters).
