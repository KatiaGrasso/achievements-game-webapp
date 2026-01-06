[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/hUwC007-)

# Exam #N:4 "Obiettivi"

## Student: s319878 GRASSO KATIA

  

## React Client Application Routes

  

1.  **`/login`**

- The route for the login page. Displays the login form if the user is not authenticated.

  

2.  **`/` (Home)**

- The main route, which changes based on the authentication status:

-    If the user is logged in, it shows the profile page (`<Profile />`).

-   If the user is not logged in, it shows the objective list (`<ObjectiveList />`).

  

3.  **`/404`**

- A route for the "Page Not Found" error, displayed for undefined routes.

  

## API Server

  

### Game Management

#### Create a new game

  

HTTP method: `POST` URL: `/api/games`

  

- Description: Creates a new game with the specified details.

- Request body: description of the object to add

  

``` JSON

{

"user_id":1,

"difficulty": 2,

"game_status": "in_progress",

"attempts": 0,

}

```

- Response: `200 OK` (success)

- Response body: the entire representation of the newly-added game

- Error responses:`503 Service Unavailable` (database error), `422 Unprocessable Entity` (invalid input),

----------

#### Retrieve all games

HTTP method: `GET` URL: `/api/games`

  

- Description: Retrieves the list of all games stored in the database.

  

- Request body: None

  

- Response: `200 OK` (success)

  

- Response body: An array of objects, each representing a game:

  

``` JSON

[

{

"id": 1,

"user_id": 2,

"difficulty": 2,

"attempts": 0,

"secret_number": 4,

"game_status": "in_progress"

},

{

"id": 2,

"user_id": 3,

"difficulty": 3,

"attempts": 1,

"secret_number": 12,

"game_status": "lost"

}

]

```

- Error responses: `503 Service Unavailable` (database error)

----------

#### Update a game

HTTP method: `PUT` URL: `/api/games/:id`

  

- Description: Updates the details of a specific game, except the id

  

- Request body: Description of the object to update:

  

``` JSON

{

"user_id": 1,

"difficulty": 3,

"attempts": 1,

"secret_number" : 900,

"game_status": "won"

}

```

  

- Response: `200 OK `(success)

  

- Response body: The updated representation of the game

  

- Error responses:

`422 Unprocessable Entity `(validation errors in the request body),

`503 Service Unavailable` (database error)

  

----------

### Objectives Management

#### Retrieve all objectives

  

HTTP method: `GET`

URL: `/api/objectives`

  

- Description: Retrieves all objectives stored in the database.

- Request body: None

- Response: `200 OK` (success)

- Response body: An array of objects, each representing an objective:

``` JSON

[

{

"id": 1,

"name": "Win 5 games",

"description": "Achieve 5 game wins.",

"status": "in_progress"

},

{

"id": 2,

"name": "Reach level 10",

"description": "Reach level 10 in your profile.",

"status": "completed"

}

]

```

  

- Error responses:

- Error responses:  `500 Internal Server Error` (generic error)

  

----------

  

#### Retrieve an objective by ID

  

HTTP method: `GET`

URL: `/api/objectives/:id`

  

- Description: Retrieves a specific objective by its unique ID.

- Request body: None

- Response: `200 OK` (success)

- Response body: The representation of the requested objective:

``` JSON

{

"id": 1,

"name": "Win 5 games",

"description": "Achieve 5 game wins.",

"status": "in_progress"

}

```

- Error responses:

-  `404 Not Found` (objective not found)

-  `503 Service Unavailable` (database error)

  
  

### User Goals Management

  

#### Retrieve a specific user goal

  

HTTP method: `GET`

URL: `/api/users/:userId/goals/:goalId`

  

- Description: Retrieves a specific goal for a user by their user ID and goal ID.

- Request body: None

- Response: `200 OK` (success)

- Response body: An object representing the requested goal:

``` JSON

{

"user_id": 1,

"goal_id": 2,

"count": 3

}

```

- Error responses:

-  `400 invalid_request` 

 - `500 Internal Server Error` (generic error)

  

----------

  

#### Retrieve all goals for a user

  

HTTP method: `GET`

URL: `/api/users/:userId/goals`

  

- Description: Retrieves all goals for a specific user.

- Request body: None

- Response: `200 OK` (success)

- Response body: An array of objects, each representing a goal:

``` JSON

[

{

"user_id": 1,

"goal_id": 1,

"count": 5

},

{

"user_id": 1,

"goal_id": 2,

"count": 3

}

]

```

- Error responses:

-  `404 Not Found` (goal not found for the given user and ID)

 - `500 Internal Server Error` (generic error)

  

----------

  

#### Update a user goal

  

HTTP method: `PUT`

URL: `/api/users/:userId/goals/:goalId`

  

- Description: Updates the progress (count) for a specific user goal.

- Request body: Description of the update to apply:

  

``` JSON

{

"attempts": "2",

"game_status": "won ",

"user_id": " 1",

}

```

- Response: `200 OK` (success)

- Response body: Number of rows affected:

``` JSON

{

"rowsUpdated": 1

}

```

- Error responses:

 `500 Internal Server Error` (generic error)

  

----------

  

#### Add a new goal for a user

  

HTTP method: `POST`

URL: `/api/users/:userId/goals/:goalId`

  

