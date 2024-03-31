'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { useActions, useUIState } from 'ai/rsc'

import { UserMessage } from './stocks/message'
import { type AI } from '@/lib/chat/actions'
import { Button } from '@/components/ui/button'
import { Select, SelectSection, SelectItem } from '@nextui-org/react'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { models } from '@/lib/render'
import { SelectorIcon } from '@/components/select-icon'

export function PromptForm({
  input,
  model,
  loading,
  setInput,
  setModel,
  setLoading
}: {
  input: string
  model: string
  loading: boolean
  setInput: (value: string) => void
  setModel: (value: string) => void
  setLoading: (value: boolean) => void
}) {
  const router = useRouter()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])
  console.log('modelname')
  console.log(model)
  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        setLoading(true)
        e.preventDefault()

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')

        const modelname = model.trim()

        if (!value) return

        // Optimistically add user message UI
        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>
          }
        ])

        // Submit and get response message
        const responseMessage = await submitUserMessage(value, modelname)
        setMessages(currentMessages => [...currentMessages, responseMessage])
        setLoading(false)
      }}
      className="flex flex-row items-center"
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4"
              onClick={() => {
                router.push('/new')
              }}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="absolute right-0 top-[13px] sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={input === ''}
                className=""
              >
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>

            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="relative flex max-h-60 w-full max-w-[200px] grow overflow-hidden bg-background ml-4">
        <Select
          label=""
          placeholder="Select a model"
          className="customSelect text-center sm:rounded-md sm:border"
          color="primary"
          size="lg"
          radius="lg"
          fullWidth={true}
          isRequired={true}
          value={model}
          onChange={e => setModel(e.target.value)}
          selectorIcon={<SelectorIcon />}
          classNames={{
            label: 'group-data-[filled=true]:-translate-y-5',
            trigger: 'min-h-unit-16'
          }}
          listboxProps={{
            itemClasses: {
              base: [
                'text-default-500',
                'transition-opacity',
                'data-[hover=true]:text-foreground',
                'data-[hover=true]:bg-zinc-800',
                'dark:data-[hover=true]:bg-default-50',
                'data-[selectable=true]:focus:bg-default-50',
                'data-[pressed=true]:opacity-70',
                'data-[pressed=true]:bg-zinc-800',
                'data-[focus-visible=true]:ring-default-500'
              ]
            }
          }}
          popoverProps={{
            className: 'customSelectSection'
          }}
        >
          {models.map(model => (
            <SelectItem
              key={model.name}
              className="customSelectItem h-full min-h-[60px]"
            >
              {model.value}
            </SelectItem>
          ))}
        </Select>
      </div>
    </form>
  )
}
