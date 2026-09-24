# EDITOR.md — RichEditorQ Documentation & Usage Guide

**RichEditorQ** is a feature-packed, theme-adaptive, and zero-clutter rich text editor built on top of Quill.js. Designed for high performance and sleek user interfaces, it provides full control over rich content creation, custom image uploads, interactive table creation, dark/light theme switching, and clean HTML outputs.

---

## ✨ Key Benefits & Features

- **🧹 Zero Empty Markup Bloat**: Unlike default rich text editors that leave behind empty `<p><br></p>` tags, RichEditorQ automatically detects empty states (0 text characters) and outputs an empty string (`""`).
- **🌓 Adaptive Light & Dark Themes**: Fully supports dynamic theme switching between `light` and `dark` modes with beautifully designed, matching modal dialogs.
- **🖼️ Built-in Image Upload Handler**: Easily plug in custom async image upload functions (e.g., uploading to S3, Cloudinary, or custom REST endpoints) with automatic fallback to base64 encoding.
- **📊 Interactive Table Manager**: Create, edit, and modify HTML tables on the fly with dynamic modal controls for rows, columns, headers, and borders.
- **🎨 Comprehensive Formatting Options**: Support for typography headers (H1-H4), inline styling, custom text/background color pickers, block quotes, code blocks, lists, links, alignment controls, and clear formatting.
- **🚀 Multi-Instance Ready**: Easily initialize single or multiple editor instances across textareas, inputs, or standard DOM elements using flexible query selectors.

---

## 🚀 Quick Start

### 1. Include CSS and JS Dependencies

Include the stylesheet and script files in your HTML page:

```html
<!-- RichEditor Stylesheet -->
<link rel="stylesheet" href="quill.css" />

<!-- RichEditor Script -->
<script src="rich-editor.js"></script>
```

### 2. Add Container Element

Create a target HTML element (such as a `<textarea>` or `<div>`):

```html
<textarea class="my-editor" placeholder="Write something incredible..."></textarea>
```

### 3. Initialize the Editor

Initialize `RichEditorQ` via JavaScript:

```html
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const instances = RichEditorQ.init('.my-editor', {
      height: 300,
      theme: 'light',
      placeholder: 'Type your content here...',
      onChange: (html, container) => {
        console.log('Live HTML output:', html);
      }
    });

    const editor = instances[0];
  });
</script>
```

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
        theme: 'dark',
        placeholder: 'Compose article...',
        
        // Custom Async Image Upload Handler
        uploadHandler: async (file) => {
          const formData = new FormData();
          formData.append('image', file);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });

          const data = await response.json();
          return data.url; // Returns the uploaded image URL string
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

// Get clean HTML content (returns "" if empty)
const cleanHTML = editor.getHTML();

// Get raw text content
const plainText = editor.getText();

// Dynamically change theme at runtime ('light' | 'dark')
editor.setTheme('dark');

// Clear content completely
editor.clear();

// Register event listeners
editor.on('change', (html) => {
  console.log('Content changed:', html);
});
```

---

## ⚙️ Configuration Reference

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `toolbar` | `Boolean` / `Array` | `true` | Enables default toolbar or accepts custom toolbar configuration. |
| `theme` | `String` | `'light'` | Editor theme palette: `'light'` or `'dark'`. |
| `height` | `Number` / `String` | `300` | Minimum height of the editor area in pixels. |
| `placeholder` | `String` | `'Write here...'` | Placeholder text shown when editor is empty. |
| `uploadHandler` | `Function` | `null` | Optional async handler `async (file) => imageUrl`. Fallbacks to Base64. |
| `onChange` | `Function` | `null` | Callback triggered on content edit: `(html, container) => {}`. |

---

## 🛠️ Instance API Methods

| Method | Parameters | Description |
| :--- | :--- | :--- |
| `getHTML()` | None | Returns current sanitized HTML string (or `""` if 0 text chars). |
| `setHTML(html)` | `html: String` | Sets the HTML markup of the editor. |
| `getText()` | None | Returns plain text content stripped of HTML tags. |
| `clear()` | None | Resets editor to an empty state. |
| `setTheme(theme)` | `'light'` \| `'dark'` | Toggles editor and modal themes dynamically. |
| `getTheme()` | None | Returns active theme string (`'light'` or `'dark'`). |
| `on(event, fn)` | `event: String`, `fn: Function` | Attaches event listener (e.g., `'change'`). |
