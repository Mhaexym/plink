# PLINK
Password linking, or 'plinking' is a project I built that allows a user to safely share passwords with others through unique links.

## Initializing the project
If you already have a Laravel dev environment setup, please skip this step. 
1. Make sure you have php and composer installed beforehand, and have made sure that you can run both in CLI.
2. Pull the project from github
3. Check in the `.env` file if `DB_CONNECTION` is set to `sqlite`, I altered it for you and deleted all other DB properties, but if for some reason this is not the case, please rename `.env.example` to `.env` and replace the original file.
4. Open a terminal and navigate to the root folder of the project, `plink`.
5. Run `composer install` in terminal.
6. Then `php artisan migrate`
7. Finally, open two terminals and run `php artisan serve` in the first one to start up the backend, and run `npm run dev` in the second one to startup the frontend dev.
8. Navigate to http://127.0.0.1:8000/ to see the project running.
   
## Using the plinking service
The way the program can be used is also explained on the pages themselves and is self-explanatory. On the index-page, title "Creating a plink", a user can type a password in the top input field, and then enter a maximum number of hours and uses of the link. After they are done, they can click "create plink", which will then cause the program to generate a unique link that the user can click to copy and share with others. Someone with the link can then use it to retrieve the password (or, in fact, any sub-50 character message) on page with title "Retrieve your password", until the maximum number of uses is reached or the inputted number of hours after creation have passed. If that is the case, a page title "Expired Plink!" is shown, where a user is explained that the link has expired, and it provides them with a link to lead them back to the index-page.

## Program flow
The frontend is written in Reactjs, with Inertia coupling Laravel to the frontend. There is only one main frontend page named `Plinkpage.jsx`, which you can find in `/resources/js/Plinkpage.jsx`. This component changes based on what data it recieves back from requests, which can be a `uuid` for a link, a `requestedPassword` or a `passwordExpired` boolean. 

### Initial page
The standard route `/` is routed to `index()` in the `/app/Http/Controllers/PlinkController`, and it displays page with no data given back. Note that all the code is commented in the files mentioned as well. The `submit()` in  `/resources/js/Plinkpage.jsx` for the form on the index-page makes a post request to the `store()` function in `/app/Http/Controllers/PlinkController`. We recieve the `sharedPassword`, `hoursLeft` and `uses` from the frontend, generate a `uuid`, create a database entry with these four variables, and send the `uuid` back to the frontend.
### After pressing 'Create Plink'
After pressing the button to create a plink, the frontend changes to no longer show the form, and instead show the link, which the user can click to copy and share with others.
### Using the plink
Routes like `http://127.0.0.1:8000/{uuid}` are routed to the show() function in `/app/Http/Controllers/PlinkController`. This retrieves the uuid from the url and uses it to lookup the plink associated with it. Then, it decrements the number of `uses` by one and checks if the link should be expired by the maximum uptime denoted by `hoursLeft`. If either of the maxima are reached, the plink is deleted and the "Expired Plink" page is shown to the user. Else, the password is shown to the user, and the user can click to copy it.

## Possible improvements
* Robust form handling & proper backend validation (now only password is validated, and rest is validated on frontend)
* Security in form of cryptography for password or other methods
* Use datetime format instead of integer to represent the maximum uptime for the link. This works, but datetime is more elegant. 
