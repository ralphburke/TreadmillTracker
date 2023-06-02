# TreadmillTracker

### Screen dimensions
Desktop: 1225 x 689

Mobile: 750 x 1334

### Required installations
Node.js, which can be installed from https://nodejs.org/en

Express, which can be installed using the command `npm install express`

Parcel, which can be installed using the command `npm install --save-dev parcel`

Sass, which can be installed using the command `npm install sass`

### Running
The application can by run using `npm run dev`

## Application structure
The application has a landing page base and uses pop-up pages for additional content. These pop-ups are used for entering new treadmill sessions and for viewing past sessions. The sessions entry page has a subpage used for managing session templates, and the history page is used for viewing both individual sessions and a list of all past sessions.

## Landing page

### Layout
The landing page consists of the application’s name "Treadmill tracker" as a heading. To centre this heading, I made the header element a flexbox with an h1 element centred inside. To keep the font large on mobile devices, I set the "white-space" property to "prewrap" to split the two words over two lines. I learned this method from [this mozilla page](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space). The space character between the words was throwing off the centring so I put it in a span element and set its font size to 0 for mobile devices.

### New session button
Below the heading is a button for creating a new session. I centred this with a flexbox too. Clicking this opens the session entry pop-up, which works by editing its visibility style to make it visible. All other pop-ups work this way too.

