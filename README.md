# idyll-fixed-scroll
Demo repo for fixed scroller component in idyll

## Using this in your project

### Get the updated component

This relies on a modified version of the featured component. Copy the `Feature` component from this repo (located in `components/default/feature.js`) into your project. You can overwrite your current default feature component, or give this one a new name name.

You'll also need to install the scrollama library:

```
$ npm install --save scrollama
```

### Including the markup

The most basic markup to use this looks like:

```
[Feature]
  [Feature.Content]
    // put the thing that will stay fixed here
  [/Feature.Content]

  [Feature.Step]
    // your text here
  [/Feature.Step]
```

#### Multiple steps

To include multiple steps, and have the fixed interactive update based on scrolling, use this pattern:


```
[var name:"firstIndex" value:0 /]
[Feature index:firstIndex ]
  [Feature.Content]
    [div className:"feature-body first"]
      [display var:firstIndex /]
    [/div]
  [/Feature.Content]

  [Feature.Step]
    Text here...
  [/First.Step]
  [Feature.Step]
    When you get to here, the index will update automatically
  [/First.Step]
  [Feature.Step]
    More text......
  [/First.Step]
```


#### Multiple fixed scrollers

You can include multiple of these on the page, in the way you'd expect. See index.idl for the full example.


## CSS

If you use this, you are still responsible for styling the components. The styles contained in `styles.css` in this repo are a good starting place but you might have to modify them to fit your needs based on the size of your fixed components, page layout, etc.