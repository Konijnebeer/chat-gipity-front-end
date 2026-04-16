import { Spinner } from "#/components/ui/spinner"
import { Badge } from "#/components/ui/badge"
import { Separator } from "#/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "#/components/ui/collapsible"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/components/ui/accordion"
import type { DictionaryQuery, DictionaryResponse } from "@chat-gipity/schemas"
import { ChevronDown, Volume2 } from "lucide-react"
import { useState } from "react"
import { Button } from "#/components/ui/button"
import { ToolError, ToolLoading } from "./tool"

function DetailLine({
  label,
  values,
  limit,
}: {
  label: string
  values: string[]
  limit: number
}) {
  if (!Array.isArray(values) || values.length === 0) return null

  return (
    <p className="text-xs text-muted-foreground">
      <span className="font-medium">{label}: </span>
      {values.slice(0, limit).join(", ")}
    </p>
  )
}

function DefinitionList({
  definitions,
  definitionLimit,
  relatedLimit,
}: {
  definitions: DictionaryResponse["meanings"][number]["definitions"]
  definitionLimit: number
  relatedLimit: number
}) {
  return (
    <ul className="space-y-1.5">
      {definitions.slice(0, definitionLimit).map((def, index) => (
        <li key={`${def.definition}-${index}`} className="space-y-0.5 text-sm">
          <p>{def.definition}</p>
          {def.example && (
            <p className="text-xs text-muted-foreground italic">
              "{def.example}"
            </p>
          )}
          <DetailLine
            label="Synonyms"
            values={def.synonyms ?? []}
            limit={relatedLimit}
          />
          <DetailLine
            label="Antonyms"
            values={def.antonyms ?? []}
            limit={relatedLimit}
          />
        </li>
      ))}
    </ul>
  )
}

function MeaningDetails({
  meaning,
  definitionLimit,
  meaningRelatedLimit,
  definitionRelatedLimit,
}: {
  meaning: DictionaryResponse["meanings"][number]
  definitionLimit: number
  meaningRelatedLimit: number
  definitionRelatedLimit: number
}) {
  return (
    <div className="space-y-1.5">
      <DetailLine
        label="Synonyms"
        values={meaning.synonyms ?? []}
        limit={meaningRelatedLimit}
      />
      <DetailLine
        label="Antonyms"
        values={meaning.antonyms ?? []}
        limit={meaningRelatedLimit}
      />
      <DefinitionList
        definitions={meaning.definitions}
        definitionLimit={definitionLimit}
        relatedLimit={definitionRelatedLimit}
      />
    </div>
  )
}

function ToolStart({
  input,
  callId,
}: {
  input: DictionaryQuery
  callId: string
}) {
  void callId
  return (
    <ToolLoading
      searchString="Looking up"
      toolName="Dictionary Lookup"
      query={`"${input.word}"`}
    />
  )
}

function ToolResult({
  output,
  callId,
}: {
  output: DictionaryResponse | { error: string }
  callId: string
}) {
  void callId
  const [isMeaningsOpen, setIsMeaningsOpen] = useState(false)
  if ("error" in output) {
    return (
      <ToolError
        toolName="Dictionary Lookup"
        error={output.error}
      />
    )
  }

  const response = output

  const isDetailed = response.detailed === true
  const meanings = Array.isArray(response.meanings) ? response.meanings : []
  const visibleMeanings = isDetailed ? meanings : meanings.slice(0, 2)
  const definitionLimit = isDetailed ? 40 : 4
  const meaningRelatedLimit = isDetailed ? 12 : 6
  const definitionRelatedLimit = isDetailed ? 10 : 4

  function playAudio() {
    if (!response.audio) return
    void new Audio(response.audio).play().catch(() => undefined)
  }

  return (
    <div
      className={`mt-2 mr-2 mb-2 inline-block w-full space-y-3 rounded-md bg-muted/50 p-4 ring-1 lg:max-w-none lg:min-w-64 ${
        isDetailed ? "ring-primary" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex gap-2">
            <p className="text-xl font-semibold">{response.word}</p>
            {isDetailed && (
              <Badge variant="outline" className="mt-2 text-[10px] uppercase">
                detailed
              </Badge>
            )}
          </div>
          {response.phonetic && (
            <p className="text-sm text-muted-foreground">{response.phonetic}</p>
          )}
        </div>
        {response.audio && (
          <Button
            type="button"
            onClick={playAudio}
            variant="outline"
            size="icon"
            aria-label="Play pronunciation"
          >
            <Volume2 className="size-4" />
          </Button>
        )}
      </div>

      {/* Origin */}
      {response.origin && (
        <p className="text-xs text-muted-foreground italic">
          {response.origin}
        </p>
      )}

      <Separator />

      {/* Meanings */}
      {meanings.length === 0 ? (
        <p>No definitions found.</p>
      ) : (
        <Collapsible open={isMeaningsOpen} onOpenChange={setIsMeaningsOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-muted"
            >
              <span>Meanings ({meanings.length})</span>
              <ChevronDown
                className={`size-4 transition-transform ${isMeaningsOpen ? "rotate-180" : ""}`}
              />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="pt-3">
            {isDetailed ? (
              <Accordion
                type="single"
                collapsible
                className="rounded-none border-0"
              >
                {meanings.map((meaning, i) => (
                  <AccordionItem
                    key={`${meaning.partOfSpeech}-${i}`}
                    value={`${meaning.partOfSpeech}-${i}`}
                    className="rounded-none data-open:bg-transparent"
                  >
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {meaning.partOfSpeech}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {meaning.definitions.length} definitions
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="h-auto">
                      <MeaningDetails
                        meaning={meaning}
                        definitionLimit={definitionLimit}
                        meaningRelatedLimit={meaningRelatedLimit}
                        definitionRelatedLimit={definitionRelatedLimit}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
                {visibleMeanings.map((meaning, i) => (
                  <div
                    key={`${meaning.partOfSpeech}-${i}`}
                    className="space-y-1.5"
                  >
                    <Badge variant="secondary" className="text-xs">
                      {meaning.partOfSpeech}
                    </Badge>
                    <MeaningDetails
                      meaning={meaning}
                      definitionLimit={definitionLimit}
                      meaningRelatedLimit={meaningRelatedLimit}
                      definitionRelatedLimit={definitionRelatedLimit}
                    />
                  </div>
                ))}
                {!isDetailed && meanings.length > visibleMeanings.length && (
                  <p className="text-xs text-muted-foreground">
                    Showing {visibleMeanings.length} of {meanings.length}{" "}
                    meanings. Use detailed mode to view more.
                  </p>
                )}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}

export { ToolStart, ToolResult }
