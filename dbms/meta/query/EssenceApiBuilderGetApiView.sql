--liquibase formatted sql
--changeset patcher-core:EssenceApiBuilderGetApiView dbms:postgresql runOnChange:true splitStatements:false stripComments:false
INSERT INTO s_mt.t_query (ck_id, ck_provider, ck_user, ct_change, cr_type, cr_access, cn_action, cv_description, cc_query)
 VALUES('EssenceApiBuilderGetApiView', 'essence-api-builder', '4fd05ca9-3a9e-4d66-82df-886dfa082113', '2021-02-07T15:53:52.053+0000', 'select', 'session', null, 'Список Апи',
 '{
method: ''GET'',
url: `${jt_provider_params.defaultGateUrl}/api-view?session=${encodeURIComponent(jt_in_param.sess_session)}&fetch=${jt_in_param.json.filter.jn_fetch}&offset=${jt_in_param.json.filter.jn_offset}&id=${jt_in_param.json.filter.id ? jt_in_param.json.filter.id : ""}`,
}')
 on conflict (ck_id) do update set cc_query = excluded.cc_query, ck_provider = excluded.ck_provider, ck_user = excluded.ck_user, ct_change = excluded.ct_change, cr_type = excluded.cr_type, cr_access = excluded.cr_access, cn_action = excluded.cn_action, cv_description = excluded.cv_description;
