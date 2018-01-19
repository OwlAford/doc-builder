const opn = require('opn')
const gulp = require('gulp')
const chalk = require('chalk')
const connect = require('gulp-connect')
const gitbook = require('gulp-gitbook')
const sequence = require('gulp-sequence')

gulp.task('server', () => {
  const port = 4001
  const uri = `http://localhost:${port}`
  connect.server({
    livereload: true,
    root: 'doc/_book',
    port
  })
  console.log(chalk.green(`Server is running at ${uri}`))  
  opn(`${uri}`)
})

gulp.task('build', () => {
  gitbook('./doc/', () => {
    gulp.src('./doc/_book/').pipe(connect.reload())
    console.log(chalk.green('Build complete.\n'))
  })
})

gulp.task('watch', () =>
  gulp.watch('./doc/*.md', ['build'])
)

gulp.task('dev', sequence('build', 'watch', 'server'))
