# User Manual — Editable Files

Basic user and admin guide for the SK Calapan City Federation website. **No screenshots included** — add your own in the placeholder areas.

## Files

| File | Best for | How to edit |
|------|----------|-------------|
| **SK-User-Manual.pptx** | Presentations, capstone defense | Open in PowerPoint; replace dashed screenshot boxes |
| **SK-User-Manual.html** | Word document, PDF export | Open in Microsoft Word → Save As `.docx` or Print to PDF |
| **SK-User-Manual.md** | Quick text edits, Git tracking | Edit in Cursor/VS Code or any text editor |
| **generate-pptx.mjs** | Regenerate PowerPoint after script edits | Run the command below |

## Regenerate PowerPoint

After editing `generate-pptx.mjs` or if the `.pptx` is missing:

```bash
npm install pptxgenjs --no-save
node docs/user-manual/generate-pptx.mjs
```

Output: `docs/user-manual/SK-User-Manual.pptx`

## Adding screenshots

### PowerPoint
1. Open `SK-User-Manual.pptx`.
2. On slides with a gray dashed box, delete the placeholder text/shape.
3. **Insert → Pictures** and resize to fit the right side of the slide.

### Word (from HTML)
1. Open `SK-User-Manual.html` in Microsoft Word.
2. Click inside a gray screenshot box, delete the placeholder text.
3. **Insert → Pictures** or paste a screenshot directly.

### Markdown
Replace lines like `[INSERT SCREENSHOT: description]` with `![description](./screenshots/your-file.png)`.

## Screenshot checklist

See the checklist at the bottom of `SK-User-Manual.md`.

## Contents covered

- Login & registration
- Dashboard navigation
- User features: events, KK ID Card, account, resources
- Admin features: dashboard, announcements, events, disclosure, users
- FAQ & support
