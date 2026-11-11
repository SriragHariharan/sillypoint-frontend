import { useEditor, useEditorState, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Underline } from 'lucide-react'

const TOOLS = [
  { key: 'bold', label: 'Bold', icon: Bold, run: (c) => c.toggleBold() },
  { key: 'italic', label: 'Italic', icon: Italic, run: (c) => c.toggleItalic() },
  { key: 'underline', label: 'Underline', icon: Underline, run: (c) => c.toggleUnderline() },
  { key: 'bulletList', label: 'Bullet list', icon: List, run: (c) => c.toggleBulletList() },
  { key: 'orderedList', label: 'Numbered list', icon: ListOrdered, run: (c) => c.toggleOrderedList() },
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
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100 hover:border-gray-400 focus-within:hover:border-red-600">
      <div className="flex gap-1 border-b border-gray-200 bg-gray-50 p-1.5">
        {TOOLS.map(({ key, label, icon: Icon, run }) => (
          <button
            key={key}
            type="button"
            aria-label={label}
            title={label}
            aria-pressed={active[key]}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => run(editor.chain().focus()).run()}
            className={`flex h-9 min-w-9 items-center justify-center rounded-lg transition ${
              active[key] ? 'bg-red-600 text-white shadow-sm' : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export default RichTextEditor
