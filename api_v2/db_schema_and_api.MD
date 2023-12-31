 # Since we are using a document based NoSQL database, i have proposed a schema for the sake of consistency.

## The "users" collection:
- the documents in this collection should have the following structure:
```
{
    "_id": string -> autogenerated
	"user_id": string
    "user_name": string
    "profile_url": string
	"email": string,-> required
	"password": string, -> required
	"role": string [user/admin] -> defaults to user
	"isVerified": string
}
```

## The "Questions" collection:
- the documents in this collection should have the following structure:
```
{
    "test_id": string,
    "user_id": string,
    "title": string,
    "description": string,
    "allotted_time_mins": int,
    "quiz_start_time": int,  //(unix epoch timestamp in milliseconds as in javascript)
    "quiz_end_time": int,  //(unix epoch timestamp in milliseconds as in javascript)
    "questions": [array of question objects (see below)],
}
```

- A question object has the following structure:
```
{
    "id": string, -> required
    "question": string, -> required
    "options":{   		-> required
        "A": string,
        "B": string,
        "C": string,
        "D": string,
    },
    "answer": [an array os strings] -> required
}
```

## The "results" collection:
- the documents in this collection should have the following structure:
```
{
    "test_id" : string,
    "user_id": string,
    "user_name": string,
    "profile_url": string,
    "date_taken" : int,  //(unix epoch timestamp in milliseconds as in javascript),
    "total_questions" : int,
    "right_answers" : int,
}
```

# Below are the api endpoints

# BaseUrl: ```http://web-01.borntocode.tech/api/v2```

## register a user
- body of request must contain password, email. It may contain any other keys in the users schema
```/register POST ```

## login a user
- body of request must contain password, email. It may contain any other keys in the users schema
```/login POST ```

## verify token
- user follows this link to verify their email
```/verify/:token GET```

## logout
- logs out user. Nothing is done on backend, just destroy the jwt token from the frontend
```/logout GET```

## reset_password
- resets user password. body of request requires the users email
```/reset_password POST```

## create a quiz
- requires the body of question as outlined by the questions schema
```/create_quiz POST```

## update a quiz
- requires the test_id in the url
```/update_quiz/:id PUT```

## get all available quiz created by a user
- requires the user_id in the url
```/find_user_quiz/:user_id GET```

## return all quizzes in the database
```/find_all_quiz GET```

## get one quiz
- requires the test_id in the url
```/get_one-quiz/:test_id GET```

## delete a quiz
- requires test_id in the url
```/delete_quiz/:id DELETE```

## get all results of a user
- requires the user_id in url
```/get_user_results/:user_id GET```

## post a user result
- requires body of result as specified by the db schema
```/post_results POST```

## get all results for particular quiz
- requires the test id in the url
```/get_all_results_quiz/:test_id GET```

## get all results in db
```/get_all_results GET```




