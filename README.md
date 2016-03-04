# Joose Carousel Component

A lightweight, minimal and basic styled carousel component. This component belongs to the Joose component library, but can be used completely independently.

Please see [joose](https://github.com/scoobster17/joose) for the whole component library.

The package includes a basic CSS file (along with source Sass files) to handle the basic positioning of content as an example. No styling has been applied other than simple styles. This means you can have a horizontally aligned carousel or vertically aligned carousel. You can utilise the existing HTML/CSS as per the example, or you can add your own classes / selectors of your choice and customise as you wish, for example to add animations or effects.

## Installation

To install this component independently using [bower](http://bower.io/search/?q=joose-carousel) use the following command:

`bower install joose-carousel` (Please note this is not yet active and only a demonstration)

To install this component independently using [npm](https://www.npmjs.com/package/joose-carousel) use the following command:

`npm install joose-carousel` (Please note this is not yet active and only a demonstration)

## Usage

The carousel can be initialised in two different ways  
`var componentCarousel = new joose.classes.Carousel('componentContainer', 1);`  
or  
`<section id="carouselContainer" data-component="carousel" data-default-page="1" direction="vertical">`

On page load the script searches the page for the `data-component` attribute to pick up any components that haven't been manually initialised using the `new` keyword as demonstrated above.

Here is an example of the HTML required for the carousel:

```html
<section id="carousel" data-component="carousel" data-default-page="1" data-direction="horizontal" data-pages-visible="1">
    <ul>
        <li><a>Previous page</a></li>
        <li><a href="#lorem1" id="lorem1Trigger" aria-controls="lorem1">Lorem 1</a></li>
        <li><a href="#lorem2" id="lorem2Trigger" aria-controls="lorem2">Lorem 2</a></li>
        <li><a href="#lorem3" id="lorem3Trigger" aria-controls="lorem3">Lorem 3</a></li>
        <li><a>Next page</a></li>
    </ul>
    <section id="lorem1" aria-labelledby="lorem1Trigger">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vestibulum mi ut turpis dictum, id mollis eros porttitor. Phasellus consectetur convallis ante, quis condimentum arcu fringilla vitae.</p>
    </section>
    <section id="lorem2" aria-labelledby="lorem2Trigger">
        <p>Donec in semper odio. Fusce eu lacinia leo. Donec ultrices scelerisque velit, in malesuada neque maximus in.</p>
    </section>
    <section id="lorem3" aria-labelledby="lorem3Trigger">
        <p>Praesent sed erat at risus luctus pulvinar. Aenean et rutrum odio. Sed non porta arcu.</p>
    </section>
</section>
```