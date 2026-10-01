# ER Diagram --- Vehicle Booking System

The assignment requests a relational database. The current
implementation uses MongoDB/Mongoose, so this diagram represents the
logical relationships.

``` mermaid
erDiagram
    USERS ||--o{ BOOKINGS : creates
    VEHICLES ||--o{ BOOKINGS : assigned_to

    USERS {
        ObjectId _id PK
        string name
        string email
        string phone
        string password
        string role
    }

    VEHICLES {
        ObjectId _id PK
        string vehicleNumber
        string vehicleType
        string model
        number capacity
        boolean isActive
    }

    BOOKINGS {
        ObjectId _id PK
        ObjectId user FK
        ObjectId vehicle FK
        string pickupLocation
        string dropLocation
        date bookingDate
        string startTime
        string endTime
        number requiredCapacity
        string purpose
        string status
        string rejectionReason
        string cancellationReason
        date createdAt
        date updatedAt
    }
```

## Relationships

`USERS 1 → N BOOKINGS`: one employee can create many bookings.

`VEHICLES 1 → N BOOKINGS`: one vehicle can be reused across different
non-overlapping bookings.

## Important Constraints

-   User email should be unique.
-   Vehicle number should be unique.
-   Booking must reference a valid user.
-   Vehicle must be active before assignment.
-   Vehicle capacity must be sufficient.
-   Overlapping vehicle assignments are rejected.
