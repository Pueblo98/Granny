---
title: "Obsidian cockpit plugin assessment"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [execution, research, obsidian]
related:
  - cockpit-guide.md
  - ../Cockpit.md
---

# Obsidian plugin choices

Desk review: **2026-09-14**. This assesses fit, not a security audit or runtime compatibility test. Source pages can change. Only plugin IDs/core enablement were inspected locally; private workspace and plugin settings were not modified.

## Recommended stack

| Tool | Role here | Decision |
|---|---|---|
| Bases, core | Live session and message tables from Markdown properties | Use now; already enabled in existing vault |
| Canvas, core | Spatial development overview with linked live notes | Use now; already enabled |
| Bookmarks, core | One-click entry to Cockpit | Already enabled; Simon can bookmark the note |
| Workspaces, core | Save cockpit/review pane layout | Useful optional enablement; currently disabled, no setting changed |
| Tasks, community: obsidian-tasks-plugin | Aggregate checkbox subtasks, due dates and recurrence | Best optional add-on if checklist volume grows; not needed for current canonical backlog |
| Dataview, community: dataview | More expressive read-only joins/queries than the initial Bases views | Reserve for an unmet query need; avoid DataviewJS and inline JS |
| Kanban, community: obsidian-kanban | Markdown-backed cards | Do not add now: upstream moved to community-archive and README seeks maintainers; this is maintenance uncertainty, not a verified GitHub archived flag |

**Recommendation: no community installation is needed for this first cockpit.** Installing more dashboard plugins would not create trustworthy session evidence or synchronize worktrees. Start with the already-enabled core tools and the source records in this package. This is a deliberate implementation choice, not a claim that plugins were installed.

No auto-Git plugin: automatic commits/pulls could conflict with isolated worktrees, private vault state and Simon's merge authority. No messaging/cloud/dashboard plugin or AI vault reader is required. No added DataviewJS, Templater scripts, embedded remote dashboard or custom Obsidian plugin.

## Source register

| Publisher / checked source | What it establishes | Limitation |
|---|---|---|
| Obsidian: [Bases](https://help.obsidian.md/bases), [syntax](https://help.obsidian.md/bases/syntax), [embedding](https://help.obsidian.md/bases/create-base) | Core local note/property views, YAML definitions and note embeds | Does not prove these authored views render on the installed version; table layout chosen for compatibility |
| Obsidian: [Canvas](https://help.obsidian.md/plugins/canvas); JSON Canvas: [specification](https://jsoncanvas.org/spec/1.0/) | Visual linked files and portable JSON node/edge model | Canvas positions are navigation, not automatic task state or agent presence |
| Obsidian: [Bookmarks](https://help.obsidian.md/plugins/bookmarks), [Workspaces](https://help.obsidian.md/plugins/workspaces) | Saved entry points and pane arrangements | User-local settings; no settings were enabled or saved here |
| Obsidian: [plugin security](https://help.obsidian.md/plugin-security) | Community-plugin trust/access considerations | Directory inclusion is not an independent security audit |
| Tasks maintainers: [repository](https://github.com/obsidian-tasks-group/obsidian-tasks), [guide](https://publish.obsidian.md/tasks/Introduction) | Query tasks across notes and update source checkboxes | Checkbox completion cannot approve Granny gates; no installation/test performed |
| Dataview maintainer: [documentation](https://blacksmithgu.github.io/obsidian-dataview/), [security note](https://github.com/blacksmithgu/obsidian-dataview#javascript-queries-security-note) | Property/index queries; JS queries can write files and make network calls | Do not enable JS merely to create a dashboard; no code audit performed |
| Kanban maintainers: [current README](https://github.com/community-archive/obsidian-kanban/blob/main/README.md) | Markdown boards; request for new maintainers | Redirect to an archive-named organization alone does not establish repository archived status |

## Optional installation, only after choosing a need

If Simon later selects Tasks: in the **docs/** vault, Settings → Community plugins → Browse → “Tasks”, verify the maintainer/repository above, review current release and permissions, Install, then Enable. Restrict its task filter to a project tag; do not import all ordinary checkboxes as project acceptance. Test on one disposable non-sensitive note before relying on it. Keep plugin/config files ignored. To undo, disable/uninstall through Obsidian; plain Markdown remains.

For Dataview, use the corresponding “Dataview” listing only if Bases cannot answer a named query. Leave JavaScript query modes off. For this cockpit, neither is a dependency, so there is no plugin setup step blocking review.

The earlier instruction to preserve ignored .obsidian JSON remains in force. No download, install, automatic plugin update or private configuration write occurred. Local enablement and in-app render checks must be reported separately from file creation.