### Zooming out issue
Some of the landing page’s content going off screen was causing the page to constantly zoom out beyond the set dimensions. I found a solution in [this post](https://stackoverflow.com/a/45530211). Adding "minimum-scale 1" to the meta tag prevented the page from zooming out.

### `.pastSession` elements
When the application is loaded, `loadSessions()` and `writeSessions()` run, which respectively load the session information from local storage and generate `.pastSession` elements. The generated elements show only a condensed form of the session information. They are visible at the bottom of the landing page. Each element shows a name, a graph, some stats, and an image. In my mockups, these elements also showed the tiredness information, but I removed this as I felt it made the small box too cluttered. The row of past sessions is labelled "Past sessions". Next to this label is a button styled to look like a link saying "Show all", which opens the history page. Clicking on any session element opens the 'past session' pop-up and fills the page with information about that session.

### `.cloneNode()` for `.pastSession` elements
The `writeSessions()` function calls another function, `pastSessionConstruct()`, with each session as a parameter. Initially, I had intended to create new elements from scratch using JavaScript functions. This would have required a lot of code so I looked for an alternative solution. I ended up using the `.cloneNode()` method I found on [this w3schools page](https://www.w3schools.com/jsref/met_node_clonenode.asp). I created a template in my html, gave it position:absolute and visibility:hidden so it would not get in the way, and cloned it to create each new `.pastSession` element.

### Moving `.pastSession` elements
Opening any page triggers a function that moves each of these past sessions into the history page using `.forEach()` to select each element and `.appendChild()` to move them. Closing the page reverses the process. This serves the dual purpose of disabling the landing page’s sideways scrolling when a pop-up is open while also populating the history page without needing to reconstruct every element.

### Backgrounds
The `.pastSession` elements originally had their background images set to image urls using data attributes when they were created. This created an issue where the files would be renamed automatically in the dist folder and would no longer be retrievable from the original url within JS. I fixed this by replacing the url attributes with simpler ones that would enable Scss to add the correct background. I also removed the image property from session objects as the category property could now fill its role.

## Session entry pop-up

### Layout
For the layout of this pop-up, I closely followed the two column structure from my mockup. I used a grid layout to get the general structure of the page. I first developed the system for entering each leg of the treadmill session. Each leg is a flexbox row of inputs and each row is in a column flexbox. This layout gave me control over the spacing and appearance of each element. Using the overflow-y property, I got the column flexbox to scroll instead of stretching vertically when enough legs were added. This allowed for any number of legs to be added, improving the versatility. The two grid columns are removed for mobile devices and all content is placed in a single column.

### `.cloneNode()` for leg rows
I had originally planned for adding legs to use a function constructing the html elements from scratch. However, this would require a lot of javascript and would be quite inefficient. I used the `.cloneNode()` method from [this page on w3schools](https://www.w3schools.com/jsref/met_node_clonenode.asp).
This function allowed me to create infinitely many new leg rows without using much code. I reused this method several times when I needed many slight variations on complex elements.

### Limits on inputs
I needed to make sure that user-inputted information would be usable and at least somewhat sensible. I used max and min values inside html to control the values that could be entered as inclines (excluding values below -90 degrees and above 90 degrees). I had planned to limit the seconds input to 60 or below, or maybe 59.999 and below. Eventually I decided that it would be better to allow the user to input any number of seconds. This would make the application more versitile by allowing seconds-only time inputs.

Because speed and incline values were not relevant to legs of 'rest' type, I created a function to disable them when 'rest' is selected. Originally, I used had event listener respond to every click with a check to see if 'rest' was selected. I didn’t want every click to run this code so I looked for a solution. I found the 'change' event from [this Mozilla article](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event) which worked well.

### Incline and heart rate iterations
In my mockup the incline and heart rate inputs started as plus symbols which could be clicked to open the input. The intention was to signal that these were optional inputs. The result was that their purpose was unclear. I fixed this issue by making them appear as regular inputs with placeholders stating their purpose to clarify. I figure that any user who isn’t collecting such information will just not include it. The application will work fine regardless, implicitly communicating that these inputs are optional.

I also changed the styling of these inputs. The units are now present in the top-right corner so they don’t interfere with the raw input numbers. In the 'past session' page, a heart symbol is used instead of 'bpm' because it reduces information clutter.

### Tiredness styling and iteration
I was able to style the 'tiredness' radio input as I wanted thanks to [this guide](https://moderncss.dev/pure-css-custom-styled-radio-buttons/).

I also made a small change to the layout. The desktop mockup had labels inline with the selects. I moved the labels down below the radio inputs in line with the mobile mockup. This made the desktop and mobile versions more consistent and allowed the inputs to be larger.

### Template iterations
I added a 'Manage templates' button because my mockup had all the functions for saving templates but no way of deleting unwanted ones. This required a new page for managing templates, which I styled after the 'full history' page for consistency.

I initially modelled the 'save template' buttons with radio inputs, but adding text inside the radio inputs was too difficult so I opted to use button elements instead.

### Button submitting issue
All button elements on my form were submitting the form when clicked. [This post](https://stackoverflow.com/a/10836076) clarified that all buttons are of submit type by default and that this could be overridden with type="button".

## History pop-up

### Layout
The 'full history' section of the history pop-up contains a list of every session in a compact list. It contains all `.pastSession` elements that have been moved from the landing page. They are contained in a flexbox with flex-wrap:wrap and overflow-y:scroll. This positions them in an intuitive layout. On the mobile version, the flexbox is a single column to keep the content large.

### Text outlines
While developing this page I noticed that some of the text in `.pastSession` elements was hard to discern against the background image. I wanted a way of adding a white outline to make the text clearer. The -webkit-text-stroke property I found cut into the text itself and only made it harder to read. The solution I used was applying eight text-shadow attributes to create the appearance of an outline. I found this solution in [this post](https://stackoverflow.com/a/47511171).

## Past session page

### Layout
The 'past session' page works similarly to the 'session entry' page. All elements except the leg rows are pre-placed and edited according to stored information. The page contains two columns, with legs on the right and all other information on the left. All information from a particular session is shown on this page.

### Graph
To avoid recreating an existing graph, the graph is taken from the `.pastSession` element. A function, `enlargeGraph()`, is passed with the graph as a parameter to scale it up.

### Incline positioning iteration
In my mockups, the mobile version displayed the incline on the left of the main legs row and the heart rate to the right. To keep the design consistent and to keep the more optional pieces of information grouped together, I have left the incline on the right next to the heart rate. To facilitate this, I have made the legs display on the 'past session' page left-aligned. This leaves space on the right for incline and heart to appear, while not sacrificing visual balance if they aren’t present.

# Next steps

Further development on this application could streamline the user experience and give them more control. Currently the application gives the user no tools to reorganise or edit the list of past sessions outside of deleting them. The ability to edit information from past sessions would allow mistakes to be changed easily.

As the application is built around giving the user the ability to record and recall information, users could benefit from organisational tools like sorting past sessions by category or have a search function. This would require functions that search through the list of past sessions and pull out those that meet certain criteria.

As the target audience is regular users of treadmills, an inbuilt calendar or integration with an external calendar would be beneficial. This feature would enable the application to more seamlessly fit into a routine. This could also come with the added perks of reminders, goals, and the tracking of statistics over time.

The application should also be optimised for handling large quantities of data. In its current state, there are many instances where functions are being performed on every past session. For large quantities of data, this will result in an unnecessarily large amount of processing. Improvements could be made by expanding the use of temporary local storage so elements do not need to be reconstructed as often.

The combination of these additions would create a very powerful application capable of providing a very simple and user-friendly interface on top of a very detailed information storing and sorting system.


# References

## Image references

Cox, A. (2023). Stag running [Photograph] Unsplash. https://unsplash.com/photos/f0CbvaiFaHw

Fuller, C. (2017). Cheetah running [Photograph] Unsplash. https://unsplash.com/photos/34OTzkN-nuc

Martínez, S. (2019). Penguin walking [Photograph] Unsplash. https://unsplash.com/photos/rhNJJ4eD2zk

Padurariu, A. (2017). Husky running in snow [Photograph]. Unsplash. https://unsplash.com/photos/8hoXEsi2gpo

Mieke, S. (2020). Treadmills in a gym [Photograph]. Unsplash. https://unsplash.com/photos/MsCgmHuirDo


## Synthesised list of code references

HTML

https://stackoverflow.com/a/45530211

CSS

https://stackoverflow.com/a/4298216

https://developer.mozilla.org/en-US/docs/Web/CSS/::placeholder

https://moderncss.dev/pure-css-custom-styled-radio-buttons/

https://www.w3schools.com/css/css_attribute_selectors.asp

https://stackoverflow.com/a/49658476

JavaScript

https://www.w3schools.com/jsref/met_node_clonenode.asp

https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event

https://stackoverflow.com/a/27037567

https://stackoverflow.com/a/36249012

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

https://medium.com/@larry.sassainsworth/iterating-over-an-html-collection-in-javascript-5071f58fad6b

https://stackoverflow.com/a/8043061

https://stackoverflow.com/a/3781018

https://www.digitalocean.com/community/tutorials/css-inherit-initial-unset
