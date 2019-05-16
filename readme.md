# Vanilla State

A Lightweight Vanilla Javascript State System

 - Pure Vanilla ES6+
 - Handles state in a simple eloquent way at an object level

A lot of projects over complicate state management. At the end of the day state management is really just the versioning and maintenance of an object. The beauty of Javascript is the fact that all objects are inherently pass by reference. Therefore, these objects can be passed to multiple areas of your application and their state can be handled via one easy to use state management service. Vanilla State is a class based system that can be implemented into any Vanilla, Angular, React, Vue etc service to handle the state of an object and be used as the entire state management system. The concept of Vanilla State doe s not follow the normal paradigm of state management, but rather simplifies it and makes it more practical. 
### Installation

```sh
$ npm i vanilla-state --save
```

### Initialization

```js
 const VanillaState = require('vanilla-state');
```

From here, you can take any object that you would like to manage and initialize a vanilla state manager. You can have multiple state managers on an individual object. Lets use an example of one object with two state managers to show you a detailed explanation of to use VanillaState.


First let's define an object we would like to maintain a state of.
```js
 const person = {
 name: 'Steven',
 age: 100,
 favoriteSport: 'Football',
 favoriteTeam: 'UCF'
 }
```

In this scenario we have one person object, but our app has two different areas where it is showing data from the person object. One area (personInfo) is showing the name and age, the other area (sportsArea) is showing the favorte sport and favorite team. For this reason let's make two abiding states (personInfoState, sportsAreaState).

Create our personInfo State, that watches the person object and the fields "name" and "age. If we do not pass any fields in the second parameter, it will watch the entire object. In this case we only want our personInfoState watching name and age.
```js
 const personInfoState = new VanillaState(person, ['name', 'age']);
```

Next let's create our sportsArea State, that watches person object and the fields "favoriteSport" and "favoriteTeam". If we do not pass any fields in the second parameter, it will watch the entire object. In this case we only want our personInfoState watching favoriteSport and favoriteTeam.
```js
 const sportsAreaState = new VanillaState(person, ['favoriteSport', 'favoriteTeam']);
```

From here we can pass person anywhere within our app, in our case to two different components a personInfo component that will manipulate the personInfo and a sportsArea components that will alter the sportsAreaState, but behind the scenes they are altering the same exact object. 

From here we now have some functions form the state that monitor our state. 

- stateObject.changes -> returns all changes that have occurred on the object 
- stateObject.items -> returns all of the items this state is watching
- stateObject.currentState -> returns current state of the object
- stateObject.lastSavedState -> returns last saved state of the object
- stateObject.versionHistory -> returns last an array of all saved states and the current state
- stateObject.revertField(field) -> reverts a field to last saved state
- stateObject.revertAll() -> reverts all fields to last saved state
- stateObject.saveField(field) -> saves a field to last saved state
- stateObject.saveAll() -> saves all fields to last saved state

So lets do some manipulation on our person object that would happen in both of our components 
```js
 // Person component manipulates name
 person.name = 'newName'

 // Sports Area component changes favorite sports team
 person.favoriteTeam = 'FSU'
```

If we call the changes getter on both of the state objects they will display info according 
```js
 personInfoState.changes;
 // Returns an array of changes
    [  
        {  
 "field":"name",
 "originalState":"Steven",
 "currentState":"newName"
        }
    ]

 
 sportsAreaState.changes;
 // Return an array of changes 
    [  
        {  
 "field":"favoriteTeam",
 "originalState":"UCF",
 "currentState":"FSU"
        }
    ]
```
Let's say the user selects 'clear changes' on the personInfo component, we can go ahead and revert the changes for that state. We can either use revertAll(), or we can call revertField(field) and pass the specific feild. In this case, we will call revertAll().

```js
 personInfoState.revertAll();
 personInfoState.changes;
 // Returns an empty array of changes, since we reverted the changes
    [  
    ]

 
 sportsAreaState.changes;
 // Return an array of changes 
    [  
        {  
 "field":"favoriteTeam",
 "originalState":"UCF",
 "currentState":"FSU"
        }
    ]

 // The person object now looks like the following

 person = {
 name: 'Steven',
 age: 100,
 favoriteSport: 'Football',
 favoriteTeam: 'FSU'
 }
```

Let's now say that on the sports area component, the user selects "save all". We can either use saveAll(), or we can call saveField(field) and pass the specific field. In this case, we will call saveAll().

```js
 sportsAreaState.saveAll();
 // You would also want to call your actual database save here as well, in future version this function will ahve a clalback for your database save function 

 personInfoState.changes;
 // Returns an empty array of changes, since we reverted the changes
    [  
    ]

 
 sportsAreaState.changes;
 // Returns an empty array of changes, since we saved the changes
    [  
    ]

 // The person object still looks like the following, but the sportsArea state is saved.

 person = {
 name: 'Steven',
 age: 100,
 favoriteSport: 'Football',
 favoriteTeam: 'FSU'

 // if we look at the version history of the sportsAreaState now, we will see the array of versions
 sporsAreaState.versionHistory

     [  
        {  
 name:"Steven",
 age:100,
 favoriteSport:"Football",
 favoriteTeam:"UCF"
        },
        {    
 name:"Steven",
 age:100,
 favoriteSport:"Football",
 favoriteTeam:"FSU"
        }
    ]
 }