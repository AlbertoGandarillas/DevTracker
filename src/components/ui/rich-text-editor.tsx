"use client"

import { useState, useRef, useEffect } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  maxLength?: number
  disabled?: boolean
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter text...",
  className = "",
  maxLength,
  disabled = false
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const execCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus()
      document.execCommand(command, false, value)
      updateValue()
    }
  }

  const setAlignment = (alignment: 'left' | 'center' | 'right') => {
    if (editorRef.current) {
      editorRef.current.focus()
      document.execCommand(`justify${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`, false)
      updateValue()
    }
  }

  const updateValue = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML
      if (newValue !== value) {
        onChange(newValue)
      }
    }
  }

  const handleInput = () => {
    updateValue()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      if (editorRef.current) {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          range.deleteContents()
          range.insertNode(document.createElement('br'))
          range.collapse(false)
          updateValue()
        }
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    if (editorRef.current) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        range.insertNode(document.createTextNode(text))
        range.collapse(false)
        updateValue()
      }
    }
  }

  const getActiveFormats = () => {
    const formats: string[] = []
    if (document.queryCommandState('bold')) formats.push('bold')
    if (document.queryCommandState('italic')) formats.push('italic')
    if (document.queryCommandState('underline')) formats.push('underline')
    return formats
  }

  const [activeFormats, setActiveFormats] = useState<string[]>([])

  useEffect(() => {
    const updateActiveFormats = () => {
      setActiveFormats(getActiveFormats())
    }

    const editor = editorRef.current
    if (editor) {
      editor.addEventListener('keyup', updateActiveFormats)
      editor.addEventListener('mouseup', updateActiveFormats)
      editor.addEventListener('input', updateActiveFormats)
      
      return () => {
        editor.removeEventListener('keyup', updateActiveFormats)
        editor.removeEventListener('mouseup', updateActiveFormats)
        editor.removeEventListener('input', updateActiveFormats)
      }
    }
  }, [])

  return (
    <div className={cn("border border-gray-300 rounded-md", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <ToggleGroup type="multiple" value={activeFormats} onValueChange={() => {}}>
          <ToggleGroupItem
            value="bold"
            size="sm"
            onClick={() => execCommand('bold')}
            disabled={disabled}
            className="h-8 w-8"
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="italic"
            size="sm"
            onClick={() => execCommand('italic')}
            disabled={disabled}
            className="h-8 w-8"
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="underline"
            size="sm"
            onClick={() => execCommand('underline')}
            disabled={disabled}
            className="h-8 w-8"
          >
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAlignment('left')}
          disabled={disabled}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAlignment('center')}
          disabled={disabled}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAlignment('right')}
          disabled={disabled}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "rich-text-editor min-h-[120px] p-3 outline-none resize-none",
          "focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
          isFocused ? "ring-2 ring-blue-500 ring-opacity-50" : "",
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        )}
        style={{ 
          minHeight: '120px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  )
} 