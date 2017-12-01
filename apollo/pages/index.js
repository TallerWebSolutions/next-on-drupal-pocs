import React from 'react'

import QueueLink from 'apollo-link-queue'

const queueLink = new QueueLink()

// To start queueing requests
queueLink.close()

export default () => <div>{ console.log(queueLink) }Hello, apollo world!</div>
