# Search Request Data

## Original Data Structure

```
{
  createdAt: { type: Number, default: Date.now, index: true },
  updatedAt: { type: Number, default: Date.now, index: true },
  cancelledAt: { type: Number, index: true },
  activeAt: { type: Number },
  sentAt: { type: Number },
  readyAt: { type: Number },
  dueAt: { type: Number, required: true },
  blacklistedResearchers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  terms: { type: String, required: true },
  description: { type: String },
  knowledge: { type: String },
  usage: { type: String },
  successIs: { type: String },
  notWanted: { type: String },
  misinterpreted: { type: String },
  comments: [{
    createdAt: { type: Number, default: Date.now },
    body: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  }],
  sourcing: [{
    dueAt: { type: Number },
    inactiveAt: { type: Number },
    sourceCompensation: { type: Number },
    sources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startedAt: { type: Number, default: Date.now },
    stoppedAt: { type: Number },
    notes: { type: String },
    review: {
      startedAt: { type: Number },
      stoppedAt: { type: Number },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      passed: { type: Boolean },
      answers: {
        fullyAnswered: { type: Boolean },
        allSourcesRelevant: { type: Boolean },
        sourceNotesPointToAnswer: { type: Boolean },
        summaryOk: { type: Boolean },
        didExplainCannotFind: { type: Boolean },
        didFollowPlan: { type: Boolean },
        didExplainApproaches: { type: Boolean },
        didExplainInsights: { type: Boolean },
        didSuggestChanges: { type: Boolean },
      },
    },
  }],
}

```

## Restructuring

This is how I would restructure this search request data into relational tables:

### Users Table

- id (auto-increment)
- createdAt (timestamp)
- first name (string)
- last name (string)
- ???

### UserToType

This table exists because a user could theoretically have multiple types.

- userId (auto-increment)
- type (enum: customer, reviewer, sourcer, etc)

### Comments Table

- id (auto-increment)
- createdAt (timestamp)
- userId (id from Users table)
- searchRequestId (id from SearchRequest table)
- comment (text)

### BlacklistedUserToSearchRequest Table

- searchRequestId (id from SearchRequests table)
- userId (id from Users table)

### Payments Table

- id (auto-increment)
- createdAt (timestamp)
- ???

### SearchRequests Table

- id (auto-increment)
- userId (id from Users table for user who submitted query)
- createdAt (timestamp)
- updatedAt (timestamp)
- cancelledAt (timestamp)
- activeAt (timestamp)
- sentAt (timestamp)
- readyAt (timestamp)
- dueAt (timestamp)
- paymentId (id from payments table)
- terms (string)
- description (string)
- knowledge (string)
- usage (string)
- successIs (string)
- notWanted (string)
- misinterpreted (string)

### Sourcings Table

- id (auto-increment)
- userId (id from Users table of source creator)
- reviewId (id from Reviews table) (I am choosing to put this ID here as opposed to creating a mapping table purely because it is a one-to-one relationship.  If there was any chance that one day, the business would want multiple reviews for one sourcing, I would go with a mapping table.)
- dueAt (timestampe)
- inactiveAt (timestamp)
- sourceCompensation (number)
- startedAt (timestamp)
- stoppedAt (timestamp)
- notes (string)

### Sources Table

- id (auto-increment)
- createdAt (timestamp)
- url (url)
- description (string)
- ???

### SourceToSourcing Table

- sourceId (id from Sources Table)
- sourcingId (id from Sourcing table)

### SourcingToSearchRequest Table

- searchRequestId (id from SearchRequest table)
- sourcingId (id from Sourcings Table)

### Review Table

- id (auto-increment)
- startedAt (timestamp)
- stoppedAt (timestamp)
- userId (id from Users table of reviewer)
- passed (boolean)
- fullyAnswered (Boolean)
- allSourcesRelevant (Boolean)
- sourceNotesPointToAnswer (Boolean)
- summaryOk (Boolean)
- didExplainCannotFind (Boolean)
- didFollowPlan (Boolean)
- didExplainApproaches (Boolean)
- didExplainInsights (Boolean)
- didSuggestChanges (Boolean)

