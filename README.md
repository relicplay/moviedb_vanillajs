# moviedb_vanillajs
Single-page application fetching data from themoviedb API, using HTML5, CSS3, and vanilla JS.

## API-key

An api-key from TMDB is required in order to make requests. API-key is not included in this repo.
Please follow these steps to make requests:

>
> - Create a free account at https://www.themoviedb.org
> - Apply for an API-key, please see documentation for details: https://www.themoviedb.org/documentation/api
> - Find your API-key here: https://www.themoviedb.org/settings/api
> - Create a file in the root folder of this project, name it "apikey.json"
> - Add the following code into aforementioned file: { "apiKey": "?api_key=xxxxxxx" }
> - Replace xxxxxxx with your own API-key.
>

## Troubleshooting

>
> ### *SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON*
>
> There is no apikey.json file in the root-folder. Please follow the step under *API-key* and create one.
>

>
> ### SyntaxError: Unexpected end of JSON input
>
> The apikey.json file was found, but it's empty. Please follow the step under *API-key* and add the proper code.
>

>
> ### TypeError: NetworkError when attempting to fetch resource.
>
> You need to run index.html on a liveserver, for example via Visual Studio Code.
>