- Description: Creates a new goal for a specific user.

- Request body**: Description of the new goal:

``` JSON

{

"goal_id": 2,

"count": 0

}

```

- Response: `200 OK` (success)

- Response body: ID of the newly created user goal:


- Error responses:

-  `400 invalid_request` 

 - `500 Internal Server Error` (generic error)

### User Authentication Management

  

#### Login

  

- HTTP method: `POST` URL: `/api/sessions`

- Description: authenticate the user who is trying to login

- Request body: credentials of the user who is trying to login

  

``` JSON

{

"username": "username",

"password": "password"

}

```

  

- Response: `200 OK` (success)

- Response body: authenticated user

  

``` JSON

{

"id": 1,

"username": "john.doe@polito.it",

"name": "John"

}

```

  

- Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)

  

#### Check if user is logged in

  

- HTTP method: `GET` URL: `/api/sessions/current`

- Description: check if current user is logged in and get her data

- Request body: _None_

- Response: `200 OK` (success)

  

- Response body: authenticated user

  

``` JSON

{

"id": 1,

"username": "john.doe@polito.it",

"name": "John"

}

```

  

- Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)

  

#### Logout

  

- HTTP method: `DELETE` URL: `/api/sessions/current`

- Description: logout current user

- Request body: _None_

- Response: `200 OK` (success)

  

- Response body: _None_

  

- Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)

  

## Database Tables

  

### Table `users`

  

- Stores user information.

- Columns:

-  **id**: Unique identifier for the user

-  **email**: User's unique email address

-  **name**: User's name

-  **salt**: Salt used for password hashing

-  **hash**: Hashed password of the user

----------

  

### Table `games`

  

- Stores information about games played by users.

- Columns:

-  **id**: Unique identifier for the game

-  **user_id**: Reference to the user who played the game

-  **difficulty**: Game difficulty level, ranging from 1 to 4

-  **attempts**: Number of attempts made

-  **secret_number**: The secret number to be guessed

-  **game_status**: Status of the game (`won`, `lost`, `in_progress`)

----------

### Table `goals`

  

- Stores information about the goals to be achieved in the game.

- Columns:

-  **id**: Unique identifier for the goal

-  **name**: Name of the goal

-  **description**: Description of the goal

-  **condition**: The condition required to complete the goal

-  **icon**: Icon representing the goal

-  **repeatable**: Indicates whether the goal can be completed multiple times

  

----------

### Table `user_goals`

  

- Links users to the goals they have achieved.

- Columns:

-  **id**: Unique identifier for the row

-  **user_id**: Reference to the user who achieved the goal

-  **goal_id**: Reference to the completed goal

-  **count**: Number of times the user has completed the goal

  

## Main React Components

  

### `LoginForm` (in `LoginForm.js`)

  

-  **Purpose**: Allows users to log in by entering their email and password.

-  **Main Functionality**:

- Captures and validates user input for login credentials.

- Displays error messages if login fails.

- Submits the login form and invokes a `onLogin` function passed as a prop.

  

----------

  

### `Header` (in `Header.js`)

  

-  **Purpose**: Displays the application header with login/logout options.

-  **Main Functionality**:

- Shows a "Logout" button if the user is logged in, which invokes `onLogout` when clicked.

- Shows a "Login" button if the user is not logged in, which navigates to the login page.

  

----------

  
  

### `ObjectiveList` (in `ObjectiveList.js`)

  

-  **Purpose**: Displays a list of game objectives for the user to view.

-  **Main Functionality**:

- Fetches objectives from an API and displays them as a list with icons, names, and descriptions.

- Converts binary image data (icons) to Base64 format for rendering.

  

----------

### `Game` (in `Game.js`)

  

-  **Purpose**: Provides the main gameplay functionality where users can guess a secret number.

-  **Main Functionality**:

- Allows the user to select a difficulty level to start the game.

- Tracks the game status (in_progress, won, lost) and user attempts.

- Handles game initialization, including fetching a secret number from the backend.

- Updates the database with the number of attempts used and game status upon completion.

- Provides immediate feedback for guesses ("Too high", "Too low", or success).

  

----------

  

### `Profile` (in `Profile.js`)

  

-  **Purpose**: Displays the user's profile, including achieved and upcoming goals, and allows the user to start a new game.

-  **Main Functionality**:

- Fetches and displays the user's achieved goals and their details.

- Shows upcoming goals that the user can work towards.

- Displays a popup if new goals are unlocked after a game ends.

- Displays objectives that have not yet been achieved.

- Embeds the `Game` component to start new games directly from the profile page.

- Automatically updates the goals displayed when a game ends, reflecting any new achievements.

- Includes a popup that notifies the user when new goals are unlocked

  

## Screenshot

<img width="1919" height="866" alt="Screenshot 2025-01-21 235618 (1)" src="https://github.com/user-attachments/assets/bd1150d2-16e1-4471-b64a-bad83cc5bfea" />
<img width="1919" height="863" alt="Screenshot 2025-01-21 235534" src="https://github.com/user-attachments/assets/7ae0a45b-98cd-455c-92e2-0792a36fcf35" />

## Users Credentials

  


 - metteo.neri@polito.it | Matteo | matteoneri98 

 - denislongo@polito.it | Denis | denislongo! 

- lusylewis@polito.it | Lusy | lusy00! 

