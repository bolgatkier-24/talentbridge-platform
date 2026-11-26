import { useState } from 'react'
import { Loader2 } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { SKILLS } from '@/lib/fixtures'
import type { ProofSubmission, Skill } from '@/lib/fixtures'

type Errors = Partial<Record<'skill' | 'title' | 'description' | 'evidence' | 'link', string>>

function validate(v: { skill: string; title: string; description: string; evidence: string; link: string }): Errors {
  const e: Errors = {}
  if (!v.skill) e.skill = 'Choose the skill this proves.'
  if (v.title.trim().length < 5) e.title = 'Give it a title of at least 5 characters.'
  if (v.description.trim().length < 20) e.description = 'Describe the task in at least 20 characters.'
  if (v.evidence.trim().length < 10) e.evidence = 'Explain what a reviewer will look at.'
  if (v.link && !/^https?:\/\/\S+\.\S+/.test(v.link.trim())) e.link = 'Enter a full link starting with https://'
  return e
}

export function SubmitProofDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSubmit: (p: ProofSubmission) => void
}) {
  const [v, setV] = useState({ skill: '', title: '', description: '', evidence: '', link: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [pending, setPending] = useState(false)
  const set = (k: keyof typeof v) => (val: string) => setV((s) => ({ ...s, [k]: val }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(v)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setPending(true)
    await new Promise((r) => setTimeout(r, 600))
    setPending(false)
    onSubmit({
      id: `p-${Date.now()}`,
      skill: v.skill as Skill,
      title: v.title.trim(),
      description: v.description.trim(),
      evidence: v.evidence.trim(),
      link: v.link.trim() || undefined,
      submittedAt: new Date().toISOString().slice(0, 10),
      status: 'pending',
    })
    setV({ skill: '', title: '', description: '', evidence: '', link: '' })
    onOpenChange(false)
    toast.success('Proof submitted', { description: 'A reviewer will check it — you’ll be notified when it’s verified.' })
  }

  const field = (id: keyof Errors) => ({ 'aria-invalid': !!errors[id], 'aria-describedby': errors[id] ? `${id}-err` : undefined })
  const err = (id: keyof Errors) =>
    errors[id] ? <p id={`${id}-err`} className="text-sm font-semibold text-destructive">{errors[id]}</p> : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={submit} noValidate className="space-y-4">
          <DialogHeader>
            <DialogTitle>Submit proof of skill</DialogTitle>
            <DialogDescription>
              Share a challenge or real piece of work. Verified proof earns a badge employers can trust.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="skill">Skill</Label>
            <Select value={v.skill} onValueChange={set('skill')}>
              <SelectTrigger id="skill" className="w-full" {...field('skill')}>
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {SKILLS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            {err('skill')}
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Challenge or project title</Label>
            <Input id="title" value={v.title} onChange={(e) => set('title')(e.target.value)} {...field('title')} />
            {err('title')}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} value={v.description} onChange={(e) => set('description')(e.target.value)} {...field('description')} placeholder="What was the task and what did you do?" />
            {err('description')}
          </div>
          <div className="space-y-2">
            <Label htmlFor="evidence">Evidence</Label>
            <Textarea id="evidence" rows={2} value={v.evidence} onChange={(e) => set('evidence')(e.target.value)} {...field('evidence')} placeholder="e.g. Live demo, repository and test results" />
            {err('evidence')}
          </div>
          <div className="space-y-2">
            <Label htmlFor="link">Link to work <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Input id="link" type="url" inputMode="url" value={v.link} onChange={(e) => set('link')(e.target.value)} {...field('link')} placeholder="https://" />
            {err('link')}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="animate-spin motion-reduce:animate-none" />}
              {pending ? 'Submitting…' : 'Submit for review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
