<p align="center">
  <img width="90%" src="https://res.cloudinary.com/dsry3cnco/image/upload/v1642171587/trivia_tree_logo_background_i46u3l.png" alt="Trivia Tree Logo"/>
</p>

### Deployed Heroku Link: https://triviatree.herokuapp.com/
### SRS Document Link: [Software Requirements Specification](https://github.com/tamzid-chowdhury/Trivia-Tree/blob/main/SRS%20Trivia%20Tree.pdf)

## Trivia Tree
Trivia Tree is a quizzing website that allows users to test their knowledge on an endless variety of different 
subjects. Users can take quizzes from other community members, or create their own to contribute 
to the growing collection of trivia for all types of topics. Additionally, users can 
create platforms which are customizable pages used to present quizzes relating to a specific topic.

Trivia Tree differs from other quizzing sites by providing user leaderboards, a reward system for good performance, 
platform customization, and allowing users to see their relative performance compared to  other quiztakers. It also 
offers a simple to use, modernized user interface. Additionally, a recommendation system has been implemented to give
users quiz recommendations based on previous quizzes taken. 

## Features

### [Account Creation and Login]
Users will be able to sign up using their Google account through SSO. Creating an account will allow users to keep track of 
their results on past quizzes, create quizzes and platforms, receive currency and purchase rewards, and be included in leaderboards. 
Upon initial sign up, users will be asked to choose a display name, upload a profile picture, and choose categories for quiz reccomendations.

![Imgur Image](https://i.imgur.com/bXbxJXn.png)

### [User Account Page]
Users will have an account page where they will be able to choose quizzes and platforms that they want featured or “pinned”. 
They will be able to make small cosmetic adjustments to this page and it will mainly serve as a homepage for anyone interested in that user. 

![Imgur Image](https://i.imgur.com/bHwKKoD.png)

### [Create Platforms]
Users will be able to create/edit/delete platforms where they can present a topic and quizzes related to that topic. Platforms will 
feature a title, banner, icon, quizzes, etc. Platforms will also host forums which are used as hubs to send messages which can be liked
and include images

![Imgur Image](https://i.imgur.com/urraY1a.png)

### [Create Quizzes] 
Users can create quizzes using a quiz-generating tool provided by the application; users can modify their quizzes with a timer, different 
questions types, etc. Users will also be able to edit or delete their own quizzes; admins will have the ability to delete any quiz they feel 
breaks user guidelines.

![Imgur Image](https://i.imgur.com/smvU4hV.png)

### [Take Quizzes]
Users will be able to take quizzes created by other users. Quizzes have two modes, standard and instant, where the latter gives you the answer as soon
as you select an answer choice. Quizzes are timed and questions can switched around between using the navbar on the left. 

![Imgur Image](https://i.imgur.com/7hF82zh.png)

### [Leaderboards/Ratings/Recommendations]
Users will be placed onto leaderboards based on their performance on individual quizzes and specific platforms. Users can view the leaderboards
to see where they rank compared to other quiz takers. Users will be able to rate and review the quizzes they take and provide feedback which will be
used to figure out which quizzes will appear on the home page (most popular quizzes, best rated, etc.). After finishing a quiz, users will be recommended 
quizzes based on user data as well as the quiz that they just finished.

![Imgur Image](https://i.imgur.com/N3RtLkt.png)

### [Reward System]
Users with accounts will be able to earn rewards based on their performance on quizzes and how well quizzes they create are received. 
Users will earn currency after every quiz, earning more for better performance. Currency can be used to purchase animated backgrounds, icon effects, and
banners from the shop that can be used to customize their platforms. Users whose quizzes consistently receive high praises can become verified. 

![Imgur Image](https://i.imgur.com/Kh0EKuv.png)

### [Quiz Comments and Platform Forums]
Users will be able to comment on quizzes and reply to comments. Addtionally platforms will host forums where users can post messages which can include 
images. Posts can be liked and replied to. Forums are only viewable by followers of the platform. 

![Imgur Image](https://i.imgur.com/VvkfwLG.png)

### [Light Mode/Dark Mode]
Users will be able to switch between light mode and dark mode upon account creation and through the settings page. The navbar also includes a mode toggler
which will temporarily switch between light mode and dark mode per session

![Imgur Image](https://i.imgur.com/qcPdKQT.png)

## Technology Stack
	[React] - front-end library to create our user interface using functional components and hooks to 
	manipulate state information 
  
	[React-Router] - used to develop single page web applications by allowing switching between
	routes specified by the url. Users can redirect to different react components while saving state
	information
  
	[Chakra UI]  - front-end styling library to create simple, modular, and accessible components 
	using React 
  
  	[Node.JS] - Backend runtime environment for running a web server
    
	[Express] - Web application framework for Node that handles routing and http requests
  
	[Apollo] - Used for making API calls to the backend
  
	[GraphQL] - Data query language and manipulation language where all desired data can be found 
	with one query
  
	[Mongoose] - object data modeling library for MongoDB that is used to model your data using
	schemas 
  
	[MongoDB Atlas] - cloud-based NoSQL database that stores data in documents that employ a format
	similar to JSON
  
	[Passport] - a middleware for Node that takes care of authentication requests from an OAuth 
	provider such as Google or facebook
  
  	[Cloudinary] - cloud based API used to store images into the backend as links stored in MongoDB




