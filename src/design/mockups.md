# Mockups: Typing Test View

Overview:

- Left: Passage container with per-character highlight.
- Transparent textarea overlay covering passage for caret and typing.
- Top HUD shows WPM, accuracy, progress bar, and time selector.
- Right: Submission panel with live metrics and Save button.
- Modal: After finish, show WPM/accuracy/errors with Save/Close actions.

Sketch (text):

[ Header | Theme Toggle ]

[ PASSAGE BOX (overlay textarea) ] [ Submit / Scores ]

HUD: [WPM] [Accuracy] [Progress bar] [Time buttons]

Modal: Centered card with metrics and `Save Score` button

Notes:

- Use high contrast for correct/incorrect chars (green/red) and muted for future chars.
- Keep overlay textarea semantically focusable and use `aria-label` for screen readers.
- Provide keyboard shortcuts: Enter to open modal when finished, Esc to close modal.
