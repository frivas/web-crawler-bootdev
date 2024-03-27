const { program } = require('commander');
const { crawlPage } = require('./crawl')
const { printReport } = require('./report')

async function main() {
     program
          .option('--first')

     program.parse();

     const options = program.opts();
     const limit = options.first ? 1 : undefined;
     if (program.args.length != 1) {
          console.log("Please, especify one URL")
          process.exit()
     }
     console.log(`The crawler is starting with the base URL: ${program.args[0]}`)
     const pages = await crawlPage(program.args[0], program.args[0], {})
     printReport(pages)
}

main()
