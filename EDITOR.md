# EDITOR.md — RichEditorQ Documentation & Usage Guide

**RichEditorQ** is a feature-packed, theme-adaptive, and zero-clutter rich text editor built on top of [Quill.js v2.0.3](https://quilljs.com). Developed by **Hammad Ali**, it provides full control over rich content creation, custom image uploads, interactive table creation, dark/light theme switching, and clean HTML outputs.

---

## 👨‍💻 Developer & Maintainer

- **Developer**: Hammad Ali
- **Email**: [hali35275@gmail.com](mailto:hali35275@gmail.com)
- **GitHub Profile**: [hali-developer](https://github.com/hali-developer)
- **Repository**: [https://github.com/hali-developer/quill-editor](https://github.com/hali-developer/quill-editor)

---

## 🤝 Credits & Quill Source Attribution

RichEditorQ leverages and extends **Quill.js**, an open-source WYSIWYG editor built by [Slab](https://github.com/slab).

- **Official Quill Project**: [https://quilljs.com](https://quilljs.com)
- **Quill Source Repository**: [https://github.com/slab/quill](https://github.com/slab/quill)
- **Bundled Engine Version**: `Quill v2.0.3` (BSD 3-Clause License)
- **Official CDN Links**:
  - JavaScript: `https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js`
  - Stylesheet: `https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css`

---

## ✨ Key Benefits & Features

- **🧹 Zero Empty Markup Bloat**: Unlike default rich text editors that leave behind empty `<p><br></p>` tags, RichEditorQ automatically detects empty states (0 text characters) and outputs an empty string (`""`).
- **🌓 Dynamic & Auto Theme Engine**: Supports `light`, `dark`, and `auto` theme modes (automatically matching system dark/light preferences) with adaptive floating modal dialogs.
- **🖼️ Flexible Image Handling**: Upload via REST endpoints (`imageUploadUrl`), custom async handlers (`onImageUpload`), or direct image URL embedding with options to toggle file upload or URL inputs.
- **🎨 Inline CSS Style Conversion**: `useInlineStyles: true` converts internal Quill classes to clean, standard inline CSS `style=""` attributes in the generated HTML.
- **📊 Interactive Table Manager**: Create, edit, and modify HTML tables on the fly with dynamic modal controls for rows, columns, headers, and borders.
- **🚀 Multi-Instance Ready**: Easily initialize single or multiple editor instances across textareas, inputs, or standard DOM elements using flexible query selectors.

---

## 🚀 Quick Start

### 1. Include CSS and JS Dependencies

Include the stylesheet and script files in your HTML page:

```html
<!-- RichEditor Stylesheet -->
<link rel="stylesheet" href="quill.css" />

<!-- RichEditor Script (includes bundled Quill 2.0.3 core) -->
<script src="rich-editor.js"></script>
```

Alternatively, if including Quill from CDN:

```html
<!-- Quill 2.0.3 CDN Dependencies -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" />
<script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>

<!-- RichEditor Custom Styles & Wrapper -->
<link rel="stylesheet" href="quill.css" />
<script src="rich-editor.js"></script>
```

---

## ⚙️ Complete Configuration Reference

Here is the full list of initialization options available when configuring `RichEditorQ.init(selector, options)`:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `placeholder` | `String` | `'Write something…'` | Placeholder text displayed when the editor is empty. |
| `onChange` | `Function` | `null` | Live callback invoked whenever editor content changes: `(html, container) => {}`. |
| `theme` | `String` | `'auto'` | Theme mode for editor and modals: `'light'`, `'dark'`, or `'auto'` (auto-detects OS theme). |
| `toolbar` | `Boolean` \| `Object` | `true` | Enables standard toolbar (`true`), hides toolbar (`false`), or accepts custom toolbar structure. |
| `height` | `Number` \| `String` | `null` | Fixed container height in pixels or CSS units (e.g. `400` or `'400px'`). |
| `minHeight` | `Number` \| `String` | `null` | Minimum height constraint for the editor container. |
| `maxHeight` | `Number` \| `String` | `null` | Maximum height constraint for the editor container (enables scrolling). |
| `readOnly` | `Boolean` | `false` | Sets editor to read-only view and disables user edits. |
| `disabled` | `Boolean` | `false` | Disables user interactions and toolbar action buttons. |
| `status` | `Boolean` | `true` | Shows or hides the bottom status bar (character/word counter & theme toggle). |
| `useInlineStyles` | `Boolean` | `true` | Converts Quill classes (color, alignment, fonts) into inline CSS `style=""` attributes in HTML output. |
| `onImageUpload` | `Function` | `null` | Custom async upload callback: `async (file, editor) => 'https://...'` (overrides default Base64). |
| `imageUploadUrl` | `String` | `null` | REST API endpoint URL to POST image files directly. |
| `allowImageUrl` | `Boolean` | `true` | Enables or disables the "Insert via Image URL" tab in the image modal. |
| `allowImageUpload` | `Boolean` | `true` | Enables or disables local file upload in the image modal. |

---

## 💡 Code Demos & Use Cases

### Demo 1: Advanced Configuration with Custom Image Upload & Dark Mode

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>RichEditorQ Demo</title>
  <link rel="stylesheet" href="quill.css">
  <style>
    body {
      background-color: #121212;
      color: #ffffff;
      font-family: system-ui, sans-serif;
      padding: 2rem;
    }
  </style>
</head>
<body>

  <h2>Article Content Editor</h2>
  <div class="editor-dark"></div>

  <script src="rich-editor.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const [editor] = RichEditorQ.init('.editor-dark', {
        toolbar: true,
        height: 400,
        minHeight: 200,
        maxHeight: 600,
        theme: 'dark',
        status: true,
        useInlineStyles: true,
        placeholder: 'Compose article...',
        
        // Custom Async Image Upload Handler
        onImageUpload: async (file, editor) => {
          const formData = new FormData();
          formData.append('image', file);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });

          const data = await response.json();
          return data.url; // Returns uploaded image URL string
        },

        onChange: (html) => {
          console.log('Updated HTML:', html);
        }
      });
    });
  </script>
