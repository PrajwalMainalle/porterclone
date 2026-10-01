# Test Cases --- Vehicle Booking System

## Required Assignment Scenarios

  \#   Scenario                   Expected Result              Done
  ---- -------------------------- ---------------------------- -------
  1    Create valid booking       Booking created as PENDING   \[ \]
  2    Reject invalid booking     Backend rejects request      \[ \]
  3    Assign available vehicle   Booking becomes ASSIGNED     \[ \]
  4    Prevent overlap            Assignment rejected          \[ \]
  5    Cancel booking             Booking becomes CANCELLED    \[ \]
  6    Complete booking           Booking becomes COMPLETED    \[ \]

## Additional Tests

  Scenario                        Expected Result           Done
  ------------------------------- ------------------------- -------
  Missing required field          400 error                 \[ \]
  End time before start time      Rejected                  \[ \]
  Inactive vehicle                Assignment rejected       \[ \]
  Insufficient capacity           Assignment rejected       \[ \]
  Another user's booking          Access denied/not found   \[ \]
  Cancel completed booking        Rejected                  \[ \]
  Employee calls admin endpoint   403                       \[ \]
  Missing JWT                     401                       \[ \]
  Invalid JWT                     401                       \[ \]
  Reject pending booking          REJECTED                  \[ \]
  Assign before approval          Rejected                  \[ \]

## End-to-End Test

Employee: 1. Login. 2. Create a valid booking. 3. Confirm it is PENDING.
4. Open My Bookings. 5. Open Booking Details.

Admin: 1. Login. 2. Open Bookings. 3. Approve the booking. 4. Assign a
suitable vehicle. 5. Complete the booking. 6. Confirm COMPLETED status.

## Overlap Test

1.  Assign Vehicle A to booking 10:00--13:00.
2.  Try Vehicle A for 11:00--14:00.
3.  Confirm rejection.
4.  Try Vehicle A for 14:00--16:00.
5.  Confirm assignment is allowed.
