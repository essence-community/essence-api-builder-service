--liquibase formatted sql
--changeset patcher-core:EssenceApiBuilderGetApiPath dbms:postgresql runOnChange:true splitStatements:false stripComments:false
INSERT INTO s_mt.t_query (ck_id, ck_provider, ck_user, ct_change, cr_type, cr_access, cn_action, cv_description, cc_query)
 VALUES('EssenceApiBuilderGetApiPath', 'essence-api-builder', '4fd05ca9-3a9e-4d66-82df-886dfa082113', '2021-02-07T15:53:52.053+0000', 'select', 'session', null, 'Список сервисов',
 '{
method: ''GET'',
url: `${jt_provider_params.defaultGateUrl}/api-view/path?session=${jt_in_param.sess_session}&idApiView=${jt_in_param.json.master.id}&fetch=${jt_in_param.json.filter.jn_fetch}&offset=${jt_in_param.json.filter.jn_offset}&id=${jt_in_param.json.filter.id ? jt_in_param.json.filter.id : ""}`,
resultRowParse: ''lodash.merge(jt_result_row, {ck_parent: jt_result_row.parentId ? jt_result_row.parentId : null, leaf: jt_result_row.leaf ? "true" : "false", path_method: `${jt_result_row.parentId ? jt_result_row.dRequestType + " " : ""}${jt_result_row.path}`})'',
}')
 on conflict (ck_id) do update set cc_query = excluded.cc_query, ck_provider = excluded.ck_provider, ck_user = excluded.ck_user, ct_change = excluded.ct_change, cr_type = excluded.cr_type, cr_access = excluded.cr_access, cn_action = excluded.cn_action, cv_description = excluded.cv_description;
