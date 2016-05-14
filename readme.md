# Go-React-Project
Go (Golang) + React Project development using Gulp + webpack-dev-server

### Pre Installation
- npm
- go (1.6+)
- glide (https://github.com/Masterminds/glide)

## Installation
1. Clone this repository.

  ```
    git clone https://github.com/mewben/go-react-project.git <project-name>
    cd <project-name>
  ```

2. Edit `glide.yaml`. Change the project name

3. Install the dependencies.

  ```
    npm install
    glide install
  ```

4. Run dev

  `npm start`

  The server runs at `http://localhost:8081` by default.

  The client at `http://localhost:8082`.

## Configuration
`./env.json` - You can set a different port and postgresql connection settings


## Build
  This compiles your .js files into `public/assets/js/`

  `npm run build`

### Uses
- Echo (https://github.com/labstack/echo)
- React
- Redux
- React Router
- Webpack
- Gulp
- Glide
