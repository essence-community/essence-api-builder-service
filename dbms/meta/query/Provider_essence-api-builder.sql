--liquibase formatted sql
--changeset patcher-core:Provider_essence-api-builder dbms:postgresql runOnChange:true splitStatements:false stripComments:false
INSERT INTO s_mt.t_provider (ck_id, cv_name, ck_user, ct_change)VALUES('essence-api-builder', 'Essence Api Конструктор', '4fd05ca9-3a9e-4d66-82df-886dfa082113', '2021-05-13T09:02:13.745+0000') on conflict (ck_id) do update set ck_id = excluded.ck_id, cv_name = excluded.cv_name, ck_user = excluded.ck_user, ct_change = excluded.ct_change;
