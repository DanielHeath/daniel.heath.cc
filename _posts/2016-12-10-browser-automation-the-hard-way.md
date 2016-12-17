---
layout: post
title: Learn browser automation from scratch

excerpt: Browser tests are famously full of hard to debug, unreliable failures.
         This reputation is largely the result of developers learning high-level frameworks without understanding the underlying abstractions.
---

# Browser automation with selenium-webdriver

## Why?

Browser tests are super useful, but they're famous for having hard to debug, unreliable failures.

This reputation is largely the result of developers learning high-level frameworks without understanding the underlying abstractions.

In this guide I'll show you some cool terminal tricks - including how to drive a browser directly.

I wouldn't write my tests for a production app this way, but it illustrates the underlying concepts in a way most tools abstract away.

This will help you to develop a better understanding of how most web testing tools work.

## Setup

You will need:

 * Java
 * Google chrome
 * A base64 decoder (preinstalled on mac) to get screenshots
 * A terminal (preinstalled on linux/mac)
 * curl (installed on most linux/mac )
 * [jq](https://stedolan.github.io/jq/download/) to extract fields from JSON documents
 * [selenium-server-standalone.jar](http://www.seleniumhq.org/download/) selenium-webdriver (not the same as selenium-rc - referred to as 'selenium' below)
 * [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/)

If you are using homebrew on mac, you can install the last three that way:

~~~bash
brew install selenium-server-standalone
brew install jq
brew install chromedriver
~~~

## Getting started

selenium is the predominant way of writing automatinc browser tests. It can operate all major browsers.

Selenium runs on a client/server model with the following components:

 * Some website(s)
 * A browser (chrome, in this example)
 * Selenium-server (to open and control the browser)
 * Your custom browser automation code (I'll help you write some in this post)

Open a terminal and run the standalone server:

~~~bash
# On OSX using homebrew:
/usr/local/bin/selenium-server -port 4444

# Everyone else - you'll need to be in the directory where selenium is downloaded to / installed:
java -jar selenium-server-standalone-3.0.1.jar -port 4444
~~~

Leave this running and open a another terminal window.
In the new window, run the following to ask the server to start a new chrome session
(copy & paste will work, or save it to a file and run `source <file>`):

~~~bash
`# Save the URL to the local selenium server`
`# to the variable SELENIUM_URL`
SELENIUM_URL="http://localhost:4444/wd/hub/session"

`# Save the result of asking for a new browser session`
`# to the variable SELENIUM_SESSION_ID`
SELENIUM_SESSION_ID=$( \
  `# Use curl to make a HTTP POST asking the selenium` \
  `# server to open chrome` \
  curl "$SELENIUM_URL" \
       --data-ascii \
       '{"desiredCapabilities":{"browserName":"chrome"}}' \
       | jq -r .sessionId \
)
~~~

You should see a new window running chrome, looking at a blank page.

The above command sets your current shell (terminal window) up
with the variables `SELENIUM_SESSION_ID` and `SELENIUM_ID`,
which are used in later commands.

If you open a new shell, those variables will not be present
and the commands won't work.

## Navigating

Lets make our browser go to google.

~~~bash
curl "$SELENIUM_URL/$SELENIUM_SESSION_ID/url" \
     --data-ascii \
     '{"url": "https://google.com"}' \
     | jq .
~~~

You should see:

 * A page of JSON, including `{"state": "success"}`
 * The chrome window is now on google.com.

## Filling in forms

Lets automate issuing a search.
First, find the input element:

~~~bash
SEARCH_BOX_ELEMENT=$(
  curl "$SELENIUM_URL/$SELENIUM_SESSION_ID/element" \
       --data-ascii \
       '{"using": "css selector", "value": "input[name=q]"}' \
       `# Use 'jq' to extract part of the response. ` \
       `# -r to get the text without quotes. ` \
       | jq -r .value.ELEMENT \
)
~~~

Now we'll type something into the search box:

~~~bash
curl "$SELENIUM_URL/$SELENIUM_SESSION_ID/element/$SEARCH_BOX_ELEMENT/value" \
     --data-ascii \
     '{"value": ["s","e","l","e","n","i","u","m", "\n"]}' \
     | jq .
~~~

Switching to the chrome window, you should be able to see the search results.

## Customizing your shell

This is getting repetitive. Lets define some bash functions to make it easier:

~~~bash
function debug {
  if [ -n "$DEBUG" ] ; then
    # Print debug messages to STDERR
    echo "$@" 1>&2
  fi
}

function get {
  # Build the URL, requiring that a path was provided
  local URL="${SELENIUM_URL}/${SELENIUM_SESSION_ID}${1?Must provide URL}"

  debug "$URL"

  # Fetch the URL and format with jq.
  curl --silent "${URL}" | jq .
}

function post {
  # Build the URL, requiring that a path was provided
  local URL="${SELENIUM_URL}/${SELENIUM_SESSION_ID}${1?Must provide URL}"

  # Set a default value for the POST data
  local DATA="${2-{\}}"

  # Validate that the provided data is valid JSON
  echo "$DATA" | jq . > /dev/null || \
    ${ALLOW_INVALID_JSON?Second argument is not valid JSON}

  debug "$URL"

  # Fetch the URL and format the response with jq.
  curl --silent "${URL}" --data-ascii "${DATA}" | jq .
~~~

## Screenshots

Lets use these new functions to take a screenshot:

~~~bash
get /screenshot `# Ask for a screenshot` \
    | jq -r .value `# Fetch the raw (-r) string from the 'value'` \
    | base64 -D `# Decode the base64-encoded data provided by selenium` \
    > screenshot.png `# Save the result to screenshot.png`
~~~

If you open 'screenshot.png' you should see the page screenshotted.

## Extracting text from the page

Lets grab the URL of each search result.

Looking at the document using 'inspect element', I can see that
search result URLs are all in `cite` elements and nothing else is.
That sounds like a good way to identify those URLs.

~~~bash
for element_id in $( \
  post /elements \
       '{"using": "css selector", "value": "cite"}' \
       | jq -r .value[].ELEMENT \
  ) ; do
  get "/element/$element_id/text" | jq -r .value
done
~~~

I get the following output:

~~~plain
www.seleniumhq.org/
www.seleniumhq.org/
www.webmd.com/a-to-z-guides/supplement-guide-selenium
https://en.wikipedia.org/wiki/Selenium
https://ods.od.nih.gov/factsheets/Selenium-HealthProfessional/
https://www.nrv.gov.au/nutrients/selenium
https://cosmosmagazine.com › Geoscience › Topics
www.whfoods.com/genpage.php?dbid=95&tname=nutrient
selenium-python.readthedocs.io/
selenium-python.readthedocs.io/getting-started.html
https://seleniumhq.wordpress.com/
~~~


## Further reading

I've referred frequently to [the spec](https://w3c.github.io/webdriver/webdriver-spec.html) in writing this.
In particular, the "List of Endpoints" and "Command Contexts" sections are useful.
At the time of writing you can search the page for those terms to get there quickly.

## Builtin methods

The list of supported actions (from [the spec](https://w3c.github.io/webdriver/webdriver-spec.html)) are summarized below.

The spec makes for hard reading but each section is quite short.

 * New Session (*POST*) - Open a browser session. The only API not requiring a session ID
 * Delete Session (*DELETE*) - Terminate a browser session
 * Status (*GET*) - Describe a session
 * Go (*POST*) - Navigate the current tab
 * Get Current URL (*GET*)
 * Back (*POST*)
 * Forward (*POST*)
 * Refresh (*POST*)
 * Get Title (*GET*)
 * Get Page Source (*GET*)
 * Take Screenshot (*GET*) - Return a base64 encoded PNG of the page

### Element interaction

These APIs operate on element handles, which are opaque IDs
allocated by selenium when you find/get an element.

Use those IDs to interact with elements.

 * Find Element (*POST*)
 * Find Element From Element (*POST*)
 * Find Elements (*POST*)
 * Find Elements From Element (*POST*)
 * Get Active Element (*GET*)
 * Is Element Selected (*GET*)
 * Get Element Attribute (*GET*)
 * Get Element Property (*GET*)
 * Get Element CSS Value (*GET*)
 * Get Element Text (*GET*)
 * Get Element Tag Name (*GET*)
 * Get Element Rect (*GET*) - get element position and size
 * Is Element Enabled (*GET*) - only for form controls
 * Element Click (*POST*)
 * Element Clear (*POST*) - Empty text fields, unchecks checkboxes, etc
 * Element Send Keys (*POST*) - Can be used to fill in forms, hit enter, etc.
 * Take Element Screenshot (*GET*) - Return a base64 encoded PNG of the element

### Javascript

Inject arbitrary JS to run in the page.

 * Execute Script (*POST*) - Must be expressed as an inline function call - return value is serialized and sent back
 * Execute Async Script (*POST*)

### Modals: 'alert', 'confirm' and 'prompt'
 * Dismiss Alert (*POST*)
 * Accept Alert (*POST*)
 * Get Alert Text (*GET*)
 * Send Alert Text (*POST*) - Fill in a prompt

### Cookies

 * Get All Cookies (*GET*)
 * Get Named Cookie (*GET*)
 * Add Cookie (*POST*)
 * Delete Cookie (*DELETE*)
 * Delete All Cookies (*DELETE*)

### Window management

Lets you open multiple tabs/windows in the same selenium session.

 * Get Window Handle (*GET*)
 * Close Window (*DELETE*)
 * Switch To Window (*POST*)
 * Get Window Handles (*GET*)
 * Fullscreen Window (*POST*)
 * Maximize Window (*POST*)
 * Set Window Size (*POST*)
 * Get Window Position (*GET*)
 * Set Window Position (*POST*)
 * Get Window Size (*GET*)
 * Switch To Frame (*POST*)
 * Switch To Parent Frame (*POST*)

### Timeout management

Lets you define how long a page is allowed to spend loading html/scripts.

I haven't had a reason to use them to date so can't describe them in much more detail than that.

 * Get Timeouts (*GET*)
 * Set Timeouts (*POST*)

### Action API

This API lets you script relatively advanced sequences of user behaviors - eg by describing the touch events that form a gesture.

I haven't had a reason to use them to date so can't describe them in much more detail than that.

 * Perform Actions (*POST*)
 * Releasing Actions (*DELETE*)

