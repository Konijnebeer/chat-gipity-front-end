"use client"
// PROVE OF CONCEPT NOT USED GENERATED WITH AN LLM, NOT FINAL CODE


import { useState } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import { Checkbox } from "#/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group"
import { Badge } from "#/components/ui/badge"
import { Separator } from "#/components/ui/separator"
import type { Questionnaire, Question } from "@chat-gipity/schemas"

// ─── Helpers ────────────────────────────────────────────────────────────────

function submitToChat(qa: Record<string, string | string[]>) {
  const chatbox = document.getElementById("content") as
    | HTMLTextAreaElement
    | HTMLInputElement
    | null
  if (!chatbox) return

  const formatted = Object.entries(qa)
    .map(([q, a]) => `Q: ${q}\nA: ${Array.isArray(a) ? a.join(", ") : a}`)
    .join("\n\n")

  // Works for both <input> and <textarea>
  const nativeInputValueSetter =
    Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    ) ??
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")

  nativeInputValueSetter?.set?.call(chatbox, formatted)
  chatbox.dispatchEvent(new Event("input", { bubbles: true }))
  chatbox.focus()
}

// ─── Individual question renderers ──────────────────────────────────────────

function FreeformField({
  question,
  value,
  onChange,
}: {
  question: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">{question}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer…"
      />
    </div>
  )
}

function RadioField({
  question,
  options,
  value,
  onChange,
}: {
  question: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">{question}</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex flex-col gap-1.5"
      >
        {options.map((opt) => (
          <div key={opt} className="flex items-center gap-2">
            <RadioGroupItem value={opt} id={`${question}-${opt}`} />
            <Label
              htmlFor={`${question}-${opt}`}
              className="cursor-pointer font-normal"
            >
              {opt}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

function CheckboxField({
  question,
  options,
  min,
  max,
  value,
  onChange,
}: {
  question: string
  options: string[]
  min?: number
  max?: number
  value: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (opt: string) => {
    const next = value.includes(opt)
      ? value.filter((v) => v !== opt)
      : max && value.length >= max
        ? value // prevent exceeding max
        : [...value, opt]
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">{question}</Label>
        {(min != null || max != null) && (
          <Badge variant="secondary" className="text-xs font-normal">
            {min != null && max != null
              ? `${min}–${max} selections`
              : min != null
                ? `at least ${min}`
                : `up to ${max}`}
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        {options.map((opt) => (
          <div key={opt} className="flex items-center gap-2">
            <Checkbox
              id={`${question}-${opt}`}
              checked={value.includes(opt)}
              onCheckedChange={() => toggle(opt)}
            />
            <Label
              htmlFor={`${question}-${opt}`}
              className="cursor-pointer font-normal"
            >
              {opt}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main questionnaire card ─────────────────────────────────────────────────

function QuestionnaireCard({ questions }: Questionnaire) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(
    () =>
      Object.fromEntries(
        questions.map((q) => [q.question, q.type === "checkbox" ? [] : ""])
      )
  )

  const setAnswer = (question: string, value: string | string[]) =>
    setAnswers((prev) => ({ ...prev, [question]: value }))

  const isValid = questions.every((q) => {
    const ans = answers[q.question]
    if (q.type === "checkbox") {
      const arr = ans as string[]
      if (q.min != null && arr.length < q.min) return false
      if (q.max != null && arr.length > q.max) return false
      return true
    }
    return (ans as string).trim().length > 0
  })

  return (
    <Card className="">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Please answer the questions below
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-col gap-5 pt-5">
        {questions.map((q: Question, i: number) => {
          const ans = answers[q.question]
          switch (q.type) {
            case "freeform":
              return (
                <FreeformField
                  key={i}
                  question={q.question}
                  value={ans as string}
                  onChange={(v) => setAnswer(q.question, v)}
                />
              )
            case "radio":
              return (
                <RadioField
                  key={i}
                  question={q.question}
                  options={q.options}
                  value={ans as string}
                  onChange={(v) => setAnswer(q.question, v)}
                />
              )
            case "checkbox":
              return (
                <CheckboxField
                  key={i}
                  question={q.question}
                  options={q.options}
                  min={q.min}
                  max={q.max}
                  value={ans as string[]}
                  onChange={(v) => setAnswer(q.question, v)}
                />
              )
          }
        })}
      </CardContent>

      <Separator />

      <CardFooter className="pt-4">
        <Button
          className="w-full"
          disabled={!isValid}
          onClick={() => submitToChat(answers)}
        >
          Submit answers
        </Button>
      </CardFooter>
    </Card>
  )
}

// ─── Tool event wrappers ─────────────────────────────────────────────────────

function ToolStart({ input, callId }: { input: unknown; callId: string }) {
  const parsed = input as Questionnaire
  return <QuestionnaireCard key={callId} {...parsed} />
}

function ToolResult({ output, callId }: { output: unknown; callId: string }) {
  return (
    <Card className="w-full max-w-lg border-dashed opacity-50">
      <CardHeader className="pb-1">
        <CardTitle className="font-mono text-xs text-muted-foreground">
          tool_result · {callId}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-xs break-all whitespace-pre-wrap text-muted-foreground">
          {JSON.stringify(output, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}

export { ToolStart, ToolResult }
