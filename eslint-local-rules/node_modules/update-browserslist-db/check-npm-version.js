let { execSync } = require('child_process')
let { existsSync } = require('fs')
let pico = require('picocolors')

if (!existsSync('deno.lock')) {
  try {
    let output = execSync('npm -v').toString().trim()
    let version = parseInt(output.replace(/^[^\d]*/, ''))
    if (version <= 6) {
      process.stderr.write(
        pico.red(
          'Update npm or call ' +
            pico.yellow('npx browserslist@latest --update-db') +
            '\n'
        )
      )
      process.exit(1)
    }
  } catch {}
}
