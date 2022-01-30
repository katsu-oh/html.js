# html.js

This is a simple HTML builder / DOM builder.
 - The functions have the same names as tags / attributes / styles / events.
 - The functions with string arguments can also be used as tagged templates.
 - The functions return 'this' for the method chaining.

## Example 1
```javascript
const h = HTML(document.body);                                // target element
h. $H1. T`TITLE`. $;
h. $DIV. id`div-2`. color`red`;
h.   T`Click! > `;
h.   $A. href`http://www.example.com/`;
h.     T`Example Company`;
h.   $;
h. $;
h.publish();                                  // append nodes to target element
```

## Result 1
```html
<body>
  <h1>TITLE</h1>
  <div id="div-2" style="color: red;">
    Click! &gt; 
    <a href="http://www.example.com/">
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
for(const ink of inks){                                                 // for ..
  h. $TR;
  h.   $TD. T(ink.label). $;
  h.   $TD. T(ink.color). $;
  h.   $TD. T(ink.date). $;
  if(ink.meter < 20){                                                    // if .. 
    h. $TD. T(ink.meter + "%"). color`red`. $;
  }else{
    h. $TD. T(ink.meter + "%"). color`green`. $;
  }
  h. $;
}
h. $;
h.publish();
```

## Result 2
```html
<body>
  <h1>Inks</h1>
  <table>
    <tr>
      <td>K</td>
      <td>Black</td>
      <td>2020-04-03</td>
      <td style="color: green;">50%</td>
    </tr>
    <tr>
      <td>C</td>
      <td>Cyan</td>
      <td>2020-02-15</td>
      <td style="color: green;">30%</td>
    </tr>
    <tr>
      <td>M</td>
      <td>Megenta</td>
      <td>2021-04-03</td>
      <td style="color: green;">80%</td>
    </tr>
    <tr>
      <td>Y</td>
      <td>Yellow</td>
      <td>2020-01-30</td>
      <td style="color: red;">15%</td>
    </tr>
  </table>
</body>
```

## Example 3
```javascript
HTML`div-target`. $span.T`a message`.$. publish();                // one liner
```

## Result 3
```html
<... id="div-target">
  <span>a message</span>
</...>
```

## Example 4
```javascript
const h = HTML`div-target`;                             // id of target element
h. $SPAN. T`Click here.`;
h.  on.click(showMessage);
h. $;
h. $SPAN. id`res-1`. $;
h. $BR. $;
h. $SPAN;
h.  on.publish(publishSubHTML);
h.  on.click(appendMessage);
h. $;
h. $SPAN. id`res-2`. $;
h.publish();                        // fire 'publish' events after replace nodes

function publishSubHTML(event){
  HTML(event.currentTarget). T`Click here, many times.`. publish();
}

function showMessage(event){
  HTML`res-1`. T`Clicked!`. publish();          // publish() replace child nodes
}

function appendMessage(event){
  HTML`res-2`.
    T`Clicked!`.
    $SPAN. id`res-2`. $.
  publish(true);                         // publish(true) replace target element
}
```

## Result 4
```html
<... id="div-target">
  <span>
    Click here.
  </span>
  <span id="res-1">
    Clicked!
  </span>
  <br>
  <span id="click-2">
    Click here, many times.
  </span>
  Clicked!
  Clicked!
   ...
  <span id="res-2"></span>
</...>
```
