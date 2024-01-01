# Healthy-Work-App
Healthy-Work-App, pomodoro type application created with Express.js and React.js.

## Functionalities:
* creating account<br>
* OAuth with google<br>
* json web token functionality<br>
* refresh token functionality<br>
* loging into account<br>
* displaying user data<br>
* changing user data<br>
* profile picture update with firebase<br>
* creating new configuration for pomodoro<br>
* updating/deleting data for configuration<br>
* starting pomodoro<br>
* pomodoro, break time and time to break counters<br>
* displaying active pomodoros<br>
* notifications enable/disable<br>
* updating notifications configuration<br>
* notifications display with toastify<br>
* dark/white mode(in development)<br>
* loading animation<br>
* statistics for user with react-heatmap<br>

## AUTH:
>"api/auth/signin" POST<br>
>"api/auth/signup" POST<br>
>"api/auth/google" POST<br>
>"api/auth/signout" GET<br>
>"api/auth/refresh-token" POST<br>

## CONFIGURATION:
>"/api/configuration/testConfiguration" GET<br>
>"/api/configuration/getConfiguration/:id" GET<br>
>"/api/configuration/addConfiguration/:id" POST<br>
>"/api/configuration/deleteConfiguration/:id/:configurationId" DELETE<br>
>"/api/configuration/updateConfiguration/:id/:configurationId" POST<br>
>"/api/configuration/getConfiguration/:id/:configurationId" GET<br>
## POMODORO:
>"/api/pomodoro/testPomodoro" GET<br>
>"/api/pomodoro/getPomodoro/:id" GET<br>
>"/api/pomodoro/addPomodoro/:id/:confId" POST<br>
>"/api/pomodoro/deletePomodoro/:id/:pomodoroId" DELETE<br>
>"/api/pomodoro/updatePomodoro/:id/:pomodoroId" POST<br>
>"/api/pomodoro/getPomodoro/:id/:pomodoroId" GET<br>

## NOTIFICATION:
>"/api/notification/testNotification" GET<br>
>"/api/notification/getNotification/:id" GET<br>
>"/api/notification/addNotification/:id" POST<br>
>"/api/notification/deleteNotification/:id/:notificationId" DELETE<br>
>"/api/notification/updateNotification/:id/:notificationId" GET<br>

## USER:
>"/api/user/test" GET<br>
>"/api/user/update/:id" POST<br>
>"/api/user/delete/:id" DELETE<br>
