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
docker build -t example-service:dev .
docker run --name some-example-service -p 3000:3000 -d example-service:dev
``` 
## Add Audit
Need add table
```
CREATE TABLE t_log (
	ck_id uuid NOT NULL DEFAULT uuid_generate_v4(), -- ИД записи лога
	cv_session varchar(100) NULL, -- ИД сессии
	cc_json text NULL, -- JSON
	cv_method varchar(4000) NULL, -- Имя действия
	cv_id varchar(4000) NULL, -- ИД записи в таблице
	cv_action varchar(30) NULL, -- ИД действия
	cv_error text NULL, -- Код ошибки
	ck_user varchar(150) NOT NULL, -- ИД пользователя
	ct_change timestamptz NOT NULL, -- Дата последнего изменения
	ct_create timestamptz NOT NULL, -- Время создания
	CONSTRAINT cin_p_log PRIMARY KEY (ck_id)
);
COMMENT ON TABLE t_log IS 'Лог';

-- Column comments

COMMENT ON COLUMN t_log.ck_id IS 'ИД записи лога';
COMMENT ON COLUMN t_log.cv_session IS 'ИД сессии';
COMMENT ON COLUMN t_log.cc_json IS 'JSON';
COMMENT ON COLUMN t_log.cv_method IS 'Имя действия';
COMMENT ON COLUMN t_log.cv_id IS 'ИД записи в таблице';
COMMENT ON COLUMN t_log.cv_action IS 'ИД действия';
COMMENT ON COLUMN t_log.cv_error IS 'Код ошибки';
COMMENT ON COLUMN t_log.ck_user IS 'ИД пользователя';
COMMENT ON COLUMN t_log.ct_change IS 'Дата последнего изменения';
COMMENT ON COLUMN t_log.ct_create IS 'Время создания';
```
## License

example Service is [MIT licensed](LICENSE).