</body>
</html>
```

---

### Demo 2: Programmatic API Usage

RichEditorQ instances offer intuitive helper methods for runtime manipulation:

```javascript
// Get an editor instance
const [editor] = RichEditorQ.init('#editor');

// Set HTML content
editor.setHTML('<h2>Welcome!</h2><p>This is pre-populated content.</p>');

// Get clean HTML content (returns "" if 0 characters)
const cleanHTML = editor.getHTML();

// Get raw text content
const plainText = editor.getText();

// Dynamically change theme at runtime ('light', 'dark', or 'auto')
editor.setTheme('dark');

// Clear content completely
editor.clear();

// Register event listeners
editor.on('change', (html) => {
  console.log('Content changed:', html);
});
```

---

## 🛠️ Instance API Methods

| Method | Parameters | Description |
| :--- | :--- | :--- |
| `getHTML()` | None | Returns current sanitized HTML string (or `""` if 0 text chars). |
| `setHTML(html)` | `html: String` | Sets the HTML markup of the editor. |
| `getText()` | None | Returns plain text content stripped of HTML tags. |
| `clear()` | None | Resets editor to an empty state. |
| `setTheme(theme)` | `'light'` \| `'dark'` \| `'auto'` | Toggles editor and modal themes dynamically. |
| `getTheme()` | None | Returns active theme string (`'light'` or `'dark'`). |
| `on(event, fn)` | `event: String`, `fn: Function` | Attaches event listener (e.g., `'change'`). |

---

## 📄 License & Contact

- **Author**: Hammad Ali (<hali35275@gmail.com>)
- **License**: MIT License / Powered by [Quill.js](https://quilljs.com) (BSD 3-Clause License).
