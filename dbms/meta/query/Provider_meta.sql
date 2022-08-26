--liquibase formatted sql
--changeset patcher-core:Provider_meta dbms:postgresql runOnChange:true splitStatements:false stripComments:false
INSERT INTO s_mt.t_provider (ck_id, cv_name, ck_user, ct_change) VALUES('meta', 'Метамодель', '-11', '2018-12-12T15:56:56.251+0300') on conflict (ck_id) do update set ck_id = excluded.ck_id, cv_name = excluded.cv_name, ck_user = excluded.ck_user, ct_change = excluded.ct_change;
