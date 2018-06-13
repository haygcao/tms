
## How to use
---
- vue-cli

see https://cli.vuejs.org/guide/cli-service.html#using-the-binary

## Development
---
- start a http server local
```
npm run serve
# OR
yarn serve

```
## Build
---
```
npm run build

```
> 测试环境
```
npm run build:stage
```
## Deployment

----
- Previewing Locally
```
npm install -g serve
# -s flag means serve it in Single-Page Application mode
# which deals with the routing problem below
serve -s dist
```

-----
- Docker
> build docker image
```
docker build -t reallyedu/tms-web .

```
