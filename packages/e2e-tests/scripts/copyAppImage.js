// Copy built AppImage to Quiet directory and set the version in .env file
const { execFileSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const desktop = path.join(__dirname, '..', '..', 'desktop')
const e2e = path.join(__dirname, '..')
const appVersion = JSON.parse(require('fs').readFileSync(path.join(desktop, 'package.json'), 'utf8')).version
const fileName = `Quiet-${appVersion}.AppImage`

execFileSync('rm', ['-rf', path.join(desktop, 'dist', 'squashfs-root')])

console.log(`Copying file ${fileName} for e2e tests`)
execFileSync('cp', [path.join(desktop, 'dist', fileName), path.join(e2e, 'Quiet', fileName)])

fs.writeFileSync(path.join(e2e, '.env'), `FILE_NAME=${fileName}`)
