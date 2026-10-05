# Mode: apply-actions
Apply the changes Aly queued in the Lead Engine Dashboard (claude.ai artifact). Aly starts it by pasting the dashboard's "Copy instructions for Claude" text, which lists each pending action with its id.
Where: Odoo `https://meska.odoo.com/odoo/crm/<id>` and the Contact-Us Google Sheet, both in Aly's signed-in browser (Claude in Chrome or the built-in browser). Never enter passwords; if a login page shows, ask Aly to sign in.
Per action kind:
- `stage`: open the lead, set the stage (drag in kanban or the stage bar) to the target value. Confirm the bar shows it.
- `activity_done`: on the lead, mark the scheduled call activity done (no feedback text unless a note action gives one).
- `note`: Log note in the chatter with the exact text.
- `sheet_state`: find the row whose Date cell equals the given timestamp and write the value in the `state` column ("" = clear). Touch no other cell.
After each action: update it in the dashboard's `actions` collection (ArtifactData `update`, pinned with `if_version`): `status: "applied"`, `appliedAt: <ISO time>`; on failure `status: "failed"`, `error: <short reason>`. Do only what is listed; never create, delete or merge leads.
Reply: what changed, what failed and why. Emails are not in this mode: Aly sends them from the dashboard himself.
