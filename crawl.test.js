const { test, expect } = require("@jest/globals");
const { normalizeURL, getURLsFromHTML, crawlPage } = require("./crawl.js");

describe('Test NormalizedURLs', function() {
     it("Simple URL", () => {
          expect(normalizeURL("https://blog.boot.dev")).toBe("blog.boot.dev");
     });
     it("Simple URL with /", () => {
          expect(normalizeURL("https://blog.boot.dev/")).toBe("blog.boot.dev");
     });
     it("URL With Long Path", () => {
          expect(normalizeURL("http://blog.boot.dev/path/to/something")).toBe("blog.boot.dev/path/to/something");
     });
     it("URL with Path single", () => {
          expect(normalizeURL("https://blog.boot.dev/path/")).toBe("blog.boot.dev/path");
     });
});

describe('Test URLs from HTML', function() {
     it("Get HTML", () => {
          let htmlBody = `
               <html>
                    <body>
                    <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
                    <a href="https://blog.boot.dev/path/"><span>Go to Boot.dev Path</span></a>
              </body>
          </html>`
          const allLinks = getURLsFromHTML(htmlBody, "https://blog.boot.dev")
          expect(allLinks).toEqual(['https://blog.boot.dev/', 'https://blog.boot.dev/path/'])
     })
     it("Get HTML Links", () => {
          const inputURL = 'https://blog.boot.dev'
          const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>'
          const actual = getURLsFromHTML(inputBody, inputURL)
          const expected = ['https://blog.boot.dev/path/one', 'https://other.com/path/one']
          expect(actual).toEqual(expected)
     })
})


describe('Crawl Test', function() {
     it("Crawl Page", async () => {
          const result = await crawlPage("https://blog.boot.dev", "https://blog.boot.dev", {})
          expect(result).toEqual(200)
     })
})
