--liquibase formatted sql
--changeset patcher-core:EssenceApiBuilderGetPage dbms:postgresql runOnChange:true splitStatements:false stripComments:false
INSERT INTO s_mt.t_query (ck_id, ck_provider, ck_user, ct_change, cr_type, cr_access, cn_action, cv_description, cc_query)
 VALUES('EssenceApiBuilderGetPage', 'meta', '20783', '2019-05-30T11:07:59.748+0000', 'select', 'po_session', null, 'Необходимо актуализировать',
 '/*EssenceApiBuilderGetPage*/
select
  t.ck_id,
  t.ck_parent,
  t.cr_type,
  t.cv_name,
  t.cn_order,
  t.cl_menu,
  t.cl_static,
  t.cv_url,
  t.ck_icon,
  t.cv_icon_name,
  t.cv_icon_font,
  t.leaf,
  t.root,
  t.cn_action_view,
  t.cn_action_edit,
  t.ck_view,
  t.cv_view_description,
  /* Поля аудита */
  t.ck_user,
  t.ct_change at time zone :sess_cv_timezone as ct_change
from(
  with recursive
    q as (
      select
        array[p.cn_order] as sort,
        p.ck_id,
        p.ck_parent,
        p.cr_type,
        p.cv_name,
        p.cn_order,
        p.cl_menu,
        p.cl_static,
        p.cv_url,
        p.ck_icon,
        i.cv_icon_name,
        i.cv_icon_font,
        case
          when not exists(SELECT 1 FROM s_mt.t_page m WHERE m.ck_parent = p.ck_id) then ''true''
          else ''false''
        end as leaf,
        p.cv_name as root,
        pa_view.cn_action as cn_action_view,
        pa_edit.cn_action as cn_action_edit,
        p.ck_view,
        p.ck_user,
        p.ct_change
      from s_mt.t_page p
      left join (
        select
          ck_id as ck_icon_id,
          cv_name as cv_icon_name,
          cv_font as cv_icon_font
        from s_mt.t_icon
      ) i on i.ck_icon_id = p.ck_icon
      left join s_mt.t_page_action pa_view on p.cr_type = 2 and pa_view.ck_page = p.ck_id and pa_view.cr_type = ''view''
      left join s_mt.t_page_action pa_edit on p.cr_type = 2 and pa_edit.ck_page = p.ck_id and pa_edit.cr_type = ''edit''
      where p.ck_parent is null
      union all
      select
        q.sort || p.cn_order as sort,
        p.ck_id,
        p.ck_parent,
        p.cr_type,
        p.cv_name,
        p.cn_order,
        p.cl_menu,
        p.cl_static,
        p.cv_url,
        p.ck_icon,
        i.cv_icon_name,
        i.cv_icon_font,
        case
          when not exists(SELECT 1 FROM s_mt.t_page m WHERE m.ck_parent = p.ck_id) then ''true''
          else ''false''
        end as leaf,
        q.root as root,
        pa_view.cn_action as cn_action_view,
        pa_edit.cn_action as cn_action_edit,
        p.ck_view,
        p.ck_user,
        p.ct_change
      from s_mt.t_page p
      left join (
        select
          ck_id as ck_icon_id,
          cv_name as cv_icon_name,
          cv_font as cv_icon_font
        from s_mt.t_icon
      ) i on i.ck_icon_id = p.ck_icon
      left join s_mt.t_page_action pa_view on p.cr_type = 2 and pa_view.ck_page = p.ck_id and pa_view.cr_type = ''view''
      left join s_mt.t_page_action pa_edit on p.cr_type = 2 and pa_edit.ck_page = p.ck_id and pa_edit.cr_type = ''edit''
      join q on
        p.ck_parent = q.ck_id
    )
    select
      q.ck_id,
      q.ck_parent,
      q.cr_type,
      q.cv_name,
      q.cn_order,
      q.cl_menu,
      q.cl_static,
      q.cv_url,
      q.ck_icon,
      q.cv_icon_name,
      q.cv_icon_font,
      q.leaf,
      q.root,
      q.cn_action_view,
      q.cn_action_edit,
      q.ck_view,
      tv.cv_description as cv_view_description,
      q.ck_user,
      q.ct_change
    from q
    join s_mt.t_view tv on
    tv.ck_id = q.ck_view

)t
where &FILTER
/*##filter.ck_id*/ and t.ck_id = (:json::jsonb#>>''{filter,ck_id}'')/*filter.ck_id##*/
    order by &SORT, t.cn_order asc
  

   ')
 on conflict (ck_id) do update set cc_query = excluded.cc_query, ck_provider = excluded.ck_provider, ck_user = excluded.ck_user, ct_change = excluded.ct_change, cr_type = excluded.cr_type, cr_access = excluded.cr_access, cn_action = excluded.cn_action, cv_description = excluded.cv_description;
