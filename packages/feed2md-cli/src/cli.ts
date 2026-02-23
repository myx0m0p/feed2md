#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

import { feed2md } from 'feed2md'
import type { MarkdownTemplatePreset } from 'feed2md'
import { Command } from 'commander'

const require = createRequire(import.meta.url)
const { version } = require('../package.json') as { version: string }

function parsePositiveInteger(optionName: string, value: string): number {
  const parsed = Number.parseInt(value, 10)

  if (Number.isNaN(parsed) || parsed < 1) {
    throw new Error(`${optionName} must be a positive integer`)
  }

  return parsed
}

function parseTemplatePreset(value: string): MarkdownTemplatePreset {
  if (value === 'short' || value === 'full') {
    return value
  }

  throw new Error('--template must be one of: short, full')
}

const program = new Command()

program
  .name('feed2md')
  .description('Convert RSS/Atom feed URL to Markdown')
  .version(version, '-v, --version', 'Output the current version')
  .argument('<url>', 'RSS/Atom feed URL')
  .option('-o, --output <file>', 'Write output to a file instead of stdout')
  .option('--limit <number>', 'Limit the number of articles', (value) =>
    parsePositiveInteger('--limit', value),
  )
  .option('--no-summary', 'Skip article summaries in output')
  .option('--summary-max-length <number>', 'Maximum summary length in characters', (value) =>
    parsePositiveInteger('--summary-max-length', value),
  )
  .option(
    '--template <preset>',
    'Built-in markdown template preset (short or full). Default: short',
    parseTemplatePreset,
    'short',
  )
  .option('--template-file <path>', 'Path to a custom Eta template file')
  .action(
    async (
      url: string,
      options: {
        limit?: number
        output?: string
        summary?: boolean
        summaryMaxLength?: number
        template?: MarkdownTemplatePreset
        templateFile?: string
      },
    ) => {
      try {
        const customTemplate = options.templateFile
          ? await readFile(options.templateFile, 'utf8')
          : undefined

        const markdown = await feed2md(url, {
          includeSummary: options.summary,
          limit: options.limit,
          summaryMaxLength: options.summaryMaxLength,
          template: customTemplate,
          templatePreset: options.template,
        })

        if (options.output) {
          await writeFile(options.output, markdown, 'utf8')
          return
        }

        process.stdout.write(`${markdown}\n`)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        process.stderr.write(`feed2md error: ${message}\n`)
        process.exitCode = 1
      }
    },
  )

program.parseAsync(process.argv)
