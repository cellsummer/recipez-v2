# Xiaolin's Cookbook

Hugo site. No theme dependency: the templates are in `layouts/`, the styles are in `assets/css/main.css`, and the script is in `assets/js/site.js`.

## Add a recipe

```sh
hugo new content my_dish.md       # writes the front matter template
# put the photo in assets/img/my_dish.jpeg
hugo server                        # preview at http://localhost:1313/cookbook/
```

Front matter fields: `title`, `tagline`, `tags`, `recipe_image`, `servings`, `prep_time`, `cook_time`, `cook_increment` (`minutes` | `hours`), `cook` (`false` shows "Chill"), `calories`, `author`, `date`.

Body: each `## Heading` starts a section. The first section (Ingredients) shows in the sidebar. The other sections show in the main column. Use `-` lists for ingredients and `1.` lists for steps.

Photos in `assets/img/` are resized and converted to WebP at build time. Photos in `static/img/` also work, but they are not resized.

## Deploy

When you push to `main`, `.github/workflows/deploy.yml` builds the site and publishes it to `cellsummer/cookbook`. The repo needs the `COOKBOOK_DEPLOY_KEY` secret.
