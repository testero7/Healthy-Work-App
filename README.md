# Healthy-Work-App
Healthy-Work-App, pomodoro type application created with Express.js and React.js.

Functionalities:
-creating account
-OAuth with google
-json web token functionality
-refresh token functionality
-loging into account
-displaying user data
-changing user data
-profile picture update with firebase
-creating new configuration for pomodoro
-updating/deleting data for configuration
-starting pomodoro
-pomodoro, break time and time to break counters
-displaying active pomodoros,
-notifications enable/disable
-updating notifications configuration
-notifications display with toastify
-dark/white mode(in development)
-loading animation
-statistics for user with react-heatmap

AUTH:
"api/auth/signin" POST
"api/auth/signup" POST
"api/auth/google" POST
"api/auth/signout" GET
"api/auth/refresh-token" POST

CONFIGURATION:
"/api/configuration/testConfiguration" GET
"/api/configuration/getConfiguration/:id" GET
"/api/configuration/addConfiguration/:id" POST
"/api/configuration/deleteConfiguration/:id/:configurationId" DELETE
"/api/configuration/updateConfiguration/:id/:configurationId" POST
"/api/configuration/getConfiguration/:id/:configurationId" GET

POMODORO:
"/api/pomodoro/testPomodoro" GET
"/api/pomodoro/getPomodoro/:id" GET
"/api/pomodoro/addPomodoro/:id/:confId" POST
"/api/pomodoro/deletePomodoro/:id/:pomodoroId" DELETE
"/api/pomodoro/updatePomodoro/:id/:pomodoroId" POST
"/api/pomodoro/getPomodoro/:id/:pomodoroId" GET

NOTIFICATION:
"/api/notification/testNotification" GET
"/api/notification/getNotification/:id" GET
"/api/notification/addNotification/:id" POST
"/api/notification/deleteNotification/:id/:notificationId" DELETE
"/api/notification/updateNotification/:id/:notificationId" GET

USER:
"/api/user/test" GET
"/api/user/update/:id" POST
"/api/user/delete/:id" DELETE
