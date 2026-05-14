import config from '../../data/SiteConfig'

const joinUrl = (...parts) =>
  parts
    .filter(Boolean)
    .map((part, index) =>
      index === 0 ? part.replace(/\/+$/g, '') : part.replace(/^\/+|\/+$/g, '')
    )
    .join('/')

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
})

const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
})

const formatDate = date => dateFormatter.format(new Date(date))

const formatPostFilenameDate = date => {
  const parsedDate = new Date(date)
  const year = parsedDate.getUTCFullYear()
  const month = `${parsedDate.getUTCMonth() + 1}`.padStart(2, '0')
  const day = `${parsedDate.getUTCDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

const formatRelativeDate = date => {
  const elapsed = new Date(date).getTime() - Date.now()
  const minutes = Math.round(elapsed / (1000 * 60))

  if (Math.abs(minutes) < 60) {
    return relativeTimeFormatter.format(minutes, 'minute')
  }

  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) {
    return relativeTimeFormatter.format(hours, 'hour')
  }

  const days = Math.round(hours / 24)
  if (Math.abs(days) < 7) {
    return relativeTimeFormatter.format(days, 'day')
  }

  const weeks = Math.round(days / 7)
  if (Math.abs(weeks) < 5) {
    return relativeTimeFormatter.format(weeks, 'week')
  }

  const months = Math.round(days / 30)
  if (Math.abs(months) < 12) {
    return relativeTimeFormatter.format(months, 'month')
  }

  const years = Math.round(days / 365)
  return relativeTimeFormatter.format(years, 'year')
}

const isNewPost = date => {
  const thresholdDate = new Date()
  thresholdDate.setMonth(thresholdDate.getMonth() - 1)

  return new Date(date) > thresholdDate
}

const editOnGithub = post => {
  const date = formatPostFilenameDate(post.date)
  return joinUrl(config.repo, '/blob/master/content/posts', `${date}-${post.slug}.md`)
}

export { editOnGithub, formatDate, formatRelativeDate, isNewPost }
