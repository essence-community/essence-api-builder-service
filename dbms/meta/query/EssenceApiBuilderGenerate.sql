--liquibase formatted sql
--changeset patcher-core:EssenceApiBuilderGenerate dbms:postgresql runOnChange:true splitStatements:false stripComments:false
INSERT INTO s_mt.t_query (ck_id, ck_provider, ck_user, ct_change, cr_type, cr_access, cn_action, cv_description, cc_query)
 VALUES('EssenceApiBuilderGenerate', 'essence-api-builder', '4fd05ca9-3a9e-4d66-82df-886dfa082113', '2021-02-07T18:53:52.053+0300', 'select', 'session', null, 'Список Апи',
 '{
method: ''GET'',
url: `${jt_provider_params.defaultGateUrl}/api-view/generate?session=${encodeURIComponent(jt_in_param.sess_session)}&id=${jt_in_param.json.data.id ? jt_in_param.json.data.id : ""}`,
proxyResult: true
}'
) on conflict (ck_id) do update set cc_query = excluded.cc_query, ck_provider = excluded.ck_provider, ck_user = excluded.ck_user, ct_change = excluded.ct_change, cr_type = excluded.cr_type, cr_access = excluded.cr_access, cn_action = excluded.cn_action, cv_description = excluded.cv_description;
