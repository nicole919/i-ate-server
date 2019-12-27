# i.ate server

This is a server created with Node/Express to support the i.ate app.

# Getting Started

## Installing

Clone the repository and download dependencies.

```
$ git clone https://github.com/nicole919/i-ate-server.git
$ cd i-ate-server
$ npm install
```

## Launching

```
$ npm start
```

## Endpoints

`GET /api/meals` - returns meals

### Response

```
Status: 200 OK
 {
        "id": 35,
        "restaurant_name": "Cafe Nola",
        "food": "n/a",
        "drink": "cold brew",
        "date_went": "2019-12-01T07:00:00.000Z",
        "city": "tucson",
        "rating": "good",
        "comments": "dianas peppermint frap tasted amazing"
    }
```

### ---

`POST /api/meals` - create a new meal entry

```
| Input           | Type                                |
| --------------- | ----------------------------------- |
| restaurant_name | string (required)                   |
| food            | string (required)                   |
| drink           | string                              |
| date_went       | date format YYYY-MM-DDT0:00:00:000Z |
| city            | string                              |
| rating          | string                              |
| comments        | string                              |

```

### Example

```
{
"restaurant_name": "cat restaurant",
"food": "spicy tuna",
"drink": "milk",
"date_went": "2019-11-05T07:00:00.000Z",
"city": "tucson",
"rating": "very good",
"comments": "very fishy"
}
```

### Response

```
201 Created
```

### ---

`GET api/meals/meal_id` - returns a single meal by ID

### Example

```
GET api/meals/35
```

### Response

```
{
    "id": 35,
    "restaurant_name": "Cafe Nola",
    "food": "n/a",
    "drink": "cold brew",
    "date_went": "2019-12-01T07:00:00.000Z",
    "city": "tucson",
    "rating": "good",
    "comments": "dianas peppermint frap tasted amazing"
}
```

### ---

`DELETE api/meals/meal_id` - delete meal by ID

### Response

```
204 No Content
```

[i.ate live site](https://i-ate.now.sh/)

[i.ate client-side repo](https://github.com/nicole919/i-ate)
