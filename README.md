# 🎬 TinyMoviez Dashboard

> A high-performance, state-driven movie & TV show dashboard built entirely with Vanilla JavaScript and Custom MVC Architecture.

![Movie App Banner](https://i.imgur.com/FFZoDKx.png) ## ✨ Overview

TinyMoviez is a capstone project designed to demonstrate advanced JavaScript concepts without relying on modern frameworks like React. By building a custom Model-View-Controller (MVC) architecture from scratch, this application showcases deep foundational knowledge of state management, the Publisher-Subscriber pattern, asynchronous API handling, and scalable SCSS styling.

## 🚀 Live Demo

Explore the live application here: **[TinyMoviez on Vercel](https://tiny-moviez-five.vercel.app)**

## 🎯 Key Features

- **Custom State Management:** Centralized state object that drives the UI, mimicking the core philosophy of React/Redux.
- **Advanced Data Fetching:** Utilizes `Promise.all` for parallel fetching of multiple TMDb endpoints, drastically reducing load times.
- **Media Discovery:** Browse trending movies, TV shows, and Anime with client-side pagination.
- **Search Functionality:** Real-time multi-search for finding specific titles.
- **Data Persistence:** "Bookmarks" and "Recently Viewed" history are automatically saved and hydrated using `LocalStorage`.
- **Responsive UI:** Fluid CSS Grid layout combined with BEM methodology in SCSS for a flawless experience across Desktop, Tablet, and Mobile.

## 🛠 Tech Stack

| Category        | Technologies                                       |
|-----------------|----------------------------------------------------|
| **Core** | Vanilla JavaScript (ES6+), HTML5                   |
| **Styling** | SCSS / SASS (BEM Naming Convention)                |
| **Architecture**| Custom MVC, Publisher-Subscriber Pattern           |
| **API** | [TMDb (The Movie Database)](https://www.themoviedb.org/) |
| **Bundler** | Parcel                                             |
| **Deployment** | Vercel                                             |

## 🏗️ Architecture Highlight (MVC)

This app avoids messy DOM manipulation by strictly separating concerns:
* **Model:** Handles all TMDb API calls, data normalization, and `LocalStorage` persistence. 
* **View:** Dedicated classes for each UI component. Views only listen for user events and render HTML strings.
* **Controller:** The brain of the app. It bridges the Model and View using the Publisher-Subscriber pattern, ensuring the UI and Data layers never directly interact.

## 📸 App Preview

<div align="center">
  <img src="https://i.imgur.com/muhJfLj.png" width="45%" alt="Mobile View"> 
  <img src="https://i.imgur.com/FFZoDKx.png" width="45%" alt="Desktop View">
</div>

## 💻 Installation & Local Setup

1. Clone the repository:
```bash
git clone [https://github.com/molamikedevs/tiny-moviez.git](https://github.com/molamikedevs/tiny-moviez.git)
cd tiny-moviez
