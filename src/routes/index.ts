import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { sql } from '../lib/postgres'
import postgres from 'postgres'
import { redis } from '../lib/redis'

export const routes = async (app: FastifyInstance) => {
  app.get('/:code', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { code } = z
        .object({
          code: z.string().min(3),
        })
        .parse(req.params)

      const result = await sql`
          SELECT id, original_url
          FROM short_links
          WHERE short_links.code = ${code}
        `

      if (result.length === 0)
        return res.status(400).send({ message: 'Link not found!' })

      await redis.zIncrBy('metrics', 1, String(result[0].id))

      return res.redirect(301, result[0].original_url)
    } catch (error) {
      if (error instanceof postgres.PostgresError) {
        if (error.code === '23505')
          return res.status(400).send({ message: 'Code already exists.' })
      }

      console.error(error)
      return res.status(500).send({ message: 'Internal error.' })
    }
  })

  app.post('/api/links', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { code, url } = z
        .object({
          code: z.string().min(3),
          url: z.string().url(),
        })
        .parse(req.body)
      const result = await sql`
          INSERT INTO short_links (code, original_url)
          VALUES (${code}, ${url})
          RETURNING id
        `

      return res.status(201).send({
        shortLinkId: result[0].id,
        message: 'ShortLink created with success',
      })
    } catch (error) {
      if (error instanceof postgres.PostgresError) {
        if (error.code === '23505')
          return res.status(400).send({ message: 'Code already exists.' })
      }

      console.error(error)
      return res.status(500).send({ message: 'Internal error.' })
    }
  })

  app.get('/api/links', async (_, res: FastifyReply) => {
    try {
      const result = await sql`
      SELECT * FROM short_links
      ORDER BY created_at DESC
    `
      return res.status(200).send({
        listShortLinks: result,
        message: 'ShortLink found with success',
      })
    } catch (error) {
      if (error instanceof postgres.PostgresError) {
        if (error.code === '23505')
          return res.status(400).send({ message: 'Code already exists.' })
      }

      console.error(error)
      return res.status(500).send({ message: 'Internal error.' })
    }
  })
  app.get('/api/metrics', async (_, res: FastifyReply) => {
    const result = await redis.zRangeByScoreWithScores('metrics', 0, 50)

    const metrics = result
      .sort((a, b) => b.score - a.score)
      .map((item) => ({
        shortLinkId: Number(item.value),
        score: item.score,
      }))

    return res
      .status(200)
      .send({ result: metrics, message: 'Metrics success found' })
  })
}
