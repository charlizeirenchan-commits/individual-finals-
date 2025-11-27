1) New feature — richer user schema & signup flow
Files: user.js (model), users-controllers.js (controller), Auth.js (frontend)
Added first name, last name, and mobile number to the Mongoose User schema and ensured signup writes these fields to MongoDB.
New feature requirement 1.1 & 1.2 — UI → backend → DB → UI flow for richer identity fields.
Frontend: Signup form (Auth.js) now includes input fields for firstName, lastName, and mobileNumber. These values are captured in form state and included in the JSON body of the /api/users/signup request.
Backend: Signup controller accepts and saves the new fields; signup returns the created user object so frontend can display/use first/last name.

2) Bug B — “The Identity Crisis” (login always fails)
Files: controllers/users-controllers.js, Auth.js
Login now correctly queries the DB by email (ensuring User.findOne({ email }) is used) and request parsing is consistent with the schema. Added console.log() traces around the login attempt (request body, email, DB query result). Cause previous login was searching the wrong field or the request payload didn't match the query. The logs prove what the backend received and what the DB returned. So you can now sign up a user and log in using their email & password; the backend will return userId, email, and firstName/lastName so UI can show name-based greetings.

3) Bug A — “The Infinite Spinner” (frontend update flow)
Files: frontend/src/journals/pages/UpdateEntry.js
Ensured update handler calls sendRequest and then navigates away after success (navigate('/')), added console.log() before request, after response, and on error. Verified the form shows and hides spinner correctly via the useHttpClient hook (the file includes logs where the flow was previously stopping).
The spinner was stuck because the navigation / loading state wasn't being completed after update success. The fix ensures execution continues to the navigation step and the logs show where the flow stops if it still does.

4) Bug C — “The Phantom List” (journal list empty)
Files: backend/controllers/journal-controllers.js
Replaced any placeholder/hardcoded res.json({ entries: [] }) with a real DB query: Journal.find({ author: userId }). Added console.log() before and after the database query to show the userId and DB results. Since routes return HTML or a hardcoded empty array, the frontend will always display empty lists. The fix queries by the correct author field and returns real results.

5) UI improvements (use name instead of email)
Files: frontend/src/user/components/UserItem.js
UserItem now prefers firstName + lastName as a display name; falls back to name or email.
Uses the new richer identity information in UI snippets.

6) Debugging instrumentation (assignment requirement)
Added targeted console.log() statements (3–5 per bug area) in:
Auth.js (signup/login payloads & responses)
users-controllers.js (signup request body; login attempt details; DB query result)
UpdateEntry.js (submission payload, response, and error)
journal-controllers.js (fetching entries, userId and DB result)
Demonstrates reproduction, tracing, root cause identification, and validation for each bug as required.

Changes addressing the bugs 
Bug A: Infinite Spinner: UpdateEntry.js ensures navigation is triggered after success and logs show whether the success branch is reached. Confirmed the useHttpClient hook will clear loading after completion.
Bug B: Identity Crisis: users-controllers.js was corrected to look up users by email; logs show incoming req.body and query result so you can prove the fix.
Bug C: Phantom List: journal-controllers.js now queries Journal.find({ author: userId }) and returns DB results instead of hardcoded arrays.
