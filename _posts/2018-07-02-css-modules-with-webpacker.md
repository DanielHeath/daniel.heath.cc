---
layout: post
title: CSS Modules in Rails with Webpacker

excerpt: Setting up a Rails project to use CSS Modules
---

## CSS Modules?

CSS Modules lets you write CSS with predictable local scope.

This avoids the need for (eg) manually following a naming convention to prevent accidental conflicts.

## Alright, how do I do it?


### Install webpacker

First, your app will need the `webpacker` gem installed & configured (new rails apps come with it).

Add `javascript_pack_tag` and `stylesheet_pack_tag` to your layout per the webpacker setup instructions.

### Setup CSS modules for webpack

There are two webpack implementations of CSS modules (css-loader and postcss-modules).

Webpacker uses postcss by default, so I've used postcss-modules (`yarn add postcss-modules`).

Having installed postcss-modules and autoprefier using `yarn`, lets configure webpacker to use them.
My projects `.postcssrc.yml` looks like this:
```
plugins:
  postcss-import: {}
  postcss-cssnext: {}
  postcss-modules:
    generateScopedName: '[name]__[local]___[hash:base64:5]'
    modules: true
```

### Add some CSS

Next, lets put some CSS where webpack will find it:

First, write your CSS in `app/javascript/src/my-module.css`.

Then, in `app/javascript/packs/application.js`, add `import myModule from '../src/my-module.css';` (at the start)

After you load a page in development, or run `rake assets:precompile`, you should see a new file appear: `app/javascript/src/my-module.css.json`.
This file describes how your CSS has been transformed.

### Reference your CSS from rails views

I've written a helper to read these files.

In my project it's at `app/helpers/css_modules_helper.rb` and contains the following code:

```
module CssModulesHelper

  mattr_accessor :cache
  self.cache ||= {}

  def cssmodule(path)
    cache = {}
    if Rails.application.config.action_controller.perform_caching
      # Avoid reloading CSS paths
      cache = CssmodulesHelper.cache
    end

    return cache[path] if cache.include?(path)

    mod = JSON.parse(File.read Rails.root.join('app', 'javascript', 'src', path + '.json').to_s)

    # Let people use dashes in CSS and underscores in ruby
    mod.keys.each { |k| mod[k.underscore] = mod[k] }

    os = OpenStruct.new(mod)

    def os.call(*args)
      args.map do |arg|
        case arg
        when Hash
          arg.keys.select {|k| arg[k]}.map {|k| public_send(k) }
        else
          public_send arg
        end
      end.compact.flatten.join(" ")
    end

    cache[path] = os

    yield os
  end

end

```

Finally, we can reference our CSS from a view:
```
<% cssmodule "my-module.css" do |css| %>
  <!-- Dashes are turned into underscores, so .my-box becomes my_box -->
  <div
    class="<%= css.my_box %>"
  >
    a box
  </div>

  <!-- The helper also offers multiple & conditional class names (like the classnames JS lib) -->
  <div
    class="<%= css.(:my_box, my_class: (Random.rand > 0.5)) %>"
  >
    conditional class
  </div>
<% end %>
```

You should see your styles applying now.

## Production

However you organize your deploy, your production app needs the JSON files to be available on the server (so the helper can read them).

The precise method you use to achieve this will vary according to your asset delivery configuration.
