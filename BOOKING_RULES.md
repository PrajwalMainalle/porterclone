# Booking Rules, Assumptions & Technical Decisions

## Status Transitions

``` text
PENDING → APPROVED → ASSIGNED → COMPLETED
PENDING → REJECTED
PENDING → CANCELLED
APPROVED → CANCELLED
ASSIGNED → CANCELLED
```

Completed and rejected bookings are final.

## Authentication

JWT authenticates protected requests. Authentication middleware verifies
the token and attaches the user to `req.user`.

## Authorization

Admin-only operations require the ADMIN role.

## Vehicle Allocation

A vehicle must exist, be active, have sufficient capacity, and have no
overlapping booking.

## Overlap

Two bookings overlap when:

``` text
existing.startTime < requested.endTime
AND
existing.endTime > requested.startTime
```

A booking ending exactly when another starts does not overlap.

## Database Decision

The assignment specifies a relational database. The current project uses
MongoDB/Mongoose. This should be disclosed during the final discussion.

## Assumptions

-   Employees request vehicles for official work.
-   Admin approval is required before assignment.
-   Only active vehicles can be assigned.
-   A vehicle may be reused after its previous booking ends.
-   Completed bookings cannot be cancelled.
-   Employees cannot access another employee's booking.
