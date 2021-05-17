## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Docker
```bash
docker build -t essence-api-builder-service:dev .
docker run --name some-essence-api-builder-service -p 3000:3000 -d essence-api-builder-service:dev 
``` 

## License

essence-api-builder Service is [MIT licensed](LICENSE).
