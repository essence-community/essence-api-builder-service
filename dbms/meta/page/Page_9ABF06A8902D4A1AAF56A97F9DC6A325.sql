--liquibase formatted sql
--changeset patcher-core:Page_9ABF06A8902D4A1AAF56A97F9DC6A325 dbms:postgresql runOnChange:true splitStatements:false stripComments:false
INSERT INTO s_mt.t_page (ck_id, ck_parent, cr_type, cv_name, cn_order, cl_static, cv_url, ck_icon, ck_user, ct_change, cl_menu, ck_view) VALUES('9ABF06A8902D4A1AAF56A97F9DC6A325', 'FF7C023ADAD940A397E46F3BBD4A5AD6', 0, '4dea5ca4099b4827936517a58a1586d4', 60, 0, null, null, '4fd05ca9-3a9e-4d66-82df-886dfa082113', '2021-04-21T11:31:23.573+0300', 1, 'system') on conflict (ck_id) do update set ck_parent = excluded.ck_parent, cr_type = excluded.cr_type, cv_name = excluded.cv_name, cn_order = excluded.cn_order, cl_static = excluded.cl_static, cv_url = excluded.cv_url, ck_icon = excluded.ck_icon, ck_user = excluded.ck_user, ct_change = excluded.ct_change, cl_menu = excluded.cl_menu, ck_view = excluded.ck_view;
INSERT INTO s_mt.t_localization (ck_id, ck_d_lang, cr_namespace, cv_value, ck_user, ct_change)
select t.ck_id, t.ck_d_lang, t.cr_namespace, t.cv_value, t.ck_user, t.ct_change::timestamp from (
    select '4dea5ca4099b4827936517a58a1586d4' as ck_id, 'ru_RU' as ck_d_lang, 'meta' as cr_namespace, 'API Builder' as cv_value, '4fd05ca9-3a9e-4d66-82df-886dfa082113' as ck_user, '2021-04-21T11:31:16.698+0300' as ct_change
) as t 
 join s_mt.t_d_lang dl
 on t.ck_d_lang = dl.ck_id
on conflict on constraint cin_u_localization_1 do update set ck_id = excluded.ck_id, ck_d_lang = excluded.ck_d_lang, cr_namespace = excluded.cr_namespace, cv_value = excluded.cv_value, ck_user = excluded.ck_user, ct_change = excluded.ct_change;