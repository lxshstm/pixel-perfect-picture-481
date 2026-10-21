<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep gift presentation in a shared ShowcaseCard with semantic CSS tokens so browsing and sorting use the same museum treatment.
- Keep all companion sticker asset mappings in game config and render through a browser-safe Bubbu component; absent or failed assets hide without affecting gameplay.
- Preserve the v2 localStorage schema and existing domain logic during presentation updates to keep old game progress compatible.
