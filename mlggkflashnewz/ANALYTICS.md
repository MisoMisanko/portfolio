# Newsletter analytics

GA4 stream: G-R2X574NR4N. Loaded only on newsletter pages after explicit consent. Refusal leaves Google analytics unloaded. Consent choice lasts 180 days; the settings button allows withdrawal. Advertising consent remains denied. No person names or emails in UTM parameters.

## First direct-message link

https://misomisanko.com/mlggkflashnewz/?s=m

The short code maps to source `m` (management), medium `internal`, campaign `flashnewz_` + the currently displayed coveredFrom date and content `management_share`. A later visit after the edition changes is attributed to the then-current edition. For fixed edition attribution use full UTM links instead.

This labels distribution, not a person. Forwarding preserves the label. Sessions are not unique people, and refusal/blockers mean some visits will not appear. No retrospective tracking before installation.

## Events and reporting

- `section_view`: one per visible section transition after consent, including back navigation. Parameters: `section`, `edition`.
- `article_open`: outbound source/project clicks; `content_title`, `link_domain`, sanitized `link_url`.
- `video_play_request`: YouTube player launch request, NOT proof of playback. Includes `video_id`.
- `video_start`: confirmed native HTML video playing event; not YouTube playback.
- GA controls pageviews and enhanced measurement. Use section_view for section analysis, not pageview totals.

In GA Admin > Custom definitions, add event-scoped dimensions for `section`, `edition`, `content_title`, `link_domain`. Use Reports > Acquisition > Traffic acquisition with Session source/medium and Session campaign, then Explorations for section/content events. Compare equivalent periods after publication. Realtime is useful for a consented test; standard reports can take 24–48 hours. Event delivery and appearance in the signed-in GA property must be checked there; file deployment alone does not verify ingestion.

## Weekly publication

Keep analytics.js, consent UI and tracking hooks. Generate campaign names from coveredFrom, e.g. flashnewz_2026_09_21, and produce a direct_message/internal link for each edition. Do not place UTM tags on internal navigation. Do not claim that a particular named person opened a link. Preserve refusal/withdrawal and verify no analytics requests before consent.
