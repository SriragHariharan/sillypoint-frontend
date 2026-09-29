import { useEditor, useEditorState, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const TOOLS = [
  { key: 'bold', label: 'Bold', content: <span className="font-bold">B</span>, run: (c) => c.toggleBold() },
  { key: 'italic', label: 'Italic', content: <span className="italic">I</span>, run: (c) => c.toggleItalic() },
  {
    key: 'underline',
    label: 'Underline',
    content: <span className="underline">U</span>,
    run: (c) => c.toggleUnderline(),
  },
  { key: 'bulletList', label: 'Bullet list', content: '•≡', run: (c) => c.toggleBulletList() },
  { key: 'orderedList', label: 'Numbered list', content: '1.', run: (c) => c.toggleOrderedList() },
]

function RichTextEditor({ id, value, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        id,
        role: 'textbox',
        'aria-multiline': 'true',
        'data-placeholder': placeholder ?? '',
        class:
          'min-h-28 px-3 py-3 text-sm text-gray-900 outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1',
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.isEmpty ? '' : current.getHTML()),
  })

  const active = useEditorState({
    editor,
    selector: ({ editor: current }) =>
      Object.fromEntries(TOOLS.map(({ key }) => [key, current?.isActive(key) ?? false])),
  })

  if (!editor) return null

  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100">
      <div className="flex gap-1 border-b border-gray-200 bg-gray-50 p-1.5">
        {TOOLS.map(({ key, label, content, run }) => (
          <button
            key={key}
            type="button"
            aria-label={label}
            title={label}
            aria-pressed={active[key]}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => run(editor.chain().focus()).run()}
            className={`h-8 min-w-8 rounded-md px-2 text-sm transition ${
              active[key] ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {content}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export default RichTextEditor
