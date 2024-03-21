export const createLinks = {
  schema: {
    description: 'Create short link',
    tags: ['Short Links'],
    summary: 'Create new short link',
    body: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'Code to increment in shortLink' },
        original_url: {
          type: 'string',
          description: 'URL to redirect',
        },
      },
    },
    response: {
      201: {
        description: 'Successful response',
        type: 'object',
        properties: {
          shortLinkId: {
            type: 'number',
            value: 1,
            description: 'Short link id.',
          },
          message: { type: 'string', value: 'ShortLink created successfully' },
        },
      },
      400: {
        description: 'Wrong body',
        type: 'object',
        properties: {
          message: { type: 'string', value: 'Code already exists.' },
        },
      },
      500: {
        description: 'Server error',
        type: 'object',
        properties: {
          message: { type: 'string', value: 'Internal error.' },
        },
      },
    },
  },
}

export const listLinks = {
  schema: {
    description: 'Fetch list shortlink',
    tags: ['Short Links'],
    summary: 'List shortlinks on sistem',
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          listShortLinks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Short link id',
                },
                code: {
                  type: 'string',
                  description: 'Code to increment in shortLink',
                },
                original_url: {
                  type: 'string',
                  description: 'URL to redirect',
                },
                created_at: {
                  type: 'string',
                  description: 'Date to create code on database',
                },
              },
            },
          },
          message: { type: 'string', value: 'ShortLink found with success' },
        },
      },
      400: {
        description: 'Error database',
        type: 'object',
        properties: {
          message: {
            type: 'string',
            value: 'Error in find shortlinks on database.',
          },
        },
      },
      500: {
        description: 'Server error',
        type: 'object',
        properties: {
          message: { type: 'string', value: 'Internal error.' },
        },
      },
    },
  },
}

export const metricsLinks = {
  schema: {
    description: 'Find metrics shortlink most accessed',
    tags: ['Short Links'],
    summary: 'Find shortlink metrics',
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          listShortLinks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                shortLinkId: {
                  type: 'number',
                  description: 'Short link id',
                },
                score: {
                  type: 'number',
                  description: 'Count of how many times the link was searched',
                },
              },
            },
          },
          message: { type: 'string', value: 'Metrics success found' },
        },
      },
    },
  },
}
