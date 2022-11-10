> 2.0.0-<br>
> Styles and some attributes have changed.
> <details><summary>details...</summary>
> <code>HTML.prototype.&lt;styleName&gt;</code> has changed to <code>HTML.prototype.s.&lt;styleName&gt;</code>. Accordingly, the following functions that represent styles have changed to represent attributes.<br><br>
> <code>HTML.prototype.background</code> <code>HTML.prototype.border</code> <code>HTML.prototype.clear</code> <code>HTML.prototype.color</code> <code>HTML.prototype.height</code> <code>HTML.prototype.width</code>
> </details>

# html.js

This is a simple HTML builder / DOM builder, which runs in a web browser without any compilation. The following features allow you to write not only readable but also writable code.

 - The functions have the same names as tags / attributes / styles / events.
 - The functions return 'this' for using method chaining.
 - The functions with no arguments do not require parentheses.
 - The functions with string arguments can also be used as tagged templates.

It is recommended to use dual indentation, one for JavaScript and the other for HTML (cf. Example 2). Each language should have its own indentation. Dual indentation makes HTML blocks findable, if/for statements available, and levels of nesting fewer, so that you can write more readable code.

See [Wiki](https://github.com/katsu-oh/html.js/wiki) for details.  A converter is [here](https://katsu-oh.github.io/html.js/convert.html?var=h).

## Usage
1. Write a 'script' element the 'type' attribute of which is 'module'.
1. Import html.js from a CDN.
1. Write HTML with html.js (cf. Example 1-4).

```html
<!DOCTYPE html>
<meta charset="utf-8">
<title>The first HTML</title>

<script type="module">
import {HTML, E} from "https://cdn.jsdelivr.net/gh/katsu-oh/html.js/html.min.js";

const h = HTML(document.body);
h. $P;
h.   T`The first HTML.`;
h. $;
h.publish();
</script>
```

## Example 1
```javascript
const h = HTML(document.body);                                       // target element
h. $H1. T`TITLE`. $;
h. $DIV. id`div-example`. s.color`red`;
h.   T`Click! > `;
h.   $A. class`link`. href`http://www.example.com/`;
h.     T`Example Company`;
h.   $;
h. $;
h.publish();                                         // append nodes to target element
```

## Result 1
```html
<body>
  <h1>TITLE</h1>
  <div id="div-example" style="color: red;">
    Click! &gt; 
    <a class="link" href="http://www.example.com/">
      Example Company
    </a>
  </div>
</body>
```

## Example 2
```javascript
const inks = [
  { label: "K", color: "Black",   date: "2020-04-03", meter: 50 },
  { label: "C", color: "Cyan",    date: "2020-02-15", meter: 30 },
  { label: "M", color: "Megenta", date: "2021-04-03", meter: 80 },
  { label: "Y", color: "Yellow",  date: "2020-01-30", meter: 15 }
];

const h = HTML(document.body);
h. $H1. T`Inks`. $;
h. $TABLE;
h.   $TBODY;
for (const ink of inks) {                                                    // for ..
  h.   $TR;
  h.     $TD. T(ink.label). $;
  h.     $TD. T(ink.color). $;
  h.     $TD. T(ink.date). $;
  if (ink.meter >= 20) {                                                      // if ..
    h.   $TD. T(ink.meter + "%"). s.color`green`. $;
  } else {
    h.   $TD. T(ink.meter + "%"). s.color`red`. s.backgroundColor`pink`. $;
  }
  h.     $TD;
  h.       $BUTTON. type`button`. disabled(ink.meter >= 20). T`Replace`. $;
  h.     $;
  h.   $;
}
h.   $;
h. $;
h.publish();
```

## Result 2
```html
<body>
  <h1>Inks</h1>
  <table>
    <tbody>
      <tr>
        <td>K</td>
        <td>Black</td>
        <td>2020-04-03</td>
        <td style="color: green;">50%</td>
        <td>
          <button type="button" disabled="">Replace</button>
        </td>
      </tr>
      <tr>
        <td>C</td>
        <td>Cyan</td>
        <td>2020-02-15</td>
        <td style="color: green;">30%</td>
        <td>
          <button type="button" disabled="">Replace</button>
        </td>
      </tr>
      <tr>
        <td>M</td>
        <td>Megenta</td>
        <td>2021-04-03</td>
        <td style="color: green;">80%</td>
        <td>
          <button type="button" disabled="">Replace</button>
        </td>
      </tr>
      <tr>
        <td>Y</td>
        <td>Yellow</td>
        <td>2020-01-30</td>
        <td style="color: red; background-color: pink;">15%</td>
        <td>
          <button type="button">Replace</button>
        </td>
      </tr>
    </tbody>
  </table>
</body>
```

## Example 3
```javascript
HTML`div-target`. $SPAN. T`a message`. $. publish();                      // one liner
```

## Result 3
```html
<... id="div-target">
  <span>a message</span>
</...>
```

## Example 4
```javascript
let newID = 0;

const id1 = ++newID;
const id2 = ++newID;

const h = HTML`div-target`;                                    // id of target element
h. $SPAN. T`Click here.`;
h.   on.click(showMessage);
h. $;
h. $SPAN. id(id1). $;
h. $BR. $;
h. $SPAN;
h.   on.publish(publishSubHTML);
h.   on.click(appendMessage);
h. $;
h. $SPAN. id(id2). data_`count``1`. hidden. $;
h.publish();                              // fire 'publish' events after replace nodes

function publishSubHTML(event) {
  HTML(event.currentTarget). T`Click here, many times.`. publish();
}

function showMessage(event) {
  HTML(id1). T`Clicked!`. publish();                 // publish(): replace child nodes
}

function appendMessage(event) {
  const count = Number(E(id2).dataset.count);              // E(id): get element by id
  const h = HTML(id2);
  h. T`Clicked!`. T(count);
  h. $SPAN. id(id2). data_`count`(count + 1). hidden. $;
  h.publish(true);                            // publish(true): replace target element
}
```

## Result 4
```html
<... id="div-target">
  <span>
    Click here.
  </span>
  <span id="1">
    Clicked!
  </span>
  <br>
  <span>
    Click here, many times.
  </span>
  Clicked!1
  Clicked!2
  Clicked!3
  <span id="2" data-count="4" hidden=""></span>
</...>
```

## Example 5
```javascript
const js = HTML().HTML                                                    // from HTML
 `<h1>TITLE</h1>
  <div id="div-example" style="color: red;">
    Click! &gt; 
    <a class="link" href="http://www.example.com/">
      Example Company
    </a>
  </div>`
.toLocaleString();                                                    // to JavaScript
alert(js);
```

## Result 5
```
$H1.T`TITLE`.$.
$DIV.id`div-example`.s.color`red`.
  T`Click! > `.
  $A.class`link`.href`http://www.example.com/`.
    T`Example Company`.
  $.
$.
```

## <br>
©2022 katsu-oh, MIT License: https://github.com/katsu-oh/html.js/blob/main/LICENSE.
