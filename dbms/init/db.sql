--liquibase formatted sql
--changeset artemov_i:init_role_essence_api_builder dbms:postgresql splitStatements:false stripComments:false
CREATE ROLE ${user.update} WITH
  LOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;

ALTER ROLE ${user.update} SET search_path TO public, ${user.table}, pg_catalog;
ALTER USER ${user.update} WITH PASSWORD '${user.update}';
--changeset artemov_i:init_db_essence_api_builder dbms:postgresql runInTransaction:false splitStatements:false stripComments:false
CREATE DATABASE ${name.db}
    WITH 
    OWNER = ${user.update}
    ENCODING = 'UTF8'
    LC_COLLATE = 'ru_RU.UTF-8'
    LC_CTYPE = 'ru_RU.UTF-8'
	  TEMPLATE = template0
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

