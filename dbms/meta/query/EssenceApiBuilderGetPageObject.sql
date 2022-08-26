--liquibase formatted sql
--changeset patcher-core:EssenceApiBuilderGetPageObject dbms:postgresql runOnChange:true splitStatements:false stripComments:false
INSERT INTO s_mt.t_query (ck_id, ck_provider, ck_user, ct_change, cr_type, cr_access, cn_action, cv_description, cc_query)
 VALUES('EssenceApiBuilderGetPageObject', 'meta', '4fd05ca9-3a9e-4d66-82df-886dfa082113', '2019-05-30T14:07:59.748+0300', 'select', 'po_session', null, 'Необходимо актуализировать',
 '/*EssenceApiBuilderGetPageObject*/
with recursive t1(
    ck_id,
    ck_parent,
    ck_object,
    ck_object_crud,
    cn_order,
    cv_name,
    ck_class,
    cv_class_name,
    cl_dataset,
    cv_path
) as (
    /* сначала выберем все объекты которые могут быть отображены */
    select
        tpo.ck_id,
        tpo.ck_parent,
        tpo.ck_object,
        case when tc.cl_dataset = 1 then tpo.ck_object else null end as ck_object_crud,
        tpo.cn_order,
        to2.cv_name,
        to2.ck_class,
        tc.cv_name as cv_class_name,
        tc.cl_dataset,
        (to2.cv_name || '''')::text as cv_path
    from
        s_mt.t_page_object tpo
    join s_mt.t_object to2 
      on tpo.ck_object = to2.ck_id
    join s_mt.t_class tc 
      on to2.ck_class = tc.ck_id
    where
        tpo.ck_parent is null and tpo.ck_page = :json::jsonb#>>''{master,ck_id}''
union all /* выберем их дочернии элементы в рекурсивном запросе */
    select
        tpo.ck_id,
        tpo.ck_parent,
        tpo.ck_object,
        case when tc.cl_dataset = 1 then tpo.ck_object else null end as ck_object_crud,
        tpo.cn_order,
        to2.cv_name,
        to2.ck_class,
        tc.cv_name as cv_class_name,
        tc.cl_dataset,
        op.cv_path || '' -> '' || to2.cv_name as cv_path
    from
        t1 op
    join s_mt.t_page_object tpo on
        op.ck_id = tpo.ck_parent
    join s_mt.t_object to2 
      on tpo.ck_object = to2.ck_id
    join s_mt.t_class tc 
      on to2.ck_class = tc.ck_id
)
select t1.* from t1
where ( &FILTER )
order by &SORT

   '
) on conflict (ck_id) do update set cc_query = excluded.cc_query, ck_provider = excluded.ck_provider, ck_user = excluded.ck_user, ct_change = excluded.ct_change, cr_type = excluded.cr_type, cr_access = excluded.cr_access, cn_action = excluded.cn_action, cv_description = excluded.cv_description;
