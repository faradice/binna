import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { Link } from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Subscript,
  Superscript,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Undo,
  Redo,
  Type,
  Highlighter,
} from 'lucide-react'
import { useState, useCallback } from 'react'

const colors = [
  '#000000', '#374151', '#6B7280', '#EF4444', '#F97316', '#EAB308',
  '#22C55E', '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899',
]

const highlightColors = [
  '#FEF08A', '#FDE68A', '#D9F99D', '#A7F3D0', '#99F6E4',
  '#A5F3FC', '#BFDBFE', '#DDD6FE', '#FBCFE8', '#FED7AA',
]

function ToolbarButton({ onClick, isActive, disabled, children, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition-colors flex-shrink-0 ${
        isActive
          ? 'bg-violet-100 text-violet-700'
          : 'text-gray-600 hover:bg-gray-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}

function ColorPicker({ colors, currentColor, onSelect, icon: Icon, title }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={title}
        className="p-2 rounded text-gray-600 hover:bg-gray-100 flex items-center gap-1"
      >
        <Icon size={18} />
        <div
          className="w-4 h-1 rounded"
          style={{ backgroundColor: currentColor || colors[0] }}
        />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 grid grid-cols-6 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onSelect(color)
                  setIsOpen(false)
                }}
                className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Divider() {
  return <div className="w-px h-6 bg-gray-300 mx-1 flex-shrink-0" />
}

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Underline,
      TextAlign.configure({
        types: ['paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Sláðu inn URL:', previousUrl)

    if (url === null) return

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent">
      {/* Toolbar */}
      <div className="flex flex-nowrap items-center gap-0.5 p-2 bg-gray-50 border-b border-gray-200 overflow-x-auto">
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Afturkalla"
        >
          <Undo size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Endurgera"
        >
          <Redo size={18} />
        </ToolbarButton>

        <Divider />

        {/* Text formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Feitletrað"
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Skáletrað"
        >
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Undirstrikað"
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>

        <Divider />

        {/* Colors */}
        <ColorPicker
          colors={colors}
          currentColor={editor.getAttributes('textStyle').color}
          onSelect={(color) => editor.chain().focus().setColor(color).run()}
          icon={Type}
          title="Litur texta"
        />
        <ColorPicker
          colors={highlightColors}
          currentColor={editor.getAttributes('highlight').color}
          onSelect={(color) => editor.chain().focus().toggleHighlight({ color }).run()}
          icon={Highlighter}
          title="Yfirstrikunarlitur"
        />

        <Divider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Punktalisti"
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Númeraður listi"
        >
          <ListOrdered size={18} />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Vinstri jafnað"
        >
          <AlignLeft size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Miðjað"
        >
          <AlignCenter size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Hægri jafnað"
        >
          <AlignRight size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          title="Jafnað"
        >
          <AlignJustify size={18} />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive('link')}
          title="Tengill"
        >
          <LinkIcon size={18} />
        </ToolbarButton>
      </div>

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 focus:outline-none"
      />

      <style>{`
        .ProseMirror {
          outline: none;
          min-height: 150px;
        }
        .ProseMirror p {
          margin: 0.5em 0;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
        }
        .ProseMirror a {
          color: #7c3aed;
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
