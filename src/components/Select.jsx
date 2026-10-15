import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import Avatar from './Avatar'

const firstEnabled = (options, from, step) => {
  for (let index = from; index >= 0 && index < options.length; index += step) {
    if (!options[index].disabled) return index
  }
  return -1
}

function Select({ id, value, onChange, options, placeholder = 'Select', error = false, disabled = false, onBlur }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const rootRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()

  const selectedIndex = options.findIndex((option) => option.value === value)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (!open || active < 0) return
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const openList = () => {
    setActive(selectedIndex >= 0 ? selectedIndex : firstEnabled(options, 0, 1))
    setOpen(true)
  }

  const choose = (index) => {
    const option = options[index]
    if (!option || option.disabled) return
    onChange(option.value)
    setOpen(false)
  }

  const onKeyDown = (event) => {
    if (disabled) return
    switch (event.key) {
      case 'Escape':
        if (open) {
          event.stopPropagation()
          event.nativeEvent.stopImmediatePropagation()
          setOpen(false)
        }
        break
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault()
        if (!open) {
          openList()
          break
        }
        const step = event.key === 'ArrowDown' ? 1 : -1
        const next = firstEnabled(options, active + step, step)
        if (next >= 0) setActive(next)
        break
      }
      case 'Home':
      case 'End':
        if (open) {
          event.preventDefault()
          const edge = event.key === 'Home' ? firstEnabled(options, 0, 1) : firstEnabled(options, options.length - 1, -1)
          if (edge >= 0) setActive(edge)
        }
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (open) choose(active)
        else openList()
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className={`flex w-full items-center gap-2.5 rounded-xl border bg-white px-3 py-2.5 text-left text-sm outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60 ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      >
        {selected?.logo !== undefined && (
          <Avatar src={selected.logo} name={selected.label} size="xs" rounded="rounded-lg" />
        )}
        <span className={`min-w-0 flex-1 truncate ${selected ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 z-20 mt-1.5 max-h-52 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
        >
          {options.length === 0 && <li className="px-3 py-2.5 text-sm text-gray-500">No options</li>}
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              onMouseEnter={() => !option.disabled && setActive(index)}
              onClick={() => choose(index)}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm ${
                option.disabled
                  ? 'cursor-not-allowed text-gray-400'
                  : `cursor-pointer text-gray-900 ${index === active ? 'bg-red-50' : ''}`
              }`}
            >
              {option.logo !== undefined && (
                <Avatar src={option.logo} name={option.label} size="xs" rounded="rounded-lg" />
              )}
              <span className="min-w-0 flex-1 truncate">{option.label}</span>
              {option.value === value && <Check className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Select
