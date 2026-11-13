import { getFeedback, saveFeedback } from '../models/feedbackModel.js'

export function receiveFeedback(req, res) {
  saveFeedback(req.body ?? {})
  res.sendStatus(204)
}

export function listFeedback(req, res) {
  res.set('Cache-Control', 'no-store').json(getFeedback())
}
