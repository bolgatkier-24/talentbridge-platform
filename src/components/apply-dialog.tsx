import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Opportunity } from '@/lib/fixtures'

/**
 * Application form. In this milestone the submission is simulated; milestone 6
 * replaces `onSubmitted` with a server function that writes to `applications`.
 */
export function ApplyDialog({
  opportunity,
  open,
  onOpenChange,
  onSubmitted,
}: {
  opportunity: Opportunity
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitted: (id: string) => void
}) {
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = note.trim()
    if (trimmed.length < 20) {
      setError('Tell the employer a little more — at least 20 characters.')
      return
    }
    if (trimmed.length > 800) {
      setError('Keep it under 800 characters.')
      return
    }
    setError(null)
    setPending(true)
    await new Promise((r) => setTimeout(r, 700))
    setPending(false)
    onSubmitted(opportunity.id)
    setNote('')
    onOpenChange(false)
    toast.success('Application sent', {
      description: `Your profile and verified skills were shared with the team for “${opportunity.title}”.`,
      icon: <CheckCircle2 className="size-4 text-primary" />,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={submit} noValidate>
          <DialogHeader>
            <DialogTitle>Apply: {opportunity.title}</DialogTitle>
            <DialogDescription>
              Your TalentBridge profile and verified proof-of-skill records are attached
              automatically. No CV needed.
            </DialogDescription>
          </DialogHeader>
          <div className="my-5 space-y-2">
            <Label htmlFor="apply-note">Why are you a good fit?</Label>
            <Textarea
              id="apply-note"
              rows={5}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              aria-invalid={!!error}
              aria-describedby="apply-note-help"
              placeholder="Point to a project or proof of skill that shows you can do this work."
            />
            <p
              id="apply-note-help"
              className={error ? 'text-sm font-semibold text-destructive' : 'text-sm text-muted-foreground'}
              role={error ? 'alert' : undefined}
            >
              {error ?? `${note.trim().length}/800 characters`}
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="animate-spin motion-reduce:animate-none" />}
              {pending ? 'Sending…' : 'Send application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
