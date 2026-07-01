Regenerate the favicon so it matches the Sprinter IT Hub logo in the site navigation.

1. **Analyze the current logo.** The `SiteNav` component displays a rounded square with a purple gradient (`bg-gradient-primary`) and a white Lucide `Activity` icon (a pulse/line chart symbol). The current `public/favicon.png` has a shield outline around the pulse, which does not match the logo.

2. **Generate a matching favicon.** Use `imagegen--generate_image` to create a new favicon: a rounded square with the Sprinter purple gradient and a clean white activity/pulse line icon centered inside, without any shield outline. Save it to `public/favicon.png`.

3. **Replace the old favicon.** Overwrite the existing `public/favicon.png` with the newly generated asset.

4. **Verify head link.** Confirm that `src/routes/__root.tsx` already links to `/favicon.png` and remains unchanged.

5. **Validate.** View the generated favicon to confirm it aligns with the navigation logo's visual identity.