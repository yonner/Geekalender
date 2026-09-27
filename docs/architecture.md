# Architecture

## Frontend
NexJs, React application responsible for displaying the current existing events which can then be filtered by the different categories "Actor/creator birthdays", "TV premieres", "Movie releases" (), "Game releases" , "Books & Comics", "Character birthdays", "Fandom events" and "All"

The page is rendered using xml which gets compiled into javascript functions. The pages are rendered on the server and then sends the finished HTML to the browser.
...

## Backend
Node/Express server responsible for serving the data to the front end currently there are two routes :-
    health - Used to see ik we get a 200 ok response.

             GET /health

    events - GET /api/events?category - to filter events by category
             GET /api/events/:id - fetches the event by a specific id

Currently the data is served vai an "InMemoryEventRepository" which will eventually get replaced by a postgres database.

## Shared Packages

This is the boundary between web and the backend, it constructs the request and returns the response to or category endpoint.