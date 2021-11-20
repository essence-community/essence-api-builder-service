--liquibase formatted sql
--changeset patcher-core:EssenceApiBuilderGetObject dbms:postgresql runOnChange:true splitStatements:false stripComments:false
INSERT INTO s_mt.t_query (ck_id, ck_provider, ck_user, ct_change, cr_type, cr_access, cn_action, cv_description, cc_query)
 VALUES('EssenceApiBuilderGetObject', 'meta', '4fd05ca9-3a9e-4d66-82df-886dfa082113', '2019-05-30T11:07:59.748+0000', 'select', 'free', null, 'Дерево объекта',
 '/*EssenceApiBuilderGetObject*/
select pkg_json.f_get_origin_object(:objectId) as json

   ')
 on conflict (ck_id) do update set cc_query = excluded.cc_query, ck_provider = excluded.ck_provider, ck_user = excluded.ck_user, ct_change = excluded.ct_change, cr_type = excluded.cr_type, cr_access = excluded.cr_access, cn_action = excluded.cn_action, cv_description = excluded.cv_description;
