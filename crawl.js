const { JSDOM } = require('jsdom')

function normalizeURL(url) {
     const newURL = new URL(url);
     let normalized = ''
     if (newURL.pathname.startsWith('/') && newURL.pathname.length > 0) {
          normalized = `${newURL.host}${newURL.pathname}`
     } else {
          normalized = `${newURL.host}`
     }
     if (normalized.endsWith('/')) {
          normalized = normalized.slice(0, -1)
     }
     return normalized;
}

function getURLsFromHTML(htmlBody, baseURL) {
     const urls = []
     const dom = new JSDOM(htmlBody)
     const aElements = dom.window.document.querySelectorAll('a')
     for (const aElement of aElements) {
          if (aElement.href.slice(0, 1) === '/') {
               try {
                    urls.push(new URL(aElement.href, baseURL).href)
               } catch (err) {
                    console.log(`${err.message}: ${aElement.href}`)
               }
          } else {
               try {
                    urls.push(new URL(aElement.href).href)
               } catch (err) {
                    console.log(`${err.message}: ${aElement.href}`)
               }
          }
     }
     return urls
}

async function crawlPage(baseURL, currentURL, pages) {
     // if this is an offsite URL, bail immediately
     const currentUrlObj = new URL(currentURL)
     const baseUrlObj = new URL(baseURL)
     const normalizedURL = normalizeURL(currentURL)
     let htmlBody = ''

     if (currentUrlObj.hostname !== baseUrlObj.hostname) {
          return pages
     }

     if (pages[normalizedURL] > 0) {
          pages[normalizedURL]++
          return pages
     }

     pages[normalizedURL] = 1

     console.log(`Crawling site with URL: ${currentURL}`)
     try {
          const resp = await fetch(currentURL)
          if (resp.status > 399) {
               console.log(`There has been an error: ${resp.status}`)
               return pages
          }
          const contentType = resp.headers.get('content-type')
          if (!contentType.includes('text/html')) {
               console.log(`Only text/html content type is allowed. Received: ${contentType}`)
               return pages
          }
          htmlBody = await resp.text()
     } catch (err) {
          console.log(err.message)
     }

     const nextURLs = getURLsFromHTML(htmlBody, baseURL)
     for (const nextURL of nextURLs) {
          pages = await crawlPage(baseURL, nextURL, pages)
     }

     return pages
}

module.exports = {
     normalizeURL,
     getURLsFromHTML,
     crawlPage
}
