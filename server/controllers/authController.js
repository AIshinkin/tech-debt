const passwords = new Map([
  ['admin', process.env.ADMIN_PASSWORD],
  ['user', process.env.USER_PASSWORD],
])

export function showSession(req, res) {
  res.set('Cache-Control', 'no-store').json({ user: req.session.user ?? null })
}

export function login(req, res, next) {
  const { username, password } = req.body ?? {}
  const expectedPassword = passwords.get(username)

  if (!expectedPassword || password !== expectedPassword) {
    return res.status(401).json({ error: 'Неверный логин или пароль.' })
  }

  req.session.regenerate((error) => {
    if (error) return next(error)

    req.session.user = { username, role: username }
    req.session.save((error) => {
      if (error) return next(error)
      res.json(req.session.user)
    })
  })
}

export function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error)
    res.clearCookie('connect.sid')
    res.sendStatus(204)
  })
}

export function requireAdmin(req, res, next) {
  const user = req.session.user
  if (!user) {
    return res.status(401).json({ error: 'Войдите как администратор.' })
  }
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ есть только у администратора.' })
  }
  next()
}
